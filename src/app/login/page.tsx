"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, GitBranch, Shield, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";

export default function LoginPage() {
  const { user, loading: authLoading, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If user is already authenticated, redirect to /dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      // Redirect is handled by the useEffect below once user becomes non-null
    } catch (err: unknown) {
      setIsLoggingIn(false);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError?.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completion.");
      } else if (firebaseError?.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else if (firebaseError?.code === "auth/cancelled-popup-request") {
        setError("Another sign-in popup is already open.");
      } else {
        setError(firebaseError?.message || "Failed to sign in with Google.");
      }
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await loginWithGithub();
      // Redirect is handled by the useEffect below once user becomes non-null
    } catch (err: unknown) {
      setIsLoggingIn(false);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError?.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed before completion.");
      } else if (firebaseError?.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection.");
      } else if (firebaseError?.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with a different sign-in method.");
      } else {
        setError(firebaseError?.message || "Failed to sign in with GitHub.");
      }
    }
  };

  const isPending = authLoading || isLoggingIn;

  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] flex items-center justify-center px-4 dot-grid">
      {/* Background glow */}
      <div className="fixed inset-0 hero-gradient pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-sm z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 glow-brand">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">RepoLens</span>
          </div>
          <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
            Convert any GitHub repository into technical interview confidence
          </p>
        </div>

        <div className="gradient-border">
          <div className="rounded-xl bg-[oklch(0.11_0_0)] p-7">
            <h2 className="text-base font-semibold text-white mb-5 text-center">
              Sign in to your account
            </h2>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* OAuth buttons only */}
            <div className="space-y-3">
              <Button
                onClick={handleGithubLogin}
                disabled={isPending}
                className="w-full h-11 bg-white hover:bg-zinc-100 text-zinc-900 border-0 text-sm font-semibold gap-2.5 transition-all duration-150 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                ) : (
                  <GitBranch className="w-4 h-4 text-zinc-900" />
                )}
                Continue with GitHub
              </Button>

              <Button
                onClick={handleGoogleLogin}
                disabled={isPending}
                variant="outline"
                className="w-full h-11 border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 hover:text-white text-sm font-medium gap-2.5 transition-all duration-150 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Continue with Google
              </Button>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> SOC 2 Compliant
          </span>
          <span>·</span>
          <span>OAuth Secure</span>
          <span>·</span>
          <span>No code stored</span>
        </div>
      </motion.div>
    </div>
  );
}
