import { cn } from "@/lib/utils";
import type { TechStack } from "@/lib/types";

const categoryColors: Record<string, string> = {
  TypeScript: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Python: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Go: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Rust: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Next.js": "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  "Next.js 14": "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
  React: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  PostgreSQL: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Redis: "bg-red-500/10 text-red-400 border-red-500/20",
  MongoDB: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Docker: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Kubernetes: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

const defaultColor = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";

interface TechStackBadgesProps {
  stack: TechStack;
  compact?: boolean;
  className?: string;
}

export function TechStackBadges({ stack, compact = false, className }: TechStackBadgesProps) {
  const all = compact
    ? [...stack.languages, ...stack.frameworks].slice(0, 5)
    : [
        ...stack.languages,
        ...stack.frameworks,
        ...stack.databases,
        ...stack.devops,
        ...stack.testing,
      ];

  const extra = compact
    ? Math.max(0, stack.languages.length + stack.frameworks.length - 5)
    : 0;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {all.map((tech) => (
        <span
          key={tech}
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border",
            categoryColors[tech] ?? defaultColor
          )}
        >
          {tech}
        </span>
      ))}
      {extra > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border bg-zinc-500/10 text-zinc-500 border-zinc-500/20">
          +{extra} more
        </span>
      )}
    </div>
  );
}
