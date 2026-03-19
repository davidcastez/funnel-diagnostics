"use client";

import { motion } from "framer-motion";
import { useCalculations } from "@/hooks/use-calculations";
import { useFunnelStore } from "@/stores/funnel-store";
import { GlassCard } from "@/components/shared/glass-card";
import { SemaforoBadge } from "@/components/shared/semaforo-badge";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/formatters";
import { getSemaforo, getSemaforoColor } from "@/lib/semaforo";
import { Calendar, Phone, TrendingUp, DollarSign } from "lucide-react";

export function SalesDeepDive() {
  const calc = useCalculations();
  const inputs = useFunnelStore((s) => s.inputs);
  const { sales: s, dashboard } = calc;

  const metrics = {
    agendas: [
      { label: "% Agenda", value: s.porcentajeAgenda, meta: inputs.goals.metaPorcentajeAgenda, format: formatPercent, action: "Reducir formulario a 4 campos maximo" },
      { label: "CPB", value: s.cpb, format: formatCurrency },
      { label: "% Calificadas", value: s.porcentajeCalificadas, meta: 0.7, format: formatPercent, action: "Agregar pregunta de presupuesto en formulario" },
      { label: "CPQB", value: s.cpqb, format: formatCurrency },
    ],
    sesiones: [
      { label: "% Asistencia", value: s.porcentajeAsistencia, meta: inputs.goals.metaPorcentajeAsistencia, format: formatPercent, action: "Agregar recordatorio SMS 1h antes + WhatsApp" },
      { label: "No Asistieron", value: s.noAsiste, format: formatNumber },
      { label: "CP Asistencia", value: s.cpAsistencia, format: formatCurrency },
    ],
    cierres: [
      { label: "% SCR Principal", value: s.scrPrincipal, meta: inputs.goals.metaPorcentajeCierre, format: formatPercent, action: "Practicar rebatir las 3 objeciones mas comunes" },
      { label: "% Downsell", value: s.dwcr, meta: 0.08, format: formatPercent, action: "Crear oferta de downsell atractiva: mismo resultado, diferente formato" },
      { label: "% SCR Total", value: s.scrTotal, meta: 0.25, format: formatPercent, action: "Trabajar en principal y downsell simultaneamente" },
      { label: "% BTS", value: s.bts, meta: 0.15, format: formatPercent, action: "BTS = ShowUp x SCR. Mejorar ambos." },
      { label: "CAC", value: s.cac, format: formatCurrency },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">Metricas de Ventas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Agendas, sesiones, cierres y rentabilidad por venta
        </p>
      </div>

      {/* AGENDAS */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" /> Agendas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {metrics.agendas.map((m) => {
            const semaforo = m.meta ? getSemaforo(m.value / m.meta) : ("neutral" as const);
            return (
              <div key={m.label} className="p-3 rounded-xl bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  {m.meta && <SemaforoBadge status={semaforo} size="sm" showLabel={false} />}
                </div>
                <p className="text-xl font-bold font-mono">
                  <AnimatedNumber value={m.value} format={m.format} />
                </p>
                {m.meta && (
                  <p className="text-[10px] text-muted-foreground">
                    Meta: {m.format(m.meta)}
                  </p>
                )}
                {m.action && semaforo !== "green" && semaforo !== "neutral" && (
                  <p className="text-[10px] leading-relaxed" style={{ color: getSemaforoColor(semaforo) }}>
                    {m.action}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* SESIONES */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-400" /> Sesiones
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metrics.sesiones.map((m) => {
            const semaforo = m.meta ? getSemaforo(m.value / m.meta) : ("neutral" as const);
            return (
              <div key={m.label} className="p-3 rounded-xl bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  {m.meta && <SemaforoBadge status={semaforo} size="sm" showLabel={false} />}
                </div>
                <p className="text-xl font-bold font-mono">
                  <AnimatedNumber value={m.value} format={m.format} />
                </p>
                {m.action && semaforo !== "green" && semaforo !== "neutral" && (
                  <p className="text-[10px] leading-relaxed" style={{ color: getSemaforoColor(semaforo) }}>
                    {m.action}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* CIERRES */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Cierres
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {metrics.cierres.map((m) => {
            const semaforo = m.meta ? getSemaforo(m.value / m.meta) : ("neutral" as const);
            return (
              <div key={m.label} className="p-3 rounded-xl bg-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                  {m.meta && <SemaforoBadge status={semaforo} size="sm" showLabel={false} />}
                </div>
                <p className="text-xl font-bold font-mono">
                  <AnimatedNumber value={m.value} format={m.format} />
                </p>
                {m.action && semaforo !== "green" && semaforo !== "neutral" && (
                  <p className="text-[10px] leading-relaxed" style={{ color: getSemaforoColor(semaforo) }}>
                    {m.action}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* RENTABILIDAD */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Rentabilidad por Venta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">EPB vs CPB</p>
              <SemaforoBadge status={s.epb > s.cpb ? "green" : "red"} size="sm" />
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-muted-foreground">EPB</p>
                <p className="text-lg font-bold font-mono text-emerald-400">{formatCurrency(s.epb)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CPB</p>
                <p className="text-lg font-bold font-mono text-red-400">{formatCurrency(s.cpb)}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">EPA vs CPA</p>
              <SemaforoBadge status={s.epAsistencia > s.cpAsistencia ? "green" : "red"} size="sm" />
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-muted-foreground">EPA</p>
                <p className="text-lg font-bold font-mono text-emerald-400">{formatCurrency(s.epAsistencia)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">CPA</p>
                <p className="text-lg font-bold font-mono text-red-400">{formatCurrency(s.cpAsistencia)}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <p className="text-sm mb-2">Margen por Venta</p>
            <p className="text-2xl font-bold font-mono">
              <AnimatedNumber value={s.margenPorVenta} format={formatCurrency} />
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              CAC: {formatCurrency(s.cac)}
            </p>
            <SemaforoBadge
              status={s.margenPorVenta > s.cac ? "green" : "red"}
              size="sm"
              className="mt-2"
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
