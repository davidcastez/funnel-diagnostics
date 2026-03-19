"use client";

import { motion } from "framer-motion";
import { useCalculations } from "@/hooks/use-calculations";
import { useFunnelStore } from "@/stores/funnel-store";
import { GlassCard } from "@/components/shared/glass-card";
import { SemaforoBadge } from "@/components/shared/semaforo-badge";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { formatCurrency, formatPercent, formatMultiplier, formatNumber } from "@/lib/formatters";
import { getSemaforo } from "@/lib/semaforo";
import { getSemaforoColor } from "@/lib/semaforo";
import { DollarSign, TrendingUp, Percent, ArrowRightLeft } from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function ExecutiveDashboard() {
  const calc = useCalculations();
  const inputs = useFunnelStore((s) => s.inputs);
  const { dashboard, funnelStages } = calc;

  const roiSemaforo = getSemaforo(
    inputs.goals.metaROI > 0 ? dashboard.roi / inputs.goals.metaROI : 0
  );
  const facSemaforo = getSemaforo(
    inputs.goals.metaFacturacion > 0
      ? dashboard.facturacion / inputs.goals.metaFacturacion
      : 0
  );
  const cashSemaforo = getSemaforo(
    inputs.goals.metaCash > 0 ? dashboard.cash / inputs.goals.metaCash : 0
  );

  const kpis = [
    {
      label: "Facturacion",
      value: dashboard.facturacion,
      format: formatCurrency,
      icon: DollarSign,
      semaforo: facSemaforo,
      meta: formatCurrency(inputs.goals.metaFacturacion),
    },
    {
      label: "Cash Recibido",
      value: dashboard.cash,
      format: formatCurrency,
      icon: DollarSign,
      semaforo: cashSemaforo,
      meta: formatCurrency(inputs.goals.metaCash),
    },
    {
      label: "ROI",
      value: dashboard.roi,
      format: formatMultiplier,
      icon: TrendingUp,
      semaforo: roiSemaforo,
      meta: `${inputs.goals.metaROI}x`,
    },
    {
      label: "PCA",
      value: dashboard.pca,
      format: formatCurrency,
      icon: ArrowRightLeft,
      semaforo: dashboard.pca > 0 ? "green" as const : "red" as const,
      meta: "> $0",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">Dashboard Ejecutivo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen general de resultados y metricas clave
        </p>
      </div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <GlassCard
            key={kpi.label}
            glow={kpi.semaforo === "red" ? "red" : null}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-1.5 rounded-lg bg-white/5">
                <kpi.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <SemaforoBadge status={kpi.semaforo} size="sm" />
            </div>
            <p className="text-2xl font-bold font-mono">
              <AnimatedNumber value={kpi.value} format={kpi.format} />
            </p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-xs text-muted-foreground font-mono">
                Meta: {kpi.meta}
              </p>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Funnel Cascade */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h3 className="text-sm font-semibold mb-4">Cascada del Funnel</h3>
          <div className="space-y-2">
            {funnelStages.map((stage, i) => (
              <div
                key={stage.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/8 transition-colors"
              >
                <div className="w-6 text-xs text-muted-foreground font-mono text-right">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{stage.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">
                        {formatPercent(stage.value)}
                      </span>
                      <SemaforoBadge status={stage.semaforo} size="sm" showLabel={false} />
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(stage.percentOfMeta * 100, 100)}%`,
                        backgroundColor: getSemaforoColor(stage.semaforo),
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      Meta: {formatPercent(stage.meta)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {(stage.percentOfMeta * 100).toFixed(0)}% de meta
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
