"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReadinessGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ReadinessGauge({ score, size = "md", className }: ReadinessGaugeProps) {
  const sizes = { sm: 72, md: 100, lg: 140 };
  const strokeWidths = { sm: 5, md: 7, lg: 9 };
  const dim = sizes[size];
  const sw = strokeWidths[size];
  const radius = (dim - sw * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const cx = dim / 2;
  const cy = dim / 2;

  const color =
    score >= 80
      ? "oklch(0.696 0.17 162.48)"
      : score >= 60
      ? "oklch(0.788 0.157 70.08)"
      : "oklch(0.641 0.232 17.66)";

  const textSizes = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };
  const labelSizes = { sm: "text-[9px]", md: "text-[10px]", lg: "text-xs" };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={dim} height={dim} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 6%)"
          strokeWidth={sw}
        />
        {/* Progress */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className={cn("font-bold text-white leading-none", textSizes[size])}
        >
          {score}
        </motion.span>
        <span className={cn("text-zinc-500 font-medium mt-0.5", labelSizes[size])}>/ 100</span>
      </div>
    </div>
  );
}
