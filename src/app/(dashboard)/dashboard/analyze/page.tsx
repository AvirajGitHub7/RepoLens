"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GitBranch,
  Lock,
  Unlock,
  Brain,
  Layers,
  MessageSquare,
  Shield,
  Target,
  Zap,
  Clock,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnalyses } from "@/lib/hooks/useAnalyses";
import { AnalysisCard } from "@/components/shared/AnalysisCard";
import { useAuthContext } from "@/lib/context/AuthContext";
import { createAnalysis } from "@/lib/db/repositories/analysis.repository";
import { incrementAnalysisQuota } from "@/lib/db/repositories/user.repository";
import { Analysis } from "@/lib/types";
import { toast } from "sonner";
import { processGithubAnalysis } from "@/lib/services/analysis.orchestrator";
import { fetchUserRepos } from "@/lib/services/github/github.service";
import { GithubRepoResponse } from "@/lib/services/github/types";

const analysisOptions = [
  { id: "summary", label: "AI Project Summary", description: "Overview, key features, tech narrative", icon: Brain, default: true },
  { id: "architecture", label: "Architecture Breakdown", description: "Layers, patterns, data flow", icon: Layers, default: true },
  { id: "interview", label: "Interview Questions", description: "Technical Qs by difficulty level", icon: MessageSquare, default: true },
  { id: "hr", label: "HR Questions", description: "Behavioral & project explanation Qs", icon: Shield, default: true },
  { id: "systemDesign", label: "System Design Scenarios", description: "Scaled-up architecture challenge", icon: Target, default: false },
  { id: "mock", label: "Prepare Mock Session", description: "Pre-build question bank for mock interview", icon: MessageSquare, default: false },
];

export default function AnalyzePage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { analyses, loading: analysesLoading } = useAnalyses();
  const [url, setUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [isPrivate, setIsPrivate] = useState(false);
  const [options, setOptions] = useState<Record<string, boolean>>(
    Object.fromEntries(analysisOptions.map((o) => [o.id, o.default]))
  );
  const [loading, setLoading] = useState(false);

  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [repos, setRepos] = useState<GithubRepoResponse[]>([]);
  const [isCustomUrl, setIsCustomUrl] = useState(true);
  const [reposLoading, setReposLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("githubToken");
    if (token) {
      setGithubToken(token);
      setIsCustomUrl(false);
      setReposLoading(true);
      fetchUserRepos(token)
        .then((fetchedRepos) => {
          setRepos(fetchedRepos);
        })
        .catch((err) => {
          console.error("Failed to fetch user repos:", err);
          setIsCustomUrl(true);
        })
        .finally(() => {
          setReposLoading(false);
        });
    }
  }, []);

  const isValidUrl = url.startsWith("https://github.com/") && url.split("/").length >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidUrl || !user) return;
    setLoading(true);

    try {
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      const owner = match ? match[1] : "";
      const name = match ? match[2].replace(/\.git$/, "") : "";
      const fullName = `${owner}/${name}`;

      const analysisId = crypto.randomUUID();
      
      const newAnalysis: Analysis = {
        id: analysisId,
        userId: user.uid,
        repoUrl: url,
        repoMeta: {
          owner,
          name,
          fullName,
          description: "",
          stars: 0,
          forks: 0,
          language: "",
          topics: [],
          isPrivate,
          updatedAt: new Date().toISOString(),
          size: 0,
          url,
        },
        status: "queued",
        progress: 0,
        readinessScore: null,
        techStack: {
          languages: [],
          frameworks: [],
          databases: [],
          devops: [],
          testing: [],
        },
        createdAt: new Date().toISOString(),
        completedAt: null,
        errorMessage: null,
      };

      await createAnalysis(newAnalysis);
      await incrementAnalysisQuota(user.uid);
      processGithubAnalysis(newAnalysis.id, url, githubToken);

      toast.success("Analysis started successfully!");
      
      // Redirect immediately so user sees loading state
      router.push(`/dashboard/analysis/${analysisId}`);
    } catch (error) {
      console.error("Error creating analysis:", error);
      toast.error("Failed to start analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1">Analyze Repository</h1>
        <p className="text-sm text-zinc-500 mb-8">
          Paste a GitHub URL and we&apos;ll generate a complete interview prep package in ~3 minutes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="lg:col-span-3"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL input */}
            <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
              <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-zinc-400" />
                Repository URL
              </h2>

              <div className="space-y-2">
                <Label className="text-xs text-zinc-500">
                  {isCustomUrl ? "GitHub URL" : "Select Repository"}
                </Label>
                {reposLoading ? (
                  <div className="h-10 px-3 bg-white/[0.04] border border-white/[0.08] text-zinc-400 text-sm flex items-center rounded-md animate-pulse">
                    Loading your repositories...
                  </div>
                ) : !isCustomUrl && repos.length > 0 ? (
                  <div className="space-y-2">
                    <Select value={url} onValueChange={(v) => {
                      if (v === "custom") setIsCustomUrl(true);
                      else if (v) setUrl(v);
                    }}>
                      <SelectTrigger className="h-10 bg-white/[0.04] border-white/[0.08] text-zinc-200 text-sm">
                        <SelectValue placeholder="Select a repository" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 max-h-64">
                        {repos.map(r => (
                          <SelectItem key={r.full_name} value={`https://github.com/${r.full_name}`}>
                            {r.full_name} {r.private && "🔒"}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom" className="text-indigo-400 font-medium">
                          + Custom URL...
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                      <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://github.com/owner/repository"
                        className="pl-9 h-10 bg-white/[0.04] border-white/[0.08] text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-indigo-500/50 text-sm font-mono"
                      />
                      {url && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium">
                          {isValidUrl ? (
                            <span className="text-emerald-400">✓ Valid</span>
                          ) : (
                            <span className="text-rose-400">Invalid URL</span>
                          )}
                        </span>
                      )}
                    </div>
                    {githubToken && repos.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsCustomUrl(false)}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        ← Back to my repositories
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500">Branch</Label>
                  <Select value={branch} onValueChange={(v) => { if (v !== null) setBranch(v); }}>
                    <SelectTrigger className="h-10 bg-white/[0.04] border-white/[0.08] text-zinc-300 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10">
                      {["main", "master", "develop", "staging"].map((b) => (
                        <SelectItem key={b} value={b} className="text-zinc-300 text-sm">{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-500">Visibility</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`w-full h-10 border-white/[0.08] bg-white/[0.04] text-sm justify-start gap-2 transition-colors ${
                      isPrivate && !githubToken 
                        ? "text-amber-400 border-amber-500/30 hover:bg-amber-500/10" 
                        : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {isPrivate ? (
                      <><Lock className="w-3.5 h-3.5 text-amber-400" /> Private</>
                    ) : (
                      <><Unlock className="w-3.5 h-3.5 text-emerald-400" /> Public</>
                    )}
                  </Button>
                </div>
              </div>

              {isPrivate && !githubToken && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 leading-relaxed"
                >
                  <strong className="text-amber-400 font-semibold block mb-1">GitHub Authentication Required</strong>
                  You are currently logged in without a GitHub session token. To analyze private repositories, you must log out and sign back in using the <span className="text-white font-medium">Continue with GitHub</span> option.
                </motion.div>
              )}
            </div>

            {/* Analysis options */}
            <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
              <h2 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                Analysis Options
              </h2>
              <div className="space-y-3">
                {analysisOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <div key={opt.id} className="flex items-center justify-between gap-3 py-1.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-zinc-300">{opt.label}</p>
                          <p className="text-[10px] text-zinc-600 truncate">{opt.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={options[opt.id]}
                        onCheckedChange={(v) => setOptions((prev) => ({ ...prev, [opt.id]: v }))}
                        className="shrink-0 data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated time */}
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-zinc-400">
                  Estimated analysis time:{" "}
                  <span className="text-zinc-200 font-semibold">
                    {Object.values(options).filter(Boolean).length >= 4 ? "4–5 min" : "2–3 min"}
                  </span>
                </p>
                <p className="text-[10px] text-zinc-600">
                  {Object.values(options).filter(Boolean).length} sections selected
                </p>
              </div>
              <Info className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!isValidUrl || loading || (isPrivate && !githubToken)}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white border-0 text-sm font-semibold glow-brand-sm transition-all duration-200"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Starting analysis…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Start Analysis
                </span>
              )}
            </Button>
          </form>
        </motion.div>

        {/* ── Recent analyses ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <h2 className="text-sm font-semibold text-zinc-300">Recent Analyses</h2>
          <div className="space-y-3">
            {analysesLoading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-white/[0.02] border border-white/[0.06] rounded-xl" />
                ))}
              </div>
            ) : analyses.length > 0 ? (
              analyses.slice(0, 4).map((a, i) => (
                <AnalysisCard key={a.id} analysis={a} index={i} />
              ))
            ) : (
              <div className="text-center py-8 border border-white/[0.06] bg-white/[0.02] rounded-xl">
                <p className="text-zinc-500 text-xs">No recent analyses</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
