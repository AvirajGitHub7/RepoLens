/**
 * user.repository.ts
 *
 * Single source of truth for all Firestore reads/writes on the `users` collection.
 *
 * NOTE: AuthContext delegates its user-sync logic to `syncUserProfile` here,
 * so no duplicate user-creation logic exists in the codebase.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  UpdateData,
  increment,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";
import { userConverter } from "../models/user.model";

const COLLECTION = "users";

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a user profile by UID.
 * Returns `null` if the document does not exist.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const ref = doc(db, COLLECTION, uid).withConverter(userConverter);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Create (or fully overwrite) a user profile document at `users/{uid}`.
 * Prefer `syncUserProfile` for auth-time writes; use this for explicit creates.
 */
export async function createUserProfile(profile: UserProfile): Promise<void> {
  const ref = doc(db, COLLECTION, profile.uid).withConverter(userConverter);
  await setDoc(ref, profile);
}

/**
 * Merge a partial update into an existing user profile.
 * `lastLogin` is automatically refreshed via `serverTimestamp()` on every call.
 */
export async function updateUserProfile(
  uid: string,
  partial: Partial<Omit<UserProfile, "uid" | "createdAt">>
): Promise<void> {
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, {
    ...(partial as UpdateData<UserProfile>),
    lastLogin: serverTimestamp(),
  });
}

/**
 * Increment the user's used analysis quota by amount (default 1).
 * Can pass -1 to refund quota on failure.
 */
export async function incrementAnalysisQuota(uid: string, amount: number = 1): Promise<void> {
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, {
    "analysisQuota.used": increment(amount),
  });
}

/**
 * Synchronises a Firebase Auth user with the `users` Firestore collection.
 *
 * - **First login**: creates a complete profile with default plan / quota.
 * - **Subsequent logins**: merges only `lastLogin`, `displayName`, and `photoURL`.
 *
 * This is the **only** place where user documents are created or updated on login.
 * AuthContext imports and calls this function directly — no duplicate logic.
 *
 * Gracefully handles the `unavailable` Firestore error that occurs when
 * onAuthStateChanged fires from a cached auth token before Firestore's network
 * connection is established (common on initial page load). Sync is deferred
 * until the next session if this happens.
 */
export async function syncUserProfile(firebaseUser: User): Promise<void> {
  try {
    const typedRef = doc(db, COLLECTION, firebaseUser.uid).withConverter(userConverter);
    const snap = await getDoc(typedRef);

    if (!snap.exists()) {
      // ── First login: create a complete profile ──────────────────────────────
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        displayName: firebaseUser.displayName ?? "",
        photoURL: firebaseUser.photoURL,
        githubUsername: null,
        plan: "free",
        analysisQuota: { used: 0, limit: 5 },
        providerId: firebaseUser.providerData[0]?.providerId ?? "unknown",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      await setDoc(typedRef, newProfile);
    } else {
      // ── Subsequent login: merge mutable display fields + refresh lastLogin ──
      const existing = snap.data();
      // Use raw ref so `serverTimestamp()` can be passed without converter interference
      const rawRef = doc(db, COLLECTION, firebaseUser.uid);
      await setDoc(
        rawRef,
        {
          lastLogin: serverTimestamp(),
          displayName: firebaseUser.displayName || existing.displayName,
          photoURL: firebaseUser.photoURL || existing.photoURL,
        },
        { merge: true }
      );
    }
  } catch (error: unknown) {
    const fsError = error as { code?: string };

    if (fsError?.code === "unavailable") {
      // Firestore is temporarily offline (network not ready on page load).
      // This is non-fatal — the session is still valid and the user can use the app.
      // Profile sync will succeed automatically on the next login or page load.
      console.warn(
        "[RepoLens] Firestore offline — user profile sync deferred until reconnected."
      );
      return;
    }

    if (fsError?.code === "failed-precondition") {
      // Multiple tabs open and IndexedDB persistence already claimed by another tab.
      // Non-fatal in multi-tab scenarios.
      console.warn(
        "[RepoLens] Firestore persistence conflict (multiple tabs) — profile sync deferred."
      );
      return;
    }

    // Re-throw all other errors (permission denied, invalid data, etc.)
    throw error;
  }
}

