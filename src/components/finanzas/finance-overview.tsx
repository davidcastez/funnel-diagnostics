"use client";

import { motion } from "framer-motion";
import { useCalculations } from "@/hooks/use-calculations";
import { GlassCard } from "@/components/shared/glass-card";
import { SemaforoBadge } from "@/components/shared/semaforo-badge";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { formatCurrency, formatPercent, formatMultiplier } from "@/lib/formatters";
import { getSemaforo } from "@/lib/semaforo";
import { TrendingDown, TrendingUp, Landmark, Wallet } from "lucide-react";

export function FinanceOverview() {
  const calc = useCalculations();
  const { finance: f, dashboard } = calc;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">Metricas Financieras</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Costos, profit, margen y liquidez
        </p>
      </div>

      {/* COSTOS Y PROFIT */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-400" /> Costos y Profit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "CoGS Total", value: f.cogsTotal, color: "text-foreground" },
            {
              label: "Gross Profit",
              value: f.grossProfit,
              semaforo: f.grossProfit > 0 ? "green" as const : "red" as const,
              color: f.grossProfit > 0 ? "text-emerald-400" : "text-red-400",
            },
            { label: "Costos Operativos", value: f.operatingCosts, color: "text-foreground" },
            {
              label: "Net Profit",
              value: f.netProfit,
              semaforo: f.netProfit > 0 ? "green" as const : "red" as const,
              color: f.netProfit > 0 ? "text-emerald-400" : "text-red-400",
            },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                {item.semaforo && (
                  <SemaforoBadge status={item.semaforo} size="sm" showLabel={false} />
                )}
              </div>
              <p className={`text-xl font-bold font-mono ${item.color}`}>
                <AnimatedNumber value={item.value} format={formatCurrency} />
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* MARGENES */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Margenes y Eficiencia
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">% Profit Margin</span>
              <SemaforoBadge
                status={getSemaforo(f.profitMargin / 0.25)}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber
                value={f.profitMargin}
                format={(v) => formatPercent(v)}
              />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: 25%</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <span className="text-xs text-muted-foreground">Margen por Venta</span>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber value={f.margenPorVenta} format={formatCurrency} />
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">MTRR (ROI)</span>
              <SemaforoBadge
                status={getSemaforo(f.mtrr / 3)}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber value={f.mtrr} format={formatMultiplier} />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: 3x</p>
          </div>
        </div>
      </GlassCard>

      {/* LIQUIDEZ */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Landmark className="w-4 h-4 text-blue-400" /> Liquidez
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Net Cash</span>
              <SemaforoBadge
                status={f.netCash > 0 ? "green" : "red"}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className={`text-xl font-bold font-mono ${f.netCash >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              <AnimatedNumber value={f.netCash} format={formatCurrency} />
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Core Capital (meses)</span>
              <SemaforoBadge
                status={f.coreCapital >= 6 ? "green" : f.coreCapital >= 3 ? "yellow" : "red"}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber
                value={f.coreCapital}
                format={(v) => (isFinite(v) ? `${v.toFixed(1)} meses` : "N/A")}
              />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: 6 meses</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Net Worth</span>
              <SemaforoBadge
                status={f.netWorth > 0 ? "green" : "red"}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className={`text-xl font-bold font-mono ${f.netWorth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              <AnimatedNumber value={f.netWorth} format={formatCurrency} />
            </p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
