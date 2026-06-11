"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GitBranch,
  History,
  MessageSquare,
  Settings,
  ChevronLeft,
  Zap,
  LogOut,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUserProfile } from "@/lib/hooks/useUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ─── Nav items ─────────────────────────────────────────────────────────────────

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analyze", label: "Analyze Repo", icon: GitBranch },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/dashboard/mock", label: "Mock Interview", icon: MessageSquare },
];

const bottomNavItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle },
];

// ─── Props ─────────────────────────────────────────────────────────────────────

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobile?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function Sidebar({ collapsed, onCollapse, mobile = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();

  const quotaUsed = profile?.analysisQuota?.used ?? 0;
  const quotaLimit = profile?.analysisQuota?.limit ?? 5;
  const quotaPct = Math.min(Math.round((quotaUsed / quotaLimit) * 100), 100);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed && !mobile ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "no-print relative flex flex-col h-full overflow-hidden",
        "bg-[oklch(0.10_0_0)] border-r border-white/[0.06]",
        mobile && "w-60"
      )}
    >
      {/* ── Logo ── */}
      <div className="flex items-center h-14 px-4 border-b border-white/[0.06] shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shrink-0 glow-brand-sm">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <AnimatePresence>
            {(!collapsed || mobile) && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-sm text-white tracking-tight whitespace-nowrap"
              >
                RepoLens
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {!mobile && (
          <button
            onClick={() => onCollapse(!collapsed)}
            className={cn(
              "ml-auto flex items-center justify-center w-6 h-6 rounded-md",
              "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06]",
              "transition-all duration-150 shrink-0"
            )}
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        )}
      </div>

      {/* ── Main Nav ── */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium",
                    "transition-all duration-150 whitespace-nowrap",
                    active
                      ? "bg-white/[0.07] text-white sidebar-item-active"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      active ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  <AnimatePresence>
                    {(!collapsed || mobile) && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-white/[0.04]"
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}

        {/* ── Divider ── */}
        <div className="my-2 h-px bg-white/[0.06]" />

        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] transition-all duration-150"
                >
                  <Icon className="w-4 h-4 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  <AnimatePresence>
                    {(!collapsed || mobile) && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      {/* ── Quota bar ── */}
      <AnimatePresence>
        {(!collapsed || mobile) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-3 mb-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-zinc-500">Analyses Used</span>
              <span className="text-[11px] font-medium text-zinc-400">
                {quotaUsed}/{quotaLimit}
              </span>
            </div>
            <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${quotaPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className={cn(
                  "h-full rounded-full",
                  quotaPct > 80 ? "bg-amber-500" : "bg-indigo-500"
                )}
              />
            </div>
            {quotaPct > 80 && (
              <p className="mt-1.5 text-[10px] text-amber-500/80">Upgrade to Pro for more analyses</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── User ── */}
      <div className="p-2 border-t border-white/[0.06] shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "w-full flex items-center gap-2.5 px-2 py-2 rounded-lg",
              "hover:bg-white/[0.04] transition-all duration-150",
              "text-left min-w-0"
            )}
          >
              <Avatar className="w-7 h-7 shrink-0 border border-white/[0.08]">
                <AvatarImage src={user?.photoURL ?? ""} />
                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-[10px] font-semibold">
                  {(user?.displayName || user?.email || "U").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {(!collapsed || mobile) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-[12px] font-medium text-zinc-300 truncate leading-none mb-0.5">
                      {user?.displayName || "Developer"}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate leading-none">{user?.email || "No email"}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {(!collapsed || mobile) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Badge className="bg-indigo-500/15 text-indigo-400 border-0 text-[9px] px-1.5 py-0.5 uppercase tracking-wide font-semibold shrink-0">
                      Free
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-52 bg-zinc-900 border-white/10">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-zinc-400">{user?.email || "Menu"}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem onClick={() => router.push("/dashboard/billing")} className="text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer text-sm">
                <CreditCard className="w-3.5 h-3.5 mr-2 text-zinc-500" /> Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="text-zinc-300 hover:text-white hover:bg-white/[0.06] cursor-pointer text-sm">
                <Settings className="w-3.5 h-3.5 mr-2 text-zinc-500" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem
                onClick={() => logout()}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/[0.08] cursor-pointer text-sm"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.aside>
  );
}
