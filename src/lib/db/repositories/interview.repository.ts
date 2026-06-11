/**
 * interview.repository.ts
 *
 * Firestore CRUD functions for the `interviews` collection.
 *
 * NOTE: `getInterviewsByUser` uses a compound query (userId + createdAt).
 * Firestore will prompt you to create a composite index the first time
 * this query runs in development — follow the console link it provides.
 */

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  UpdateData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { MockSession } from "@/lib/types";
import { interviewConverter } from "../models/interview.model";

const COLLECTION = "interviews";

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a single interview session by its document ID.
 * Returns `null` if not found.
 */
export async function getInterview(id: string): Promise<MockSession | null> {
  const ref = doc(db, COLLECTION, id).withConverter(interviewConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Fetch all interview sessions belonging to a user, ordered newest-first.
 *
 * Requires a composite Firestore index: `userId ASC, createdAt DESC`.
 * Firestore will auto-prompt index creation on the first run.
 */
export async function getInterviewsByUser(userId: string): Promise<MockSession[]> {
  const col = collection(db, COLLECTION).withConverter(interviewConverter);
  const q = query(col, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Save (create or overwrite) an interview session at `interviews/{session.id}`.
 * Use this for both initial saves and full replacements (e.g. after session ends).
 */
export async function saveInterview(session: MockSession): Promise<void> {
  const ref = doc(db, COLLECTION, session.id).withConverter(interviewConverter);
  await setDoc(ref, session);
}

/**
 * Merge a partial update into an existing interview document.
 * Useful for incremental updates during an active session (e.g. appending a turn).
 */
export async function updateInterview(
  id: string,
  partial: Partial<Omit<MockSession, "id">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, partial as UpdateData<MockSession>);
}
