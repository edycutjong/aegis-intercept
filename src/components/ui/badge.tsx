import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "critical" | "high" | "medium" | "low" | "healthy" | "liquify";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80",
    secondary: "border-transparent bg-slate-800 text-slate-100 hover:bg-slate-800/80",
    destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
    outline: "text-slate-100",
    
    // Severity-specific
    critical: "border-transparent bg-red-500/20 text-red-400 border border-red-500/30",
    high: "border-transparent bg-orange-500/20 text-orange-400 border border-orange-500/30",
    medium: "border-transparent bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    low: "border-transparent bg-slate-500/20 text-slate-400 border border-slate-500/30",
    
    // Status-specific
    healthy: "border-transparent bg-green-500/20 text-green-400 border border-green-500/30",
    
    // Branding
    liquify: "border-transparent bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold tracking-widest uppercase",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
