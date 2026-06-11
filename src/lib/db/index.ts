/**
 * src/lib/db/index.ts
 *
 * Barrel export for the entire Firestore data layer.
 * Import anything Firestore-related from "@/lib/db" instead of deep paths.
 *
 * Example:
 *   import { getUserProfile, createAnalysis } from "@/lib/db";
 */

// ─── User Repository ──────────────────────────────────────────────────────────
export {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  syncUserProfile,
} from "./repositories/user.repository";

// ─── Analysis Repository ──────────────────────────────────────────────────────
export {
  createAnalysis,
  getAnalysis,
  getAnalysesByUser,
  updateAnalysis,
  deleteAnalysis,
} from "./repositories/analysis.repository";

// ─── Interview Repository ─────────────────────────────────────────────────────
export {
  saveInterview,
  getInterview,
  getInterviewsByUser,
  updateInterview,
} from "./repositories/interview.repository";

// ─── Document shape types (for advanced consumers) ───────────────────────────
export type { UserProfileDocument } from "./models/user.model";
export type { AnalysisDocument } from "./models/analysis.model";
export type { InterviewDocument } from "./models/interview.model";
