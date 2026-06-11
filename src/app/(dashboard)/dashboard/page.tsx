"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  GitBranch,
  Brain,
  MessageSquare,
  BarChart3,
  ArrowRight,
  TrendingUp,
  Zap,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisCard } from "@/components/shared/AnalysisCard";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAnalyses } from "@/lib/hooks/useAnalyses";
import { useUserProfile } from "@/lib/hooks/useUserProfile";


export default function DashboardPage() {
  const { user } = useAuth();
  const { analyses, loading: analysesLoading } = useAnalyses();
  const { profile, loading: profileLoading } = useUserProfile();
  
  const recentAnalyses = analyses.slice(0, 5);
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Developer";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0 
    ? Math.round(analyses.reduce((acc, a) => acc + (a.readinessScore || 0), 0) / totalAnalyses) 
    : 0;

  const stats = [
    {
      label: "Total Analyses",
      value: totalAnalyses,
      icon: GitBranch,
      color: "oklch(0.585 0.233 277.12)",
      bg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
      suffix: "",
    },
    {
      label: "Avg Readiness Score",
      value: avgScore,
      icon: TrendingUp,
      color: "oklch(0.696 0.17 162.48)",
      bg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      suffix: "/100",
    },
    {
      label: "Questions Generated",
      value: 0, // Not available in Analysis object yet
      icon: Brain,
      color: "oklch(0.609 0.237 293.08)",
      bg: "bg-violet-500/10",
      iconColor: "text-violet-400",
      suffix: "",
    },
    {
      label: "Mock Sessions",
      value: 0, // Mock sessions not fully implemented in backend yet
      icon: MessageSquare,
      color: "oklch(0.788 0.157 70.08)",
      bg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      suffix: "",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {firstName} 
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {profileLoading ? (
              <span className="animate-pulse bg-white/10 rounded h-4 w-48 inline-block" />
            ) : profile ? (
              `You have ${profile.analysisQuota.limit - profile.analysisQuota.used} analyses remaining this month.`
            ) : (
              "Welcome to RepoLens!"
            )}
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white border-0 text-sm font-medium gap-2 glow-brand-sm shrink-0">
            <Plus className="w-4 h-4" />
            New Analysis
          </Button>
        </Link>
      </motion.div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <ProgressRing
                  value={typeof stat.value === "number" ? stat.value : 0}
                  max={stat.label === "Avg Readiness Score" ? 100 : stat.label === "Total Analyses" ? 20 : stat.label === "Mock Sessions" ? 20 : 400}
                  size={36}
                  strokeWidth={3}
                  color={stat.color}
                />
              </div>
              <div>
                <p className="text-xl font-bold text-white">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent analyses — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Recent Analyses</h2>
            <Link href="/dashboard/history" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {analysesLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-white/[0.02] border border-white/[0.06] rounded-xl" />
                ))}
              </div>
            ) : recentAnalyses.length > 0 ? (
              recentAnalyses.map((analysis, i) => (
                <AnalysisCard key={analysis.id} analysis={analysis} index={i} />
              ))
            ) : (
              <div className="p-8 text-center border border-white/[0.06] bg-white/[0.02] rounded-xl">
                <p className="text-zinc-400 text-sm mb-3">No analyses found</p>
                <Link href="/dashboard/analyze">
                  <Button className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white border-0 text-xs font-medium gap-1.5 glow-brand-sm">
                    <Plus className="w-3.5 h-3.5" /> Start First Analysis
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right column — 1/3 */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: "/dashboard/analyze", icon: GitBranch, label: "Analyze a new repo", sub: "Paste any GitHub URL", color: "text-indigo-400" },
                { href: "/dashboard/mock/session_001", icon: MessageSquare, label: "Continue mock session", sub: "ecommerce-platform · Turn 3", color: "text-violet-400" },
                { href: "/dashboard/history", icon: BarChart3, label: "View full history", sub: "14 total analyses", color: "text-emerald-400" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <div className="group flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-indigo-500/20 hover:bg-white/[0.04] transition-all duration-150 cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 ${action.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">{action.label}</p>
                        <p className="text-[10px] text-zinc-600 truncate">{action.sub}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-150" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* AI tip card */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04]">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-400">Interview Tip</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              For your <span className="text-zinc-200 font-medium">ecommerce-platform</span>, be ready to explain the trade-off between Redis atomic ops and PostgreSQL-level locking for inventory management.
            </p>
            <Link href="/dashboard/analysis/analysis_001">
              <Button variant="ghost" size="sm" className="mt-3 h-7 text-[11px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2">
                Open report <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Activity feed */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-3">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { icon: Brain, text: "Analysis completed for ecommerce-platform", time: "2h ago", color: "text-emerald-400" },
                { icon: MessageSquare, text: "Mock session started — Technical mode", time: "3h ago", color: "text-violet-400" },
                { icon: Clock, text: "Analysis queued for ml-pipeline", time: "4h ago", color: "text-amber-400" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className={`w-3 h-3 ${item.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.text}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
