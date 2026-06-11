/**
 * user.model.ts
 *
 * Defines the raw Firestore document shape for the `users` collection
 * and a typed FirestoreDataConverter that bridges UserProfile ↔ Firestore.
 *
 * Timestamps are kept as Firestore `Timestamp` objects in the document but
 * converted to ISO strings in the application domain (UserProfile).
 */

import {
  Timestamp,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import type { UserProfile } from "@/lib/types";

// ─── Firestore document shape ─────────────────────────────────────────────────

export interface UserProfileDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  githubUsername: string | null;
  plan: UserProfile["plan"];
  analysisQuota: { used: number; limit: number };
  providerId: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// ─── Converter ────────────────────────────────────────────────────────────────

export const userConverter: FirestoreDataConverter<UserProfile> = {
  toFirestore(profile: UserProfile): DocumentData {
    return {
      uid: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      photoURL: profile.photoURL ?? null,
      githubUsername: profile.githubUsername ?? null,
      plan: profile.plan,
      analysisQuota: profile.analysisQuota,
      providerId: profile.providerId ?? "unknown",
      createdAt: Timestamp.fromDate(new Date(profile.createdAt)),
      lastLogin: profile.lastLogin
        ? Timestamp.fromDate(new Date(profile.lastLogin))
        : Timestamp.now(),
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): UserProfile {
    const d = snapshot.data(options) as UserProfileDocument;
    return {
      uid: d.uid,
      email: d.email ?? "",
      displayName: d.displayName ?? "",
      photoURL: d.photoURL,
      githubUsername: d.githubUsername,
      plan: d.plan ?? "free",
      analysisQuota: d.analysisQuota ?? { used: 0, limit: 5 },
      providerId: d.providerId,
      createdAt: d.createdAt?.toDate().toISOString() ?? new Date().toISOString(),
      lastLogin: d.lastLogin?.toDate().toISOString(),
    };
  },
};
