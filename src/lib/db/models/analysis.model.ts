/**
 * analysis.model.ts
 *
 * Defines the raw Firestore document shape for the `analyses` collection
 * and a typed FirestoreDataConverter that bridges Analysis ↔ Firestore.
 */

import {
  Timestamp,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import type { Analysis } from "@/lib/types";

// ─── Firestore document shape ─────────────────────────────────────────────────

export interface AnalysisDocument {
  id: string;
  userId: string;
  repoUrl: string;
  repoMeta: Analysis["repoMeta"];
  status: Analysis["status"];
  progress: number;
  readinessScore: number | null;
  techStack: Analysis["techStack"];
  createdAt: Timestamp;
  completedAt: Timestamp | null;
  errorMessage: string | null;

  summary?: string;
  architecture?: string;
  resumeBullets?: string[];
  interviewQuestions?: Analysis["interviewQuestions"];
  hrQuestions?: Analysis["hrQuestions"];
  systemDesignQuestions?: Analysis["systemDesignQuestions"];
  elevatorPitch30s?: string;
  elevatorPitch60s?: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}

// ─── Converter ────────────────────────────────────────────────────────────────

export const analysisConverter: FirestoreDataConverter<Analysis> = {
  toFirestore(analysis: Analysis): DocumentData {
    return {
      id: analysis.id,
      userId: analysis.userId,
      repoUrl: analysis.repoUrl,
      repoMeta: analysis.repoMeta,
      status: analysis.status,
      progress: analysis.progress,
      readinessScore: analysis.readinessScore,
      techStack: analysis.techStack,
      createdAt: Timestamp.fromDate(new Date(analysis.createdAt)),
      completedAt: analysis.completedAt
        ? Timestamp.fromDate(new Date(analysis.completedAt))
        : null,
      errorMessage: analysis.errorMessage,
      ...(analysis.summary && { summary: analysis.summary }),
      ...(analysis.architecture && { architecture: analysis.architecture }),
      ...(analysis.resumeBullets && { resumeBullets: analysis.resumeBullets }),
      ...(analysis.interviewQuestions && { interviewQuestions: analysis.interviewQuestions }),
      ...(analysis.hrQuestions && { hrQuestions: analysis.hrQuestions }),
      ...(analysis.systemDesignQuestions && { systemDesignQuestions: analysis.systemDesignQuestions }),
      ...(analysis.elevatorPitch30s && { elevatorPitch30s: analysis.elevatorPitch30s }),
      ...(analysis.elevatorPitch60s && { elevatorPitch60s: analysis.elevatorPitch60s }),
      ...(analysis.strengths && { strengths: analysis.strengths }),
      ...(analysis.weaknesses && { weaknesses: analysis.weaknesses }),
      ...(analysis.recommendations && { recommendations: analysis.recommendations }),
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Analysis {
    const d = snapshot.data(options) as AnalysisDocument;
    return {
      id: snapshot.id,
      userId: d.userId,
      repoUrl: d.repoUrl,
      repoMeta: d.repoMeta,
      status: d.status,
      progress: d.progress,
      readinessScore: d.readinessScore,
      techStack: d.techStack,
      createdAt: d.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
      completedAt: d.completedAt ? d.completedAt.toDate().toISOString() : null,
      errorMessage: d.errorMessage,
      summary: d.summary,
      architecture: d.architecture,
      resumeBullets: d.resumeBullets,
      interviewQuestions: d.interviewQuestions,
      hrQuestions: d.hrQuestions,
      systemDesignQuestions: d.systemDesignQuestions,
      elevatorPitch30s: d.elevatorPitch30s,
      elevatorPitch60s: d.elevatorPitch60s,
      strengths: d.strengths,
      weaknesses: d.weaknesses,
      recommendations: d.recommendations,
    };
  },
};
