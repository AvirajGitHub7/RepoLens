"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { syncUserProfile } from "@/lib/db";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Single source of auth truth — handles initial hydration + every auth state change.
  // setLoading(false) is always called here, so login/logout functions don't need to
  // manage it manually (which previously caused race conditions).
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Delegate to the user repository — single source of truth for Firestore writes
          await syncUserProfile(currentUser);
        } catch (error) {
          // Do not block the session if Firestore sync fails
          console.error("Error syncing user profile with Firestore:", error);
        }
      } else {
        setUser(null);
      }
      // Always clear loading once auth state is resolved (login, logout, or page refresh)
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Login with Google.
   * We do NOT set loading=true here — onAuthStateChanged already fires after
   * signInWithPopup resolves and handles setLoading(false) itself.
   * Setting loading=true here caused a double-loading-state race condition.
   */
  const loginWithGoogle = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

  const loginWithGithub = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        sessionStorage.setItem("githubToken", credential.accessToken);
      }
    } catch (error) {
      console.error("GitHub login failed:", error);
      throw error;
    }
  };

  /**
   * Logout.
   * onAuthStateChanged fires with null after signOut and sets user=null + loading=false.
   * No need to manually manage loading state here.
   */
  const logout = async (): Promise<void> => {
    try {
      sessionStorage.removeItem("githubToken");
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithGithub,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
