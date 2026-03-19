"use client";

import { motion } from "framer-motion";
import { useCalculations } from "@/hooks/use-calculations";
import { GlassCard } from "@/components/shared/glass-card";
import { SemaforoBadge } from "@/components/shared/semaforo-badge";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/constants";
import { getSemaforoColor } from "@/lib/semaforo";
import { AlertTriangle, TrendingUp, ArrowRight, Zap, ChevronDown } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const heroReveal = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export function BottleneckHero() {
  const calc = useCalculations();
  const { primaryBottleneck, bottlenecks, funnelStages, dashboard } = calc;

  const hasData = dashboard.facturacion > 0 || calc.sales.ventasTotales > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Diagnostica tu Negocio</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Ingresa tus metricas en la pestana &quot;Datos&quot; o carga los datos de
          ejemplo para obtener un diagnostico completo de tu funnel.
        </p>
      </div>
    );
  }

  if (!primaryBottleneck) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroReveal}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6">
          <TrendingUp className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-emerald-400">
          Todas tus metricas estan en verde
        </h2>
        <p className="text-muted-foreground max-w-md">
          Tu funnel esta funcionando por encima de las metas establecidas.
          Considera escalar tu inversion publicitaria.
        </p>
      </motion.div>
    );
  }

  const glowType =
    primaryBottleneck.semaforo === "red"
      ? "red"
      : primaryBottleneck.semaforo === "yellow"
      ? "yellow"
      : null;

  const categoryHealth = ["marketing", "sistema", "ventas"].map((cat) => {
    const catStages = funnelStages.filter((s) => s.category === cat);
    const avgPercent =
      catStages.length > 0
        ? catStages.reduce((sum, s) => sum + s.percentOfMeta, 0) /
          catStages.length
        : 0;
    const worstStage = catStages.reduce(
      (worst, s) =>
        s.percentOfMeta < (worst?.percentOfMeta ?? Infinity) ? s : worst,
      catStages[0]
    );
    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      avgPercent,
      worstStage,
      color: CATEGORY_COLORS[cat],
    };
  });

  const radarData = funnelStages.map((stage) => ({
    metric: stage.label,
    actual: Math.min(stage.percentOfMeta * 100, 150),
    meta: 100,
    fill: getSemaforoColor(stage.semaforo),
  }));

  const waterfallData = bottlenecks.slice(0, 5).map((b) => ({
    name: b.label,
    impacto: b.revenueImpact,
    fill:
      b.category === "marketing"
        ? "#8b5cf6"
        : b.category === "sistema"
        ? "#3b82f6"
        : "#f59e0b",
  }));

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* PRIMARY BOTTLENECK HERO */}
      <motion.div variants={heroReveal}>
        <GlassCard glow={glowType} className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{
                    backgroundColor: `${getSemaforoColor(primaryBottleneck.semaforo)}15`,
                  }}
                >
                  <AlertTriangle
                    className="w-6 h-6"
                    style={{ color: getSemaforoColor(primaryBottleneck.semaforo) }}
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Cuello de Botella Principal
                  </p>
                  <h2 className="text-2xl font-bold mt-0.5">
                    {primaryBottleneck.label}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[primaryBottleneck.category]}20`,
                    color: CATEGORY_COLORS[primaryBottleneck.category],
                  }}
                >
                  {CATEGORY_LABELS[primaryBottleneck.category]}
                </span>
                <SemaforoBadge status={primaryBottleneck.semaforo} size="lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">Valor Actual</p>
                <p className="text-3xl font-bold font-mono">
                  <AnimatedNumber
                    value={primaryBottleneck.currentValue * 100}
                    format={(v) => `${v.toFixed(1)}%`}
                  />
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">Meta</p>
                <p className="text-3xl font-bold font-mono text-primary">
                  {formatPercent(primaryBottleneck.metaValue)}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-xs text-muted-foreground mb-1">
                  Revenue Potencial
                </p>
                <p className="text-3xl font-bold font-mono text-emerald-400">
                  <AnimatedNumber
                    value={primaryBottleneck.revenueImpact}
                    format={(v) => `+${formatCurrency(v)}`}
                  />
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progreso hacia la meta</span>
                <span className="font-mono">
                  {(primaryBottleneck.percentOfMeta * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(primaryBottleneck.percentOfMeta * 100, 100)}%`,
                  }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: getSemaforoColor(primaryBottleneck.semaforo),
                  }}
                />
              </div>
            </div>

            {/* Action recommendation */}
            <div
              className="p-4 rounded-xl border"
              style={{
                borderColor: `${getSemaforoColor(primaryBottleneck.semaforo)}30`,
                backgroundColor: `${getSemaforoColor(primaryBottleneck.semaforo)}08`,
              }}
            >
              <div className="flex items-start gap-3">
                <ArrowRight
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: getSemaforoColor(primaryBottleneck.semaforo) }}
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: getSemaforoColor(primaryBottleneck.semaforo) }}>
                    Accion Recomendada
                  </p>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {primaryBottleneck.actionRecommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* CATEGORY HEALTH CARDS */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryHealth.map((cat) => {
            const isWorst = cat.worstStage?.semaforo === "red";
            return (
              <GlassCard
                key={cat.category}
                className="relative overflow-hidden"
                glow={isWorst ? "red" : null}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="text-sm font-semibold">{cat.label}</h3>
                  </div>
                  {cat.worstStage && (
                    <SemaforoBadge status={cat.worstStage.semaforo} size="sm" />
                  )}
                </div>

                {/* Circular progress */}
                <div className="flex items-center justify-center mb-3">
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-white/5"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${Math.min(cat.avgPercent, 1) * 264} 264`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold font-mono">
                        {(cat.avgPercent * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {cat.worstStage && (
                  <p className="text-xs text-muted-foreground text-center">
                    Peor metrica:{" "}
                    <span className="text-foreground font-medium">
                      {cat.worstStage.label}
                    </span>
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>
      </motion.div>

      {/* RADAR CHART */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-primary" />
            Radar de Metricas vs Metas
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "#8b8ba0", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 150]}
                  tick={{ fill: "#8b8ba0", fontSize: 10 }}
                />
                <Radar
                  name="Meta"
                  dataKey="meta"
                  stroke="#8b5cf6"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Radar
                  name="Actual"
                  dataKey="actual"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </motion.div>

      {/* PRIORITY LIST */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Prioridad de Optimizacion
          </h3>
          <div className="space-y-3">
            {bottlenecks.map((b) => (
              <div
                key={b.metricId}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    backgroundColor: `${getSemaforoColor(b.semaforo)}20`,
                    color: getSemaforoColor(b.semaforo),
                  }}
                >
                  #{b.priorityRank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium truncate">
                      {b.label}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[b.category]}20`,
                        color: CATEGORY_COLORS[b.category],
                      }}
                    >
                      {CATEGORY_LABELS[b.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">
                      {formatPercent(b.currentValue)} /{" "}
                      {formatPercent(b.metaValue)}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-white/10 max-w-32">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(b.percentOfMeta * 100, 100)}%`,
                          backgroundColor: getSemaforoColor(b.semaforo),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-emerald-400 font-mono">
                    +{formatCurrency(b.revenueImpact)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">potencial</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* WATERFALL CHART */}
      {waterfallData.length > 0 && (
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Impacto en Revenue por Cuello de Botella
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterfallData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#8b8ba0", fontSize: 11 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#8b8ba0", fontSize: 11 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1b2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), "Impacto"]}
                  />
                  <ReferenceLine x={0} stroke="rgba(255,255,255,0.1)" />
                  <Bar dataKey="impacto" radius={[0, 6, 6, 0]}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}
