"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  GitBranch as GithubIcon,
  ArrowRight,
  Star,
  GitBranch,
  Brain,
  MessageSquare,
  Shield,
  Layers,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Code2,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Feature data ──────────────────────────────────────────────────────────────

const features = [
  {
    icon: Brain,
    title: "AI Project Summary",
    description: "Get a concise, accurate explanation of any repo — architecture, patterns, and key decisions — in seconds.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Layers,
    title: "Architecture Breakdown",
    description: "Visualize system design, data flow, and component relationships with AI-generated architecture maps.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: MessageSquare,
    title: "Interview Questions",
    description: "Receive tailored technical and behavioral questions based on your actual codebase — not generic templates.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Target,
    title: "Mock Interview Simulator",
    description: "Practice live with an AI interviewer that gives scored, detailed feedback on every answer.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Readiness Score",
    description: "Get a 0–100 interview readiness score across 6 dimensions: architecture, stack depth, problem-solving, and more.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "System Design Scenarios",
    description: "Tackle system design questions derived from your project's actual architecture, with trade-off analysis.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Paste your GitHub URL",
    description: "Any public or private repo. We fetch the structure, README, and key source files.",
    icon: GithubIcon,
  },
  {
    number: "02",
    title: "AI analyzes everything",
    description: "Our pipeline generates summaries, architecture diagrams, and a question bank tailored to your specific codebase.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Ace your interviews",
    description: "Practice with the mock simulator, review your readiness score, and walk into any interview with total confidence.",
    icon: Target,
  },
];

const testimonials = [
  {
    quote: "I used RepoLens the night before my Google interview. The AI pinpointed exactly which design decisions I needed to defend. I got the offer.",
    name: "Priya Nair",
    role: "SDE-2 @ Google",
    avatar: "PN",
  },
  {
    quote: "Went from blanking on 'tell me about your project' to confidently explaining every architectural decision. This is how interview prep should work.",
    name: "Marcus Webb",
    role: "Senior Engineer @ Stripe",
    avatar: "MW",
  },
  {
    quote: "The system design questions it generated from my actual codebase were more relevant than anything I found on LeetCode or YouTube.",
    name: "Yuki Tanaka",
    role: "Staff Eng @ Vercel",
    avatar: "YT",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI-powered repo analysis.",
    features: ["3 analyses / month", "AI Project Summary", "Basic Interview Questions", "Readiness Score"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "Everything you need to nail technical interviews.",
    features: [
      "20 analyses / month",
      "All AI sections",
      "Unlimited Mock Interviews",
      "HR + System Design Questions",
      "PDF Export",
      "Priority processing",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/ month",
    description: "For engineering teams preparing together.",
    features: [
      "100 analyses / month",
      "5 team seats",
      "Shared analysis history",
      "Admin dashboard",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const stats = [
  { value: "12,400+", label: "Repos Analyzed" },
  { value: "94%", label: "Offer Rate" },
  { value: "340K+", label: "Questions Generated" },
  { value: "4.9★", label: "Average Rating" },
];

// ─── Animations ────────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0_0)] text-zinc-100 overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 flex items-center px-6 border-b border-white/[0.06] bg-[oklch(0.08_0_0)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 glow-brand-sm">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-white tracking-tight">RepoLens</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-200 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-zinc-200 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 h-8 text-xs">
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white border-0 text-xs font-medium glow-brand-sm">
                Get Started <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 hero-gradient dot-grid">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.4 }}>
            <Badge className="mb-6 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 text-xs font-medium">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Powered by Gemini AI
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            Turn your GitHub repos
            <br />
            <span className="gradient-text">into interview gold</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            RepoLens analyzes your codebase and generates tailored summaries,
            architecture breakdowns, interview questions, and a live mock interview
            — all in under 5 minutes.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white border-0 font-semibold text-sm glow-brand transition-all duration-200 hover:scale-[1.02]"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Continue with GitHub — Free
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:text-white hover:border-white/[0.20] hover:bg-white/[0.06] font-medium text-sm"
              >
                See how it works <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Hero preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="gradient-border p-px rounded-2xl">
              <div className="rounded-2xl bg-[oklch(0.11_0_0)] p-6 text-left">
                {/* Fake terminal header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-3 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-xs text-zinc-500 font-mono">
                      repolens.ai/analyze
                    </div>
                  </div>
                </div>
                {/* Mock analysis output */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <GitBranch className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-sm text-zinc-300 font-mono">alexchen-dev/ecommerce-platform</span>
                    <span className="ml-auto text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">✓ Analyzed</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Readiness Score", value: "87/100", color: "text-emerald-400" },
                      { label: "Questions", value: "24 Generated", color: "text-indigo-400" },
                      { label: "Architecture", value: "Hexagonal", color: "text-violet-400" },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                        <p className="text-[10px] text-zinc-500 mb-1">{item.label}</p>
                        <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <p className="text-[10px] text-zinc-500 mb-1.5">Sample Interview Question</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      &quot;How does your real-time inventory system prevent overselling under concurrent load?&quot;
                    </p>
                    <span className="mt-2 inline-flex items-center text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Hard · Scalability
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow beneath card */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-indigo-500/10 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-12 px-6 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-1 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs">
              <Code2 className="w-3 h-3 mr-1.5" />
              Everything you need
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              From repo to ready — in one platform
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
              RepoLens covers every angle of technical interview preparation, tailored to your actual codebase.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="feature-card p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className={`w-9 h-9 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-4.5 h-4.5 ${feature.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.01] border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Three steps to interview confidence
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-indigo-500/30" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className="relative text-center"
                  >
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-5 mx-auto">
                      <Icon className="w-7 h-7 text-indigo-400" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Engineers who landed their dream roles
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] feature-card"
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-[11px] font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{t.name}</p>
                    <p className="text-[10px] text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6 bg-white/[0.01] border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-zinc-400 text-sm">Start free. Upgrade when you need more.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-xl border ${
                  plan.highlighted
                    ? "border-indigo-500/40 bg-indigo-500/[0.05] glow-brand"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wide">
                    Most Popular
                  </span>
                )}
                <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <p className="text-xs text-zinc-500 mb-5 leading-relaxed">{plan.description}</p>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/login">
                  <Button
                    className={`w-full h-9 text-sm font-medium ${
                      plan.highlighted
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white border-0 glow-brand-sm"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.10] hover:border-white/[0.18]"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 rounded-2xl gradient-border relative overflow-hidden"
          >
            <div className="absolute inset-0 hero-gradient opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to impress your next interviewer?
              </h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-lg mx-auto">
                Join 12,000+ engineers who used RepoLens to walk into interviews with confidence.
              </p>
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-12 px-10 bg-indigo-600 hover:bg-indigo-500 text-white border-0 font-semibold text-sm glow-brand"
                >
                  <GitBranch className="w-4 h-4 mr-2" />
                  Start for free — no credit card
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-400">RepoLens</span>
          </div>
          <p className="text-xs text-zinc-600">© 2025 RepoLens. Built for engineers, by engineers.</p>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> X / Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
