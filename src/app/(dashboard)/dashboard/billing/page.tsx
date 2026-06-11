"use client";

import { motion } from "framer-motion";
import { CreditCard, Check, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const { profile, loading } = useUserProfile();

  const quotaUsed = profile?.analysisQuota?.used ?? 0;
  const quotaLimit = profile?.analysisQuota?.limit ?? 5;
  const quotaPct = Math.min(Math.round((quotaUsed / quotaLimit) * 100), 100);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          Billing & Usage
        </h1>
        <p className="text-sm text-zinc-500">Manage your subscription plan and monitor your analysis quota.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Plan (Free) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="p-6 rounded-2xl border border-white/[0.08] bg-[oklch(0.12_0_0)] relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 p-6">
            <Badge className="bg-white/10 text-zinc-300 hover:bg-white/10 border-0">Current Plan</Badge>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2">Developer Free</h2>
            <p className="text-sm text-zinc-400">Everything you need to get started with RepoLens.</p>
          </div>
          
          <div className="mb-8">
            <span className="text-4xl font-extrabold text-white">$0</span>
            <span className="text-zinc-500 font-medium">/month</span>
          </div>

          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              Up to 5 comprehensive repository analyses
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              Basic Mock Interview questions
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              Standard system design diagrams
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400">Analysis Quota</span>
              <span className="text-xs font-medium text-white">
                {loading ? <Loader2 className="w-3 h-3 animate-spin inline" /> : `${quotaUsed} / ${quotaLimit}`}
              </span>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  quotaPct > 80 ? "bg-amber-500" : "bg-indigo-500"
                )}
                style={{ width: `${quotaPct}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Pro Plan (Coming Soon) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.02] relative overflow-hidden flex flex-col"
        >
          <div className="absolute top-0 right-0 p-6">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20">Coming Soon</Badge>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              RepoLens Pro <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-sm text-indigo-200/60">Unlock unlimited potential for your entire team.</p>
          </div>
          
          <div className="mb-8 flex items-end gap-2">
            <div className="w-24 h-10 rounded-lg bg-white/[0.04] animate-pulse" />
            <span className="text-zinc-500 font-medium mb-1">/month</span>
          </div>

          <div className="space-y-4 mb-8 flex-1 opacity-70">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-indigo-400" />
              </div>
              Unlimited repository analyses
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-indigo-400" />
              </div>
              Advanced AI models (Claude 3.5 Sonnet, GPT-4o)
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-indigo-400" />
              </div>
              Private repository support (GitHub App Integration)
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-indigo-400" />
              </div>
              Priority processing queue
            </div>
          </div>

          <Button disabled className="w-full bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
            Waitlist Available Soon
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
