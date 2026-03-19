import type { SemaforoStatus } from "./types";

export function getSemaforo(percentOfMeta: number): SemaforoStatus {
  if (percentOfMeta >= 1.0) return "green";
  if (percentOfMeta >= 0.7) return "yellow";
  return "red";
}

export function getSemaforoInverse(percentOfMeta: number): SemaforoStatus {
  if (percentOfMeta <= 1.0) return "green";
  if (percentOfMeta <= 1.43) return "yellow";
  return "red";
}

export function getSemaforoColor(status: SemaforoStatus): string {
  switch (status) {
    case "green":
      return "#22c55e";
    case "yellow":
      return "#eab308";
    case "red":
      return "#ef4444";
    case "neutral":
      return "#6b7280";
  }
}

export function getSemaforoBgClass(status: SemaforoStatus): string {
  switch (status) {
    case "green":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "yellow":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "red":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "neutral":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

export function getSemaforoGlowClass(status: SemaforoStatus): string {
  switch (status) {
    case "green":
      return "shadow-emerald-500/20";
    case "yellow":
      return "shadow-yellow-500/20";
    case "red":
      return "shadow-red-500/25";
    case "neutral":
      return "shadow-gray-500/10";
  }
}
