import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RepoLens — AI-Powered Interview Prep for Developers",
  description:
    "Convert any GitHub repository into interview-ready insights. Get AI-generated project summaries, architecture explanations, interview questions, and mock interviews tailored to your codebase.",
  keywords: [
    "interview prep",
    "GitHub analysis",
    "AI code review",
    "developer interview",
    "technical interview",
    "portfolio analysis",
  ],
  openGraph: {
    title: "RepoLens — AI-Powered Interview Prep",
    description: "Turn your GitHub projects into interview confidence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
