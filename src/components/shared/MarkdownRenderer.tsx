"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-invert prose-sm max-w-none",
        "prose-headings:text-zinc-100 prose-headings:font-semibold",
        "prose-h2:text-base prose-h2:mt-6 prose-h2:mb-2",
        "prose-h3:text-sm prose-h3:mt-4 prose-h3:mb-1.5",
        "prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-sm",
        "prose-strong:text-zinc-200 prose-strong:font-semibold",
        "prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-lg prose-pre:text-xs prose-pre:text-zinc-300",
        "prose-li:text-zinc-400 prose-li:text-sm prose-li:marker:text-indigo-500",
        "prose-ul:my-2 prose-ol:my-2",
        "prose-blockquote:border-l-indigo-500 prose-blockquote:text-zinc-500 prose-blockquote:text-sm",
        "prose-hr:border-white/[0.06]",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
