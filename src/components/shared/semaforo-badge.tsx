"use client";

import { cn } from "@/lib/utils";
import { getSemaforoBgClass } from "@/lib/semaforo";
import type { SemaforoStatus } from "@/lib/types";

interface SemaforoBadgeProps {
  status: SemaforoStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const labels: Record<SemaforoStatus, string> = {
  green: "OK",
  yellow: "Atencion",
  red: "Critico",
  neutral: "-",
};

const dotColors: Record<SemaforoStatus, string> = {
  green: "bg-emerald-400",
  yellow: "bg-yellow-400",
  red: "bg-red-400",
  neutral: "bg-gray-400",
};

export function SemaforoBadge({
  status,
  size = "md",
  showLabel = true,
  className,
}: SemaforoBadgeProps) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        getSemaforoBgClass(status),
        sizeClasses[size],
        status === "red" && "animate-pulse-glow",
        className
      )}
    >
      <span className={cn("rounded-full", dotColors[status], dotSizes[size])} />
      {showLabel && labels[status]}
    </span>
  );
}
