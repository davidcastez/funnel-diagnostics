"use client";

import { motion } from "framer-motion";
import { useCalculations } from "@/hooks/use-calculations";
import { useFunnelStore } from "@/stores/funnel-store";
import { GlassCard } from "@/components/shared/glass-card";
import { SemaforoBadge } from "@/components/shared/semaforo-badge";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getSemaforo, getSemaforoInverse, getSemaforoColor } from "@/lib/semaforo";
import type { SemaforoStatus } from "@/lib/types";
import { Target, MousePointerClick, Globe, Video, DollarSign } from "lucide-react";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  formula: string;
  value: number;
  format: (v: number) => string;
  meta: number;
  metaFormat?: (v: number) => string;
  semaforo: SemaforoStatus;
  benchmark: string;
  action: string;
  optimizar: string;
}

function MetricCard({
  icon: Icon,
  label,
  formula,
  value,
  format,
  meta,
  metaFormat,
  semaforo,
  benchmark,
  action,
  optimizar,
}: MetricCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-[10px] text-muted-foreground font-mono">{formula}</p>
          </div>
        </div>
        <SemaforoBadge status={semaforo} size="sm" />
      </div>
      <div className="flex items-end gap-4">
        <div>
          <p className="text-2xl font-bold font-mono">
            <AnimatedNumber value={value} format={format} />
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>Meta: {(metaFormat || format)(meta)}</p>
          <p>Bench: {benchmark}</p>
        </div>
      </div>
      {semaforo !== "green" && (
        <div
          className="p-2.5 rounded-lg text-xs leading-relaxed"
          style={{
            backgroundColor: `${getSemaforoColor(semaforo)}08`,
            borderLeft: `2px solid ${getSemaforoColor(semaforo)}`,
          }}
        >
          <span className="font-medium text-muted-foreground">{optimizar}: </span>
          {action}
        </div>
      )}
    </div>
  );
}

export function MarketingDeepDive() {
  const calc = useCalculations();
  const inputs = useFunnelStore((s) => s.inputs);
  const { marketing, dashboard } = calc;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">Metricas de Marketing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Analisis detallado de trafico, landing, VSL y rentabilidad
        </p>
      </div>

      {/* TRAFICO */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-violet-400" /> Trafico
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={DollarSign}
            label="CPM"
            formula="($INV/#IMP)*1000"
            value={marketing.cpm}
            format={formatCurrency}
            meta={15}
            semaforo={getSemaforoInverse(marketing.cpm / 15)}
            benchmark="$5-15"
            optimizar="Segmentacion"
            action="Testear audiencias lookalike 1% y excluir compradores"
          />
          <MetricCard
            icon={MousePointerClick}
            label="CTR"
            formula="#CLI/#IMP"
            value={marketing.ctr}
            format={(v) => formatPercent(v, 2)}
            meta={inputs.goals.metaCTR}
            metaFormat={(v) => formatPercent(v, 0)}
            semaforo={getSemaforo(marketing.ctr / inputs.goals.metaCTR)}
            benchmark="1-3%"
            optimizar="Creativos"
            action="Crear 5 variaciones de creativos con diferentes hooks"
          />
          <MetricCard
            icon={DollarSign}
            label="CPC"
            formula="$INV/#CLI"
            value={marketing.cpc}
            format={formatCurrency}
            meta={2}
            semaforo={getSemaforoInverse(marketing.cpc / 2)}
            benchmark="$0.50-2"
            optimizar="CTR"
            action="Mejorar CTR para reducir CPC automaticamente"
          />
        </div>
      </GlassCard>

      {/* LANDING */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" /> Landing Page
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={Globe}
            label="% Llegada"
            formula="#VIS/#CLI"
            value={marketing.porcentajeLlegada}
            format={formatPercent}
            meta={0.95}
            semaforo={getSemaforo(marketing.porcentajeLlegada / 0.95)}
            benchmark=">95%"
            optimizar="Velocidad"
            action="Comprimir imagenes y activar lazy loading"
          />
          <MetricCard
            icon={Target}
            label="CR Landing"
            formula="#LEA/#VIS"
            value={marketing.crLanding}
            format={formatPercent}
            meta={inputs.goals.metaCRLanding}
            semaforo={getSemaforo(marketing.crLanding / inputs.goals.metaCRLanding)}
            benchmark="20-40%"
            optimizar="Copy, diseno"
            action="A/B test: headline, imagen hero, color de boton"
          />
          <MetricCard
            icon={DollarSign}
            label="CPL"
            formula="$INV/#LEA"
            value={marketing.cpl}
            format={formatCurrency}
            meta={30}
            semaforo={getSemaforoInverse(marketing.cpl / 30)}
            benchmark="$5-30"
            optimizar="CTR y CR"
            action="Mejorar CR landing es la forma mas rapida de bajar CPL"
          />
        </div>
      </GlassCard>

      {/* VSL */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Video className="w-4 h-4 text-purple-400" /> VSL
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            icon={Video}
            label="Tasa Reproduccion"
            formula="#REP/#VIS"
            value={marketing.tasaReproduccion}
            format={formatPercent}
            meta={inputs.goals.metaTasaRep}
            semaforo={getSemaforo(marketing.tasaReproduccion / inputs.goals.metaTasaRep)}
            benchmark="40-60%"
            optimizar="Autoplay"
            action="Probar thumbnail con texto y cara visible"
          />
          <MetricCard
            icon={Video}
            label="% Prom. Retencion"
            formula="Input"
            value={marketing.promedioRetencion}
            format={formatPercent}
            meta={0.25}
            semaforo={getSemaforo(marketing.promedioRetencion / 0.25)}
            benchmark="40-60%"
            optimizar="Contenido"
            action="Agregar pattern interrupts cada 2-3 minutos"
          />
          <MetricCard
            icon={Target}
            label="% Lead a Agenda"
            formula="#CIA/#LEA"
            value={marketing.porcentajeLeadAgendas}
            format={formatPercent}
            meta={0.15}
            semaforo={getSemaforo(marketing.porcentajeLeadAgendas / 0.15)}
            benchmark="10-20%"
            optimizar="Oferta"
            action="Agregar countdown timer y bonus por agendar hoy"
          />
        </div>
      </GlassCard>

      {/* RENTABILIDAD */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Rentabilidad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">EPC vs CPC</p>
              <SemaforoBadge
                status={marketing.epc > marketing.cpc ? "green" : "red"}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">EPC</p>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  {formatCurrency(marketing.epc)}
                </p>
              </div>
              <span className="text-muted-foreground">vs</span>
              <div>
                <p className="text-xs text-muted-foreground">CPC</p>
                <p className="text-xl font-bold font-mono text-red-400">
                  {formatCurrency(marketing.cpc)}
                </p>
              </div>
            </div>
            {marketing.epc <= marketing.cpc && (
              <p className="text-xs text-red-400 mt-2">
                CRITICO: Cada clic pierde dinero. Mejorar % cierre o subir precio.
              </p>
            )}
          </div>
          <div className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">EPL vs CPL</p>
              <SemaforoBadge
                status={marketing.epl > marketing.cpl ? "green" : "red"}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">EPL</p>
                <p className="text-xl font-bold font-mono text-emerald-400">
                  {formatCurrency(marketing.epl)}
                </p>
              </div>
              <span className="text-muted-foreground">vs</span>
              <div>
                <p className="text-xs text-muted-foreground">CPL</p>
                <p className="text-xl font-bold font-mono text-red-400">
                  {formatCurrency(marketing.cpl)}
                </p>
              </div>
            </div>
            {marketing.epl <= marketing.cpl && (
              <p className="text-xs text-red-400 mt-2">
                CRITICO: Cada lead pierde dinero. No escales hasta que EPL &gt; CPL.
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
