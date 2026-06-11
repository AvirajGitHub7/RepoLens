"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewQuestion, Difficulty } from "@/lib/types";

const difficultyConfig: Record<Difficulty, { label: string; color: string; bg: string }> = {
  easy: { label: "Easy", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  hard: { label: "Hard", color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

interface QuestionAccordionProps {
  questions: InterviewQuestion[];
  className?: string;
}

export function QuestionAccordion({ questions, className }: QuestionAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const grouped = {
    easy: questions.filter((q) => q.difficulty === "easy"),
    medium: questions.filter((q) => q.difficulty === "medium"),
    hard: questions.filter((q) => q.difficulty === "hard"),
  };

  const renderGroup = (difficulty: Difficulty, items: InterviewQuestion[]) => {
    if (!items.length) return null;
    const config = difficultyConfig[difficulty];
    return (
      <div key={difficulty} className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", config.bg, config.color)}>
            {config.label}
          </span>
          <span className="text-xs text-zinc-600">{items.length} questions</span>
        </div>
        {items.map((q, i) => (
          <QuestionItem
            key={q.id}
            question={q}
            isOpen={openId === q.id}
            onToggle={() => setOpenId(openId === q.id ? null : q.id)}
            index={i}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("space-y-8", className)}>
      {(["easy", "medium", "hard"] as Difficulty[]).map((d) => renderGroup(d, grouped[d]))}
    </div>
  );
}

function QuestionItem({
  question,
  isOpen,
  onToggle,
  index,
}: {
  question: InterviewQuestion;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const config = difficultyConfig[question.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "rounded-xl border overflow-hidden transition-all duration-150",
        isOpen ? "border-indigo-500/30 bg-indigo-500/[0.03]" : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10]"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <span className={cn("shrink-0 mt-0.5 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded border", config.bg, config.color)}>
          {question.difficulty[0].toUpperCase()}
        </span>
        <span className="flex-1 text-sm font-medium text-zinc-200 leading-relaxed">
          {question.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="shrink-0 mt-0.5"
        >
          <ChevronDown className="w-4 h-4 text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3 border-t border-white/[0.06]">
              <div className="pt-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                  Expected Answer
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {question.expectedAnswer}
                </p>
              </div>
              {question.tip && (
                <div className="flex gap-2.5 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/10">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/80 leading-relaxed">{question.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
