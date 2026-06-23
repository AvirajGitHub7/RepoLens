"use server";

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RepoMeta, TechStack } from "@/lib/types";

// Check if API key exists. If not, we might want to return dummy data or throw.
// But we'll initialize dynamically so it doesn't crash at module load if missing.

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "Executive summary of the repository" },
    architecture: { type: Type.STRING, description: "Architecture breakdown and design patterns used" },
    resumeBullets: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3-5 resume bullet points highlighting the impact and technical achievements of this repository"
    },
    interviewQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          expectedAnswer: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["easy", "medium", "hard"] },
          category: { type: Type.STRING, enum: ["architecture", "tech-choices", "problem-solving", "scalability", "security", "behavioral", "system-design"] },
          tip: { type: Type.STRING }
        },
        required: ["id", "question", "expectedAnswer", "difficulty", "category"]
      }
    },
    hrQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          tip: { type: Type.STRING },
          focus: { type: Type.STRING }
        },
        required: ["id", "question", "tip", "focus"]
      }
    },
    systemDesignQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scenario: { type: Type.STRING },
          components: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING }
              },
              required: ["name", "role"]
            }
          },
          tradeoffs: { type: Type.ARRAY, items: { type: Type.STRING } },
          followUps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["scenario", "components", "tradeoffs", "followUps"]
      }
    },
    elevatorPitch30s: { type: Type.STRING },
    elevatorPitch60s: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "summary", 
    "architecture", 
    "resumeBullets", 
    "interviewQuestions", 
    "hrQuestions", 
    "systemDesignQuestions",
    "elevatorPitch30s",
    "elevatorPitch60s",
    "strengths",
    "weaknesses",
    "recommendations"
  ]
};

export async function generateAIAnalysis(repoMeta: RepoMeta, techStack: TechStack) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // Prepare context
  const repoContent = `
    Repository: ${repoMeta.fullName}
    Description: ${repoMeta.description}
    Languages: ${techStack.languages.join(", ")}
    Topics: ${repoMeta.topics.join(", ")}
    
    Structure (Max 50 items):
    ${repoMeta.structure?.slice(0, 50).map(i => i.path).join("\n")}
    
    README Snippet:
    ${repoMeta.readme ? repoMeta.readme.slice(0, 3000) : "No README available."}
  `;

    const prompt = `
    You are an expert technical interviewer and senior staff engineer.
    Analyze the following GitHub repository context and generate a comprehensive software engineering interview preparation report.
    Return ONLY valid JSON matching the requested schema. Do not use markdown wrappers around the JSON.
    
    IMPORTANT INSTRUCTION for "architecture" field:
    1. The architecture MUST begin with a clean, vertical ASCII tree structure representing the system's architecture (NOT a horizontal folder list). It must include directories, main components, backend flow, database interactions, authentication flow, and any background jobs/services if present.
    Example:
    \`\`\`text
    src
    ├── config/
    │   ├── database.ts                # DB config
    │   └── client.ts                  # Prisma client instance
    ├── core/
    │   └── AppError.ts                # Custom error class
    ├── modules/
    │   ├── auth/                      # Prisma Module (OOP)
    │   │   ├── auth.routes.ts
    │   │   └── auth.controller.ts
    │   └── merch/                     # Mongoose Module
    └── server.ts                      # App entry point
    \`\`\`
    2. AFTER the tree structure, provide concise explanations of the architecture, including backend flow, database interactions, authentication flow, and any background jobs/services. Format these explanations as standard markdown paragraphs and lists.
    
    Context:
    ${repoContent}
  `;

  let retries = 3;
  let delay = 2000; // start with 2 second delay
  let currentModel = "gemini-2.5-flash";

  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      });

      if (!response.text) {
        throw new Error("No response from AI model.");
      }

      let jsonText = response.text.trim();
      
      // Robustly extract the JSON object by finding the first { and last }
      const start = jsonText.indexOf('{');
      const end = jsonText.lastIndexOf('}');
      
      if (start !== -1 && end !== -1) {
        jsonText = jsonText.substring(start, end + 1);
      } else {
        throw new Error("Response did not contain a valid JSON object.");
      }
      
      const parsed = JSON.parse(jsonText);
      
      return parsed;
    } catch (error: unknown) {
      const err = error as { status?: number; response?: { status?: number } };
      const status = err?.status || err?.response?.status;
      
      if (status === 503 || status === 429) {
        if (retries > 1) {
          console.warn(`[${currentModel}] API overloaded (${status}). Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries--;
          delay *= 2; // exponential backoff
        } else if (currentModel === "gemini-2.5-flash") {
          console.warn(`[${currentModel}] exhausted retries. Falling back to gemini-2.5-flash-lite...`);
          currentModel = "gemini-2.5-flash-lite";
          retries = 2; // give the fallback model 2 attempts
          delay = 2000;
        } else {
          console.error("AI Generation Error (Fallback Exhausted):", error);
          throw new Error(`Failed to generate AI analysis. Both models are experiencing high demand (${status}).`);
        }
      } else {
        console.error("AI Generation Error:", error);
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to generate AI analysis: ${errorMsg}`);
      }
    }
  }
}
