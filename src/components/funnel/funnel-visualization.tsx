"use client";

import { motion } from "framer-motion";
import { useCalculations } from "@/hooks/use-calculations";
import { useFunnelStore } from "@/stores/funnel-store";
import { GlassCard } from "@/components/shared/glass-card";
import { SemaforoBadge } from "@/components/shared/semaforo-badge";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/formatters";
import { getSemaforoColor, getSemaforo, getSemaforoInverse } from "@/lib/semaforo";
import { calculateDashboardCascade } from "@/lib/calculations";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ArrowDown } from "lucide-react";

interface MetricRow {
  label: string;
  symbol: string;
  value: number;
  format: (v: number) => string;
  meta?: number;
  metaFormat?: (v: number) => string;
  benchmark?: string;
  invertedSemaforo?: boolean;
}

function MetricTable({ title, rows }: { title: string; rows: MetricRow[] }) {
  return (
    <GlassCard>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-1.5">
        {rows.map((row) => {
          const percentOfMeta = row.meta
            ? row.invertedSemaforo
              ? row.meta / Math.max(row.value, 0.0001)
              : row.value / row.meta
            : 0;
          const semaforo = row.meta
            ? row.invertedSemaforo
              ? getSemaforoInverse(row.value / row.meta)
              : getSemaforo(percentOfMeta)
            : "neutral" as const;

          return (
            <div
              key={row.symbol}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">
                  {row.symbol}
                </span>
                <span className="text-sm truncate">{row.label}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-mono font-medium w-20 text-right">
                  {row.format(row.value)}
                </span>
                {row.meta !== undefined && (
                  <span className="text-xs text-muted-foreground font-mono w-16 text-right">
                    {(row.metaFormat || row.format)(row.meta)}
                  </span>
                )}
                {row.benchmark && (
                  <span className="text-[10px] text-muted-foreground w-14 text-right">
                    {row.benchmark}
                  </span>
                )}
                {row.meta !== undefined && (
                  <SemaforoBadge status={semaforo} size="sm" showLabel={false} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

export function FunnelVisualization() {
  const calc = useCalculations();
  const inputs = useFunnelStore((s) => s.inputs);
  const cascade = calculateDashboardCascade(inputs);
  const { marketing, sales: salesKPIs } = calc;

  const funnelData = cascade.stages.map((stage, i) => {
    const prevValue = i > 0 ? cascade.stages[i - 1].value : stage.value;
    const conversionRate = i > 0 && prevValue > 0 ? stage.value / prevValue : 1;
    return {
      name: stage.label,
      value: stage.value,
      conversionRate,
    };
  });

  const maxValue = Math.max(...funnelData.map((d) => d.value), 1);
  const colors = [
    "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6",
    "#4c1d95", "#3b82f6", "#2563eb", "#1d4ed8",
    "#f59e0b", "#22c55e",
  ];

  const trafficMetrics: MetricRow[] = [
    { label: "CPM", symbol: "$CPM", value: marketing.cpm, format: formatCurrency, meta: 15, invertedSemaforo: true, benchmark: "$5-15" },
    { label: "CTR", symbol: "%CTR", value: marketing.ctr, format: (v) => formatPercent(v, 2), meta: inputs.goals.metaCTR, benchmark: "1-3%" },
    { label: "CPC", symbol: "$CPC", value: marketing.cpc, format: formatCurrency, meta: 2, invertedSemaforo: true, benchmark: "$0.50-2" },
  ];

  const landingMetrics: MetricRow[] = [
    { label: "% Llegada", symbol: "%LLE", value: marketing.porcentajeLlegada, format: formatPercent, meta: 0.95, benchmark: ">95%" },
    { label: "CR Landing", symbol: "%CR", value: marketing.crLanding, format: formatPercent, meta: inputs.goals.metaCRLanding, benchmark: "20-40%" },
    { label: "CPL", symbol: "$CPL", value: marketing.cpl, format: formatCurrency, meta: 30, invertedSemaforo: true, benchmark: "$5-30" },
  ];

  const vslMetrics: MetricRow[] = [
    { label: "Tasa Reproduccion", symbol: "%REP", value: marketing.tasaReproduccion, format: formatPercent, meta: inputs.goals.metaTasaRep, benchmark: "40-60%" },
    { label: "% Prom. Retencion", symbol: "%PRO", value: marketing.promedioRetencion, format: formatPercent, meta: 0.5, benchmark: "40-60%" },
    { label: "% Lead a Agenda", symbol: "%LCA", value: marketing.porcentajeLeadAgendas, format: formatPercent, meta: 0.8, benchmark: "10-20%" },
  ];

  const agendaMetrics: MetricRow[] = [
    { label: "% Agenda", symbol: "%AGE", value: salesKPIs.porcentajeAgenda, format: formatPercent, meta: inputs.goals.metaPorcentajeAgenda, benchmark: "50-70%" },
    { label: "% Calificadas", symbol: "%CAL", value: salesKPIs.porcentajeCalificadas, format: formatPercent, meta: 0.7, benchmark: "60-80%" },
  ];

  const sesionMetrics: MetricRow[] = [
    { label: "% Asistencia", symbol: "%ASI", value: salesKPIs.porcentajeAsistencia, format: formatPercent, meta: inputs.goals.metaPorcentajeAsistencia, benchmark: "60-80%" },
    { label: "No Asistieron", symbol: "#NAS", value: salesKPIs.noAsiste, format: formatNumber },
    { label: "CP Asistencia", symbol: "$CPA", value: salesKPIs.cpAsistencia, format: formatCurrency },
  ];

  const cierreMetrics: MetricRow[] = [
    { label: "SCR Principal", symbol: "%SCRP", value: salesKPIs.scrPrincipal, format: formatPercent, meta: 0.4, benchmark: "15-30%" },
    { label: "% Downsell", symbol: "%DW", value: salesKPIs.dwcr, format: formatPercent, meta: 0.08, benchmark: "5-10%" },
    { label: "SCR Total", symbol: "%SCR", value: salesKPIs.scrTotal, format: formatPercent, meta: 0.25, benchmark: "20-40%" },
    { label: "BTS", symbol: "%BTS", value: salesKPIs.bts, format: formatPercent, meta: 0.15, benchmark: "10-20%" },
    { label: "CAC", symbol: "$CAC", value: salesKPIs.cac, format: formatCurrency },
    { label: "FCR", symbol: "%FCR", value: calc.dashboard.fcr, format: (v) => formatPercent(v, 2), meta: 0.03, benchmark: "2-5%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">Embudo de Conversion</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Metricas calculadas en cada nivel del funnel
        </p>
      </div>

      {/* Visual funnel */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4">Cascada Visual</h3>
        <div className="space-y-1">
          {funnelData.map((stage, i) => {
            const widthPercent = Math.max((stage.value / maxValue) * 100, 8);
            return (
              <div key={stage.name}>
                {i > 0 && (
                  <div className="flex items-center justify-center py-1">
                    <ArrowDown className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground font-mono ml-1">
                      {(stage.conversionRate * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-24 text-right shrink-0">
                    {stage.name}
                  </span>
                  <div className="flex-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                      className="h-8 rounded-lg flex items-center px-3"
                      style={{ backgroundColor: colors[i] + "40", borderLeft: `3px solid ${colors[i]}` }}
                    >
                      <span className="text-xs font-mono font-medium">
                        {stage.value >= 1000
                          ? formatNumber(stage.value)
                          : stage.value < 1
                          ? formatCurrency(stage.value)
                          : formatNumber(stage.value)}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Metric tables by level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MetricTable title="Nivel 1: Trafico" rows={trafficMetrics} />
        <MetricTable title="Nivel 2: Landing Page" rows={landingMetrics} />
        <MetricTable title="Nivel 3: VSL / Video" rows={vslMetrics} />
        <MetricTable title="Nivel 4: Agendas" rows={agendaMetrics} />
        <MetricTable title="Nivel 5: Sesiones" rows={sesionMetrics} />
        <MetricTable title="Nivel 6: Cierres" rows={cierreMetrics} />
      </div>
    </motion.div>
  );
}
