"use client";

import { motion } from "framer-motion";
import { useCalculations } from "@/hooks/use-calculations";
import { GlassCard } from "@/components/shared/glass-card";
import { SemaforoBadge } from "@/components/shared/semaforo-badge";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getSemaforo, getSemaforoInverse } from "@/lib/semaforo";
import { Star, Users, Repeat, Heart } from "lucide-react";

export function ServiceOverview() {
  const calc = useCalculations();
  const { service: s } = calc;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold">Metricas de Servicio y Retencion</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Referidos, upsells, reembolsos y lifetime value
        </p>
      </div>

      {/* RETENCION */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Repeat className="w-4 h-4 text-pink-400" /> Retencion y Referidos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">% Referral Rate</span>
              <SemaforoBadge
                status={getSemaforo(s.referralRate / 0.2)}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber value={s.referralRate} format={formatPercent} />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: 20%</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">% Upsell Rate</span>
              <SemaforoBadge
                status={getSemaforo(s.upsellRate / 0.3)}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber value={s.upsellRate} format={formatPercent} />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: 30%</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">% Reembolso</span>
              <SemaforoBadge
                status={getSemaforoInverse(s.reembolsoRate / 0.05)}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber value={s.reembolsoRate} format={formatPercent} />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: &lt;5%</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">NPS Score</span>
              <SemaforoBadge
                status={s.nps >= 50 ? "green" : s.nps >= 30 ? "yellow" : "red"}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-xl font-bold font-mono">
              <AnimatedNumber value={s.nps} format={(v) => v.toFixed(0)} />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: 50</p>
          </div>
        </div>
      </GlassCard>

      {/* LIFETIME VALUE */}
      <GlassCard>
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" /> Lifetime Value
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white/5 space-y-2">
            <span className="text-xs text-muted-foreground">LTV</span>
            <p className="text-2xl font-bold font-mono">
              <AnimatedNumber value={s.ltv} format={formatCurrency} />
            </p>
            <p className="text-[10px] text-muted-foreground">
              Facturacion / Clientes Activos
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 space-y-2">
            <span className="text-xs text-muted-foreground">LTW</span>
            <p className="text-2xl font-bold font-mono">
              <AnimatedNumber value={s.ltw} format={formatCurrency} />
            </p>
            <p className="text-[10px] text-muted-foreground">
              LTV * (1 + % Referral)
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">LTV:CAC Ratio</span>
              <SemaforoBadge
                status={s.ltvCacRatio >= 3 ? "green" : s.ltvCacRatio >= 2 ? "yellow" : "red"}
                size="sm"
                showLabel={false}
              />
            </div>
            <p className="text-2xl font-bold font-mono">
              <AnimatedNumber
                value={s.ltvCacRatio}
                format={(v) => (isFinite(v) ? `${v.toFixed(1)}x` : "N/A")}
              />
            </p>
            <p className="text-[10px] text-muted-foreground">Meta: &gt;3x</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
