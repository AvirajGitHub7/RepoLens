"use client";

import { useState, useEffect, useRef, use } from "react";
import { motion } from "framer-motion";
import {
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  Download,
  Share2,
  Brain,
  Layers,
  MessageSquare,
  Users,
  Target,
  BarChart3,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { TechStackBadges } from "@/components/shared/TechStackBadges";
import { useAnalysis } from "@/lib/hooks/useAnalyses";
import Link from "next/link";
import { Analysis } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// ─── Sections config ───────────────────────────────────────────────────────────

const sections = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "summary", label: "AI Summary", icon: Brain },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "interview-questions", label: "Interview Qs", icon: MessageSquare },
  { id: "hr-questions", label: "HR Questions", icon: Users },
  { id: "system-design", label: "System Design", icon: Target },
];

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { analysis, loading } = useAnalysis(unwrappedParams.id);
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `RepoLens Analysis: ${analysis?.repoMeta?.name || 'Repository'}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="flex h-full print:block print:h-auto">
      {/* ── Scrollspy sidebar ── */}
      <aside className="no-print hidden lg:flex flex-col w-52 shrink-0 border-r border-white/[0.06] p-3 sticky top-0 h-full overflow-y-auto print:hidden">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2 mt-1">
          Sections
        </p>
        <nav className="space-y-0.5">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-all duration-150",
                activeSection === id
                  ? "bg-indigo-500/10 text-indigo-400 sidebar-item-active"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5 shrink-0", activeSection === id ? "text-indigo-400" : "text-zinc-600")} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-4 space-y-2">
          <Button onClick={handleExportPdf} variant="outline" size="sm" className="w-full h-8 text-xs border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white gap-1.5">
            <Download className="w-3 h-3" /> Export PDF
          </Button>
          <Button onClick={handleShare} variant="outline" size="sm" className="w-full h-8 text-xs border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:text-white gap-1.5">
            <Share2 className="w-3 h-3" /> Share
          </Button>
        </div>
      </aside>

      {/* ── Main scrollable content ── */}
      <div className="flex-1 overflow-y-auto print:overflow-visible print:block">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-16">

          {loading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-32 bg-white/[0.02] border border-white/[0.06] rounded-xl" />
              <div className="h-64 bg-white/[0.02] border border-white/[0.06] rounded-xl" />
            </div>
          ) : !analysis ? (
            <div className="text-center py-20 text-zinc-500">Analysis not found.</div>
          ) : (
            <>
              {/* ── SECTION: Overview ── */}
              <section id="overview" ref={(el) => { sectionRefs.current["overview"] = el as HTMLDivElement | null; }}>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {/* Repo header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] shrink-0">
                  <GitBranch className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-white">{analysis.repoMeta.name}</h1>
                    {analysis.repoMeta.isPrivate && (
                      <Badge className="bg-zinc-700/50 text-zinc-400 border-zinc-600/50 text-[10px]">
                        <Lock className="w-2.5 h-2.5 mr-1" /> Private
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mt-0.5">{analysis.repoMeta.owner}</p>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{analysis.repoMeta.description}</p>
                </div>
              </div>

              {/* Repo stats */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-zinc-300 font-medium">{analysis.repoMeta.stars.toLocaleString()}</span> stars
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-300 font-medium">{analysis.repoMeta.forks}</span> forks
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  <span className="text-zinc-300 font-medium">{analysis.repoMeta.language}</span>
                </span>
                <a
                  href={analysis.repoMeta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
                >
                  View on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Score + Tech grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-5">
                  <ReadinessGauge score={analysis.readinessScore ?? 0} size="md" />
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Interview Readiness</p>
                    <p className="text-lg font-bold text-emerald-400">Excellent</p>
                    <p className="text-[11px] text-zinc-600 leading-relaxed mt-1">Top 15% of analyzed repos</p>
                    <div className="flex gap-1 mt-2">
                      {["Architecture", "Stack", "Docs"].map((tag) => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          {tag} ✓
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <p className="text-xs text-zinc-500 mb-3">Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.repoMeta.topics.map((topic: string) => (
                      <span key={topic} className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-zinc-400">
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mt-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <p className="text-xs text-zinc-500 mb-3">Technology Stack</p>
                <div className="space-y-3">
                  {[
                    { label: "Languages", items: analysis.techStack.languages },
                    { label: "Frameworks", items: analysis.techStack.frameworks },
                    { label: "Databases", items: analysis.techStack.databases },
                    { label: "DevOps", items: analysis.techStack.devops },
                    { label: "Testing", items: analysis.techStack.testing },
                  ].filter(g => g.items.length > 0).map((group) => (
                    <div key={group.label} className="flex items-start gap-3">
                      <span className="text-[10px] text-zinc-600 w-16 shrink-0 mt-1 font-medium">{group.label}</span>
                      <TechStackBadges stack={{ languages: group.items, frameworks: [], databases: [], devops: [], testing: [] }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA to mock */}
              <div className="mt-4 flex items-center gap-3 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04]">
                <MessageSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">Ready to practice?</p>
                  <p className="text-xs text-zinc-500">Start a mock interview based on this analysis</p>
                </div>
                <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white border-0 text-xs font-medium shrink-0 gap-1.5">
                  Start Mock <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          </section>

          {/* ── SECTION: AI Summary ── */}
          <section id="summary">
            <SectionHeader icon={Brain} title="AI Project Summary" color="text-indigo-400" />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              {analysis.status === "completed" ? (
                <div className="prose prose-sm prose-invert max-w-none text-zinc-300 leading-relaxed">
                  <ReactMarkdown>{analysis.summary || "No summary generated."}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 italic text-center">Data is being generated...</p>
              )}
            </motion.div>
          </section>

          {/* ── SECTION: Architecture ── */}
          <section id="architecture">
            <SectionHeader icon={Layers} title="Architecture Breakdown" color="text-violet-400" />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
            >
              {analysis.status === "completed" ? (
                <div className="prose prose-sm prose-invert max-w-none text-zinc-300 leading-relaxed">
                  <ReactMarkdown>
                    {(() => {
                      const arch = analysis.architecture;
                      if (!arch) return "No architecture breakdown generated.";
                      if (arch.includes("```")) return arch;
                      if (arch.includes("├──") || arch.includes("└──")) {
                        return `\`\`\`text\n${arch}\n\`\`\``;
                      }
                      return arch;
                    })()}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 italic text-center">Data is being generated...</p>
              )}
            </motion.div>
          </section>

          {/* ── SECTION: Interview Questions ── */}
          <section id="interview-questions">
            <SectionHeader icon={MessageSquare} title="Interview Questions" color="text-cyan-400" />
            <div className="mt-4 space-y-4">
              {analysis.status === "completed" ? (
                analysis.interviewQuestions?.length ? (
                  analysis.interviewQuestions.map((q, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-sm font-medium text-white leading-relaxed">{q.question}</h3>
                        <Badge variant="outline" className="shrink-0 text-[10px] border-cyan-500/20 text-cyan-400 capitalize">
                          {q.difficulty}
                        </Badge>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4 mt-3 border border-white/[0.04]">
                        <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-cyan-400/80 font-medium mr-1">Expected:</span>{q.expectedAnswer}</p>
                      </div>
                      {q.tip && (
                        <p className="text-[11px] text-zinc-500 mt-3 flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                          Tip: {q.tip}
                        </p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                    <p className="text-sm text-zinc-500 italic">No interview questions generated.</p>
                  </div>
                )
              ) : (
                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                  <p className="text-sm text-zinc-500 italic">Data is being generated...</p>
                </div>
              )}
            </div>
          </section>

          {/* ── SECTION: HR Questions ── */}
          <section id="hr-questions">
            <SectionHeader icon={Users} title="HR & Behavioral Questions" color="text-amber-400" />
            <div className="mt-4 space-y-4">
              {analysis.status === "completed" ? (
                analysis.hrQuestions?.length ? (
                  analysis.hrQuestions.map((q, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-sm font-medium text-white leading-relaxed">{q.question}</h3>
                        <Badge variant="outline" className="shrink-0 text-[10px] border-amber-500/20 text-amber-400 capitalize">
                          {q.focus}
                        </Badge>
                      </div>
                      <div className="bg-black/20 rounded-lg p-3 mt-3 border border-white/[0.04]">
                        <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-amber-400/80 font-medium mr-1">Tip:</span>{q.tip}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                    <p className="text-sm text-zinc-500 italic">No HR questions generated.</p>
                  </div>
                )
              ) : (
                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                  <p className="text-sm text-zinc-500 italic">Data is being generated...</p>
                </div>
              )}
            </div>
          </section>

          {/* ── SECTION: System Design ── */}
          <section id="system-design" className="pb-16">
            <SectionHeader icon={Target} title="System Design Challenge" color="text-rose-400" />
            <div className="mt-4 space-y-4">
              {analysis.status === "completed" ? (
                analysis.systemDesignQuestions?.length ? (
                  analysis.systemDesignQuestions.map((sd, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    >
                      <h3 className="text-sm font-medium text-rose-300 leading-relaxed mb-4">{sd.scenario}</h3>
                      
                      {sd.components && sd.components.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider font-semibold">Key Components</p>
                          <ul className="space-y-2">
                            {sd.components.map((c, i) => (
                              <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500/50 mt-1 shrink-0"></span>
                                <span className="font-medium text-white">{c.name}:</span> <span className="text-zinc-400">{c.role}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sd.tradeoffs && sd.tradeoffs.length > 0 && (
                        <div className="mb-4 bg-rose-500/5 border border-rose-500/10 rounded-lg p-4">
                          <p className="text-[11px] text-rose-400 mb-2 uppercase tracking-wider font-semibold">Tradeoffs to Consider</p>
                          <ul className="space-y-1.5">
                            {sd.tradeoffs.map((t, i) => (
                              <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                                <span className="text-rose-500/50 mt-0.5 shrink-0">•</span> {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                    <p className="text-sm text-zinc-500 italic">No system design questions generated.</p>
                  </div>
                )
              ) : (
                <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                  <p className="text-sm text-zinc-500 italic">Data is being generated...</p>
                </div>
              )}
            </div>
          </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  color,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
        <Icon className={cn("w-3.5 h-3.5", color)} />
      </div>
      <h2 className="text-base font-semibold text-white">{title}</h2>
    </div>
  );
}
