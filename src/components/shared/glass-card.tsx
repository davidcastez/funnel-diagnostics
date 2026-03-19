"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "red" | "yellow" | "green" | "purple" | null;
}

export function GlassCard({ children, className, glow }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-5",
        glow === "red" && "glow-red",
        glow === "yellow" && "glow-yellow",
        glow === "green" && "glow-green",
        glow === "purple" && "glow-purple",
        className
      )}
    >
      {children}
    </div>
  );
}
