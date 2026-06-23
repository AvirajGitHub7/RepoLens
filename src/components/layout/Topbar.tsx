"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Search,
  Plus,
  Menu,
  ChevronRight,
  Command,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAnalyses } from "@/lib/hooks/useAnalyses";
import { Sidebar } from "./Sidebar";
import { AppLogo } from "@/components/shared/AppLogo";

// ─── Breadcrumb map ────────────────────────────────────────────────────────────

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  analyze: "Analyze Repo",
  history: "History",
  analysis: "Report",
  mock: "Mock Interview",
  settings: "Settings",
  help: "Help",
};

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = breadcrumbMap[seg] ?? (seg.length > 12 ? seg.slice(0, 8) + "…" : seg);
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
          {crumb.isLast ? (
            <span className="font-medium text-zinc-300">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="text-zinc-500 hover:text-zinc-300 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { analyses, loading } = useAnalyses();
  const router = useRouter();

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredAnalyses = analyses.filter((a) =>
    a.repoUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="no-print h-14 flex items-center px-4 gap-4 border-b border-white/[0.06] bg-[oklch(0.08_0_0)]/80 backdrop-blur-md shrink-0 sticky top-0 z-30">
        {/* Mobile menu trigger */}
        <Sheet>
          <SheetTrigger className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors">
            <Menu className="w-4 h-4" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60 bg-[oklch(0.10_0_0)] border-r border-white/[0.06]">
            <Sidebar collapsed={false} onCollapse={() => {}} mobile />
          </SheetContent>
        </Sheet>

        {/* Breadcrumbs */}
        <div className="hidden md:flex flex-1 min-w-0">
          <Breadcrumbs />
        </div>
        <div className="flex md:hidden flex-1 min-w-0">
          <AppLogo size="sm" />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg",
              "bg-white/[0.04] border border-white/[0.06] text-zinc-500",
              "hover:text-zinc-300 hover:bg-white/[0.07] hover:border-white/[0.10]",
              "transition-all duration-150 text-sm"
            )}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs">Search projects…</span>
            <kbd className="ml-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-zinc-600">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>

          {/* New analysis CTA */}
          <Link href="/dashboard/analyze">
            <Button
              size="sm"
              className="hidden sm:flex h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white border-0 text-xs font-medium px-3 glow-brand-sm transition-all duration-150"
            >
              <Plus className="w-3.5 h-3.5" />
              Analyze
            </Button>
          </Link>

          {/* Avatar */}
          <Avatar className="w-7 h-7 border border-white/[0.08] cursor-pointer">
            <AvatarImage src={user?.photoURL ?? ""} />
            <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-[10px] font-semibold">
              {(user?.displayName || user?.email || "U").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-xl p-0 gap-0 border-white/10 bg-zinc-950 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b border-white/[0.06]">
            <DialogTitle className="sr-only">Search Analyses</DialogTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-zinc-400" />
              <Input
                placeholder="Search your repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 shadow-none px-2 h-9"
              />
            </div>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading ? (
              <p className="text-sm text-zinc-500 text-center py-6">Loading projects...</p>
            ) : filteredAnalyses.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-6">No projects found.</p>
            ) : (
              <div className="space-y-1">
                {filteredAnalyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(`/dashboard/analysis/${analysis.id}`);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-white/[0.04] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center shrink-0">
                        <GitBranch className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {analysis.repoUrl.replace("https://github.com/", "")}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          Analyzed {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
