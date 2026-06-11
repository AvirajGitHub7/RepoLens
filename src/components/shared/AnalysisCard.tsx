import Link from "next/link";
import { motion } from "framer-motion";
import { GitBranch, Star, GitFork, Clock, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Analysis } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { ReadinessGauge } from "./ReadinessGauge";
import { TechStackBadges } from "./TechStackBadges";
import { Progress } from "@/components/ui/progress";

interface AnalysisCardProps {
  analysis: Analysis;
  index?: number;
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function AnalysisCard({ analysis, index = 0 }: AnalysisCardProps) {
  const isClickable = analysis.status === "completed";

  const cardContent = (
        <div
          className={cn(
            "group relative p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]",
            "transition-all duration-200",
            isClickable && "hover:border-indigo-500/30 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer feature-card"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0">
                <GitBranch className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-zinc-200 truncate">
                    {analysis.repoMeta.name}
                  </span>
                  {analysis.repoMeta.isPrivate && (
                    <Lock className="w-3 h-3 text-zinc-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate">{analysis.repoMeta.owner}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={analysis.status} />
              {isClickable && (
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-150 opacity-0 group-hover:opacity-100" />
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
            {analysis.repoMeta.description}
          </p>

          {/* In-progress */}
          {(analysis.status === "analyzing" || analysis.status === "fetching") && (
            <div className="mb-3">
              <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                <span>Analyzing…</span>
                <span>{analysis.progress}%</span>
              </div>
              <Progress value={analysis.progress} className="h-1 bg-white/[0.06]" />
            </div>
          )}

          {/* Error */}
          {analysis.status === "failed" && analysis.errorMessage && (
            <p className="text-[11px] text-rose-400/80 mb-3 bg-rose-500/[0.06] px-2 py-1.5 rounded-lg border border-rose-500/10">
              {analysis.errorMessage}
            </p>
          )}

          {/* Tech stack */}
          <div className="mb-3">
            <TechStackBadges stack={analysis.techStack} compact />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-zinc-600">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {analysis.repoMeta.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {analysis.repoMeta.forks}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(analysis.createdAt)}
              </span>
            </div>
            {analysis.readinessScore !== null && (
              <ReadinessGauge score={analysis.readinessScore} size="sm" />
            )}
          </div>
        </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {isClickable ? (
        <Link href={`/dashboard/analysis/${analysis.id}`}>{cardContent}</Link>
      ) : (
        <div>{cardContent}</div>
      )}
    </motion.div>
  );
}
