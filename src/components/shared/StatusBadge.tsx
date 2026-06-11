import { cn } from "@/lib/utils";
import type { AnalysisStatus } from "@/lib/types";

const statusConfig: Record<
  AnalysisStatus,
  { label: string; dot: string; bg: string; text: string; pulse?: boolean }
> = {
  queued: {
    label: "Queued",
    dot: "bg-zinc-400",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
  },
  fetching: {
    label: "Fetching",
    dot: "bg-blue-400",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    pulse: true,
  },
  analyzing: {
    label: "Analyzing",
    dot: "bg-indigo-400",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    pulse: true,
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-400",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  failed: {
    label: "Failed",
    dot: "bg-rose-400",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
  },
};

interface StatusBadgeProps {
  status: AnalysisStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full", config.dot, config.pulse && "status-pulse")}
      />
      {config.label}
    </span>
  );
}
