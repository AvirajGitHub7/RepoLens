/**
 * interview.model.ts
 *
 * Defines the raw Firestore document shape for the `interviews` collection
 * and a typed FirestoreDataConverter that bridges MockSession ↔ Firestore.
 */

import {
  Timestamp,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import type { MockSession } from "@/lib/types";

// ─── Firestore document shape ─────────────────────────────────────────────────

export interface InterviewDocument {
  id: string;
  analysisId: string;
  userId: string;
  role: string;
  mode: MockSession["mode"];
  status: MockSession["status"];
  turns: MockSession["turns"];
  currentTurnIndex: number;
  overallScore: number | null;
  summary: string | null;
  createdAt: Timestamp;
  completedAt: Timestamp | null;
}

// ─── Converter ────────────────────────────────────────────────────────────────

export const interviewConverter: FirestoreDataConverter<MockSession> = {
  toFirestore(session: MockSession): DocumentData {
    return {
      id: session.id,
      analysisId: session.analysisId,
      userId: session.userId,
      role: session.role,
      mode: session.mode,
      status: session.status,
      turns: session.turns,
      currentTurnIndex: session.currentTurnIndex,
      overallScore: session.overallScore,
      summary: session.summary,
      createdAt: Timestamp.fromDate(new Date(session.createdAt)),
      completedAt: session.completedAt
        ? Timestamp.fromDate(new Date(session.completedAt))
        : null,
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): MockSession {
    const d = snapshot.data(options) as InterviewDocument;
    return {
      id: snapshot.id,
      analysisId: d.analysisId,
      userId: d.userId,
      role: d.role,
      mode: d.mode,
      status: d.status,
      turns: d.turns,
      currentTurnIndex: d.currentTurnIndex,
      overallScore: d.overallScore,
      summary: d.summary,
      createdAt: d.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
      completedAt: d.completedAt ? d.completedAt.toDate().toISOString() : null,
    };
  },
};
