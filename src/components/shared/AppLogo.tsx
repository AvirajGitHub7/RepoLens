import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AppLogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function AppLogo({ className, size = "md", showText = true, ...props }: AppLogoProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
    xl: "w-14 h-14",
  };

  const textClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-3", className)} {...props}>
      {/* Abstract Orange Minimal Web Logo */}
      <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[size])}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-lg"
        >
          <defs>
            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7A00" />
              <stop offset="100%" stopColor="#FF4500" />
            </linearGradient>
            <linearGradient id="orangeLightGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFB347" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Glowing background blob */}
          <circle cx="50" cy="50" r="40" fill="url(#orangeGradient)" opacity="0.15" filter="url(#glow)" />

          {/* Main interconnected shapes representing "Lens" and "Repo" */}
          <path
            d="M30 50 C30 25, 45 15, 65 25 C85 35, 85 65, 65 75 C45 85, 30 75, 30 50 Z"
            fill="url(#orangeGradient)"
          />
          <path
            d="M70 50 C70 75, 55 85, 35 75 C15 65, 15 35, 35 25 C55 15, 70 25, 70 50 Z"
            fill="url(#orangeLightGradient)"
            opacity="0.9"
            style={{ mixBlendMode: 'overlay' }}
          />
          
          {/* Inner dot/lens */}
          <circle cx="50" cy="50" r="12" fill="#FFFFFF" opacity="0.9" />
          <circle cx="50" cy="50" r="6" fill="url(#orangeGradient)" />
        </svg>
      </div>
      
      {showText && (
        <span className={cn("font-bold tracking-tight text-white", textClasses[size])}>
          Repo<span className="text-[#FF7A00]">Lens</span>
        </span>
      )}
    </div>
  );
}
