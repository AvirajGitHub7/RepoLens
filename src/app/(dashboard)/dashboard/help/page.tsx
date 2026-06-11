"use client";

import { motion } from "framer-motion";
import { HelpCircle, Book, MessageCircle, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do I generate a new repository analysis?",
    answer: "Navigate to the 'Analyze Repo' tab from the sidebar, paste your public GitHub repository URL, and click Analyze. We will fetch the repository contents and generate a comprehensive architecture overview.",
  },
  {
    question: "What is the analysis quota?",
    answer: "Free tier users can generate up to 5 comprehensive repository analyses. You can view your current usage in the sidebar quota progress bar. If you need more, you can upgrade your plan in the Settings.",
  },
  {
    question: "Are private repositories supported?",
    answer: "Currently, RepoLens only supports public GitHub repositories. Support for private repositories via GitHub OAuth integration is planned for a future release.",
  },
  {
    question: "How does the Mock Interview feature work?",
    answer: "Based on the repository analysis you generate, RepoLens creates context-aware HR and System Design interview questions. You can use the Mock Interview tab to simulate an interview based on the specific architecture of your code.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-400" />
          Help & Support
        </h1>
        <p className="text-sm text-zinc-500">Get assistance and learn how to maximize your RepoLens experience.</p>
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Documentation",
            desc: "Detailed guides on repository analysis.",
            icon: Book,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            title: "Contact Support",
            desc: "Chat with our engineering support team.",
            icon: MessageCircle,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            title: "API Reference",
            desc: "Integrate RepoLens into your CI/CD.",
            icon: FileText,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + idx * 0.05, duration: 0.3 }}
            className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group flex flex-col items-start gap-4"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.bg}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-200 mb-1 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-xl font-semibold text-white">Frequently Asked Questions</h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden divide-y divide-white/[0.06]">
          {faqs.map((faq, idx) => (
            <div key={idx} className="group">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left bg-transparent hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-medium text-zinc-200">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-5 pt-0 text-sm text-zinc-400 leading-relaxed bg-white/[0.01]">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
