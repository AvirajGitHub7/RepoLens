"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[oklch(0.08_0_0)] overflow-hidden print:h-auto print:overflow-visible">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0 h-full print:hidden">
        <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden print:overflow-visible print:block">
        <Topbar />
        <main className="flex-1 overflow-y-auto print:overflow-visible print:block">
          {children}
        </main>
      </div>
    </div>
  );
}
