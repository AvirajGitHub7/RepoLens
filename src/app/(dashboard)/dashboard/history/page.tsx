"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAnalyses } from "@/lib/hooks/useAnalyses";
import { AnalysisCard } from "@/components/shared/AnalysisCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { AnalysisStatus, Analysis } from "@/lib/types";

const statuses: { label: string; value: AnalysisStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Analyzing", value: "analyzing" },
  { label: "Failed", value: "failed" },
];

export default function HistoryPage() {
  const { analyses, loading } = useAnalyses();
  const [filter, setFilter] = useState<AnalysisStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = analyses.filter((a: Analysis) => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch =
      !search ||
      a.repoMeta.name.toLowerCase().includes(search.toLowerCase()) ||
      a.repoMeta.owner.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Analysis History</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {loading ? "Loading..." : `${analyses.length} total analyses`}
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white border-0 text-sm font-medium gap-2 glow-brand-sm">
            <Plus className="w-4 h-4" /> New Analysis
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <Input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search repositories…"
            className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-zinc-300 placeholder:text-zinc-600 text-sm"
          />
        </div>
        <div className="flex gap-1.5 shrink-0">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                filter === s.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.07]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white/[0.02] border border-white/[0.06] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <p className="text-sm">No analyses match your filters.</p>
          </div>
        ) : (
          filtered.map((analysis: Analysis, i: number) => (
            <AnalysisCard key={analysis.id} analysis={analysis} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
