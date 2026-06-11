"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Zap } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[oklch(0.08_0_0)] flex flex-col items-center justify-center relative dot-grid">
        {/* Background glow */}
        <div className="fixed inset-0 hero-gradient pointer-events-none" />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 glow-brand animate-pulse">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-wide">Securing Session</h2>
            <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="w-1/2 h-full bg-indigo-500 rounded-full animate-[shimmer_1.5s_infinite] shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
