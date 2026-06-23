import { updateAnalysis, getAnalysis } from "@/lib/db/repositories/analysis.repository";
import { incrementAnalysisQuota } from "@/lib/db/repositories/user.repository";
import { fetchRepoData } from "./github/github.service";
import { generateAIAnalysis } from "@/lib/actions/ai.actions";

export async function processGithubAnalysis(analysisId: string, repoUrl: string, githubToken?: string | null): Promise<void> {
  try {
    // 1. Initial status update
    await updateAnalysis(analysisId, {
      status: "fetching",
      progress: 10,
    });

    // 2. Fetch GitHub Data
    const { repoMeta, techStack } = await fetchRepoData(repoUrl, async (progress) => {
      // Update progress during fetching (30, 50, 70)
      await updateAnalysis(analysisId, { progress });
    }, githubToken);

    // Simple readiness score logic based on raw data
    const readinessScore = Math.min(100, 50 + (techStack.languages.length * 10) + (repoMeta.readme ? 20 : 0));

    // Save fetched data and transition to AI Analysis
    await updateAnalysis(analysisId, {
      progress: 80,
      status: "analyzing",
      repoMeta,
      techStack,
      readinessScore,
    });

    // 3. AI Analysis Generation
    const aiResults = await generateAIAnalysis(repoMeta, techStack);

    // 4. Final Update
    await updateAnalysis(analysisId, {
      ...aiResults,
      progress: 100,
      status: "completed",
      completedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.warn("Pipeline Orchestration Error (Handled):", error instanceof Error ? error.message : error);
    await updateAnalysis(analysisId, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "An unexpected error occurred during analysis.",
    });
    
    // Refund the quota if orchestration fails
    try {
      const analysis = await getAnalysis(analysisId);
      if (analysis) {
        await incrementAnalysisQuota(analysis.userId, -1);
      }
    } catch (refundError) {
      console.error("Failed to refund analysis quota:", refundError);
    }
  }
}
