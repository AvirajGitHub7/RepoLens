/**
 * analysis.repository.ts
 *
 * Firestore CRUD functions for the `analyses` collection.
 *
 * NOTE: `getAnalysesByUser` uses a compound query (userId + createdAt).
 * Firestore will prompt you to create a composite index the first time
 * this query runs in development — follow the console link it provides.
 */

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Analysis } from "@/lib/types";
import { analysisConverter } from "../models/analysis.model";

const COLLECTION = "analyses";

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a single analysis by its document ID.
 * Returns `null` if not found.
 */
export async function getAnalysis(id: string): Promise<Analysis | null> {
  const ref = doc(db, COLLECTION, id).withConverter(analysisConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Fetch all analyses belonging to a user, ordered newest-first.
 * Sorts on the client to avoid requiring a composite Firestore index.
 */
export async function getAnalysesByUser(userId: string): Promise<Analysis[]> {
  const col = collection(db, COLLECTION).withConverter(analysisConverter);
  const q = query(col, where("userId", "==", userId));
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => d.data());
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Create a new analysis document at `analyses/{analysis.id}`.
 * Overwrites any existing document with the same id.
 */
export async function createAnalysis(analysis: Analysis): Promise<void> {
  const ref = doc(db, COLLECTION, analysis.id).withConverter(analysisConverter);
  await setDoc(ref, analysis);
}

/**
 * Recursively removes undefined values from an object to prevent Firestore updateDoc crashes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stripUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(stripUndefined);
  } else if (obj !== null && typeof obj === "object") {
    // Preserve Firestore Timestamp objects
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (obj as any).toDate === "function") return obj;
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
      const val = (obj as Record<string, unknown>)[key];
      if (val !== undefined) {
        newObj[key] = stripUndefined(val);
      }
    }
    return newObj;
  }
  return obj;
}

/**
 * Merge a partial update into an existing analysis document.
 * Date fields passed as ISO strings will be converted to Timestamps.
 */
export async function updateAnalysis(
  id: string,
  partial: Partial<Omit<Analysis, "id">>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  let dataToUpdate: Record<string, unknown> = { ...partial };

  if (partial.createdAt) {
    dataToUpdate.createdAt = Timestamp.fromDate(new Date(partial.createdAt));
  }
  if (partial.completedAt) {
    dataToUpdate.completedAt = Timestamp.fromDate(new Date(partial.completedAt));
  }

  // Firestore updateDoc throws an error if any nested field is undefined.
  dataToUpdate = stripUndefined(dataToUpdate);

  await updateDoc(ref, dataToUpdate);
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Permanently delete an analysis document.
 */
export async function deleteAnalysis(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
