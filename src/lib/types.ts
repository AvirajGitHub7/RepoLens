// ─── Analysis ─────────────────────────────────────────────────────────────────

export type AnalysisStatus =
  | "queued"
  | "fetching"
  | "analyzing"
  | "completed"
  | "failed";

export type SectionType =
  | "summary"
  | "architecture"
  | "techStack"
  | "interviewQuestions"
  | "hrQuestions"
  | "systemDesign";

export interface RepoMeta {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  isPrivate: boolean;
  updatedAt: string;
  size: number;
  url: string;
  readme?: string | null;
  defaultBranch?: string;
  structure?: RepoStructureItem[];
}

export interface RepoStructureItem {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  databases: string[];
  devops: string[];
  testing: string[];
}

export interface Analysis {
  id: string;
  userId: string;
  repoUrl: string;
  repoMeta: RepoMeta;
  status: AnalysisStatus;
  progress: number;
  readinessScore: number | null;
  techStack: TechStack;
  createdAt: string;
  completedAt: string | null;
  errorMessage: string | null;

  // AI Generated Results
  summary?: string;
  architecture?: string;
  resumeBullets?: string[];
  interviewQuestions?: InterviewQuestion[];
  hrQuestions?: HRQuestion[];
  systemDesignQuestions?: SystemDesignScenario[];
  elevatorPitch30s?: string;
  elevatorPitch60s?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

// ─── Interview Questions ───────────────────────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionCategory =
  | "architecture"
  | "tech-choices"
  | "problem-solving"
  | "scalability"
  | "security"
  | "behavioral"
  | "system-design";

export interface InterviewQuestion {
  id: string;
  question: string;
  expectedAnswer: string;
  difficulty: Difficulty;
  category: QuestionCategory;
  tip?: string;
}

export interface HRQuestion {
  id: string;
  question: string;
  tip: string;
  focus: string;
}

export interface SystemDesignScenario {
  scenario: string;
  components: { name: string; role: string }[];
  tradeoffs: string[];
  followUps: string[];
}

// ─── Mock Interview ────────────────────────────────────────────────────────────

export type MockSessionStatus = "active" | "completed" | "abandoned";
export type MockSessionMode =
  | "behavioral"
  | "technical"
  | "system-design"
  | "mixed";

export interface MockTurn {
  id: string;
  question: string;
  questionCategory: QuestionCategory;
  difficulty: Difficulty;
  userAnswer: string;
  aiFeedback: string;
  score: number;
  strengths: string[];
  improvements: string[];
}

export interface MockSession {
  id: string;
  analysisId: string;
  userId: string;
  role: string;
  mode: MockSessionMode;
  status: MockSessionStatus;
  turns: MockTurn[];
  currentTurnIndex: number;
  overallScore: number | null;
  summary: string | null;
  createdAt: string;
  completedAt: string | null;
}

// ─── User ──────────────────────────────────────────────────────────────────────

export type UserPlan = "free" | "pro" | "team";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  githubUsername: string | null;
  geminiApiKey?: string | null;
  plan: UserPlan;
  analysisQuota: {
    used: number;
    limit: number;
  };
  createdAt: string;
  /** ISO string — set on every login */
  lastLogin?: string;
  /** Firebase Auth provider id e.g. "google.com", "github.com" */
  providerId?: string;
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────────

export interface DashboardStats {
  totalAnalyses: number;
  avgReadinessScore: number;
  totalQuestionsGenerated: number;
  totalMockSessions: number;
}
