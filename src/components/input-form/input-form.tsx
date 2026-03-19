"use client";

import { useFunnelStore } from "@/stores/funnel-store";
import { GlassCard } from "@/components/shared/glass-card";
import {
  Target,
  MousePointerClick,
  Eye,
  Users,
  Video,
  Calendar,
  Phone,
  TrendingUp,
  DollarSign,
  Star,
  Crosshair,
  RotateCcw,
  Database,
} from "lucide-react";

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  icon: Icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </label>
      <div className="flex items-center gap-0">
        {prefix && (
          <span className="px-2.5 py-2 text-xs text-muted-foreground bg-white/5 border border-r-0 border-border rounded-l-lg">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2 text-sm bg-white/5 border border-border text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors ${
            prefix ? "" : "rounded-l-lg"
          } ${suffix ? "" : "rounded-r-lg"}`}
          placeholder="0"
        />
        {suffix && (
          <span className="px-2.5 py-2 text-xs text-muted-foreground bg-white/5 border border-l-0 border-border rounded-r-lg">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
    </div>
  );
}

export function InputForm() {
  const { inputs, updateInput, loadSampleData, resetInputs } = useFunnelStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Datos de Entrada</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ingresa las metricas de tu negocio para obtener el diagnostico
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadSampleData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
          >
            <Database className="w-3 h-3" />
            Datos de ejemplo
          </button>
          <button
            onClick={resetInputs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* TRAFICO */}
        <GlassCard>
          <SectionHeader
            icon={Target}
            title="Trafico"
            color="bg-violet-500/20 text-violet-400"
          />
          <div className="space-y-3">
            <InputField
              label="Inversion Publicitaria"
              value={inputs.traffic.inversionPublicitaria}
              onChange={(v) => updateInput("traffic", "inversionPublicitaria", v)}
              prefix="$"
              icon={DollarSign}
            />
            <InputField
              label="Impresiones"
              value={inputs.traffic.impresiones}
              onChange={(v) => updateInput("traffic", "impresiones", v)}
              icon={Eye}
            />
            <InputField
              label="Clics"
              value={inputs.traffic.clics}
              onChange={(v) => updateInput("traffic", "clics", v)}
              icon={MousePointerClick}
            />
            <InputField
              label="Visitas Landing"
              value={inputs.traffic.visitasLanding}
              onChange={(v) => updateInput("traffic", "visitasLanding", v)}
              icon={Users}
            />
            <InputField
              label="Leads"
              value={inputs.traffic.leads}
              onChange={(v) => updateInput("traffic", "leads", v)}
              icon={Users}
            />
          </div>
        </GlassCard>

        {/* VSL */}
        <GlassCard>
          <SectionHeader
            icon={Video}
            title="VSL / Video"
            color="bg-blue-500/20 text-blue-400"
          />
          <div className="space-y-3">
            <InputField
              label="Reproducciones VSL"
              value={inputs.vsl.reproduccionesVSL}
              onChange={(v) => updateInput("vsl", "reproduccionesVSL", v)}
              icon={Video}
            />
            <InputField
              label="% Promedio Retencion"
              value={Math.round(inputs.vsl.promedioRetencion * 100)}
              onChange={(v) => updateInput("vsl", "promedioRetencion", v / 100)}
              suffix="%"
            />
            <InputField
              label="Survey / Clics Agendar"
              value={inputs.vsl.clicsAgendar}
              onChange={(v) => updateInput("vsl", "clicsAgendar", v)}
              icon={MousePointerClick}
            />
          </div>
        </GlassCard>

        {/* VENTAS */}
        <GlassCard>
          <SectionHeader
            icon={Phone}
            title="Ventas"
            color="bg-amber-500/20 text-amber-400"
          />
          <div className="space-y-3">
            <InputField
              label="Agendas"
              value={inputs.sales.agendas}
              onChange={(v) => updateInput("sales", "agendas", v)}
              icon={Calendar}
            />
            <InputField
              label="Agendas Calificadas"
              value={inputs.sales.agendasCalificadas}
              onChange={(v) => updateInput("sales", "agendasCalificadas", v)}
            />
            <InputField
              label="Asistencias"
              value={inputs.sales.asistencias}
              onChange={(v) => updateInput("sales", "asistencias", v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Ventas Principal"
                value={inputs.sales.ventasPrincipal}
                onChange={(v) => updateInput("sales", "ventasPrincipal", v)}
              />
              <InputField
                label="Ventas Downsell"
                value={inputs.sales.ventasDownsell}
                onChange={(v) => updateInput("sales", "ventasDownsell", v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Precio Principal"
                value={inputs.sales.precioPrincipal}
                onChange={(v) => updateInput("sales", "precioPrincipal", v)}
                prefix="$"
              />
              <InputField
                label="Precio Downsell"
                value={inputs.sales.precioDownsell}
                onChange={(v) => updateInput("sales", "precioDownsell", v)}
                prefix="$"
              />
            </div>
            <InputField
              label="Cash Recibido"
              value={inputs.sales.cashRecibido}
              onChange={(v) => updateInput("sales", "cashRecibido", v)}
              prefix="$"
              icon={DollarSign}
            />
          </div>
        </GlassCard>

        {/* FINANZAS */}
        <GlassCard>
          <SectionHeader
            icon={TrendingUp}
            title="Finanzas"
            color="bg-emerald-500/20 text-emerald-400"
          />
          <div className="space-y-3">
            <InputField
              label="Costos Fijos"
              value={inputs.finance.costosFijos}
              onChange={(v) => updateInput("finance", "costosFijos", v)}
              prefix="$"
            />
            <InputField
              label="Costos Variables"
              value={inputs.finance.costosVariables}
              onChange={(v) => updateInput("finance", "costosVariables", v)}
              prefix="$"
            />
            <InputField
              label="CoGS por Venta"
              value={inputs.finance.cogs}
              onChange={(v) => updateInput("finance", "cogs", v)}
              prefix="$"
            />
            <InputField
              label="Balance Banco"
              value={inputs.finance.balance}
              onChange={(v) => updateInput("finance", "balance", v)}
              prefix="$"
            />
            <InputField
              label="Deudas"
              value={inputs.finance.deudas}
              onChange={(v) => updateInput("finance", "deudas", v)}
              prefix="$"
            />
            <InputField
              label="Por Cobrar"
              value={inputs.finance.porCobrar}
              onChange={(v) => updateInput("finance", "porCobrar", v)}
              prefix="$"
            />
          </div>
        </GlassCard>

        {/* SERVICIO */}
        <GlassCard>
          <SectionHeader
            icon={Star}
            title="Servicio"
            color="bg-pink-500/20 text-pink-400"
          />
          <div className="space-y-3">
            <InputField
              label="Clientes Activos"
              value={inputs.service.clientesActivos}
              onChange={(v) => updateInput("service", "clientesActivos", v)}
            />
            <InputField
              label="Referidos"
              value={inputs.service.referidos}
              onChange={(v) => updateInput("service", "referidos", v)}
            />
            <InputField
              label="Upsells"
              value={inputs.service.upsells}
              onChange={(v) => updateInput("service", "upsells", v)}
            />
            <InputField
              label="Reembolsos"
              value={inputs.service.reembolsos}
              onChange={(v) => updateInput("service", "reembolsos", v)}
            />
            <InputField
              label="NPS Score"
              value={inputs.service.nps}
              onChange={(v) => updateInput("service", "nps", v)}
            />
          </div>
        </GlassCard>

        {/* METAS */}
        <GlassCard>
          <SectionHeader
            icon={Crosshair}
            title="Metas"
            color="bg-cyan-500/20 text-cyan-400"
          />
          <div className="space-y-3">
            <InputField
              label="Meta Facturacion"
              value={inputs.goals.metaFacturacion}
              onChange={(v) => updateInput("goals", "metaFacturacion", v)}
              prefix="$"
            />
            <InputField
              label="Meta Cash"
              value={inputs.goals.metaCash}
              onChange={(v) => updateInput("goals", "metaCash", v)}
              prefix="$"
            />
            <InputField
              label="Meta CTR"
              value={Math.round(inputs.goals.metaCTR * 100)}
              onChange={(v) => updateInput("goals", "metaCTR", v / 100)}
              suffix="%"
            />
            <InputField
              label="Meta CR Landing"
              value={Math.round(inputs.goals.metaCRLanding * 100)}
              onChange={(v) => updateInput("goals", "metaCRLanding", v / 100)}
              suffix="%"
            />
            <InputField
              label="Meta Tasa Reproduccion"
              value={Math.round(inputs.goals.metaTasaRep * 100)}
              onChange={(v) => updateInput("goals", "metaTasaRep", v / 100)}
              suffix="%"
            />
            <InputField
              label="Meta % Agenda"
              value={Math.round(inputs.goals.metaPorcentajeAgenda * 100)}
              onChange={(v) =>
                updateInput("goals", "metaPorcentajeAgenda", v / 100)
              }
              suffix="%"
            />
            <InputField
              label="Meta % Asistencia"
              value={Math.round(inputs.goals.metaPorcentajeAsistencia * 100)}
              onChange={(v) =>
                updateInput("goals", "metaPorcentajeAsistencia", v / 100)
              }
              suffix="%"
            />
            <InputField
              label="Meta % Cierre"
              value={Math.round(inputs.goals.metaPorcentajeCierre * 100)}
              onChange={(v) =>
                updateInput("goals", "metaPorcentajeCierre", v / 100)
              }
              suffix="%"
            />
            <InputField
              label="Meta ROI"
              value={inputs.goals.metaROI}
              onChange={(v) => updateInput("goals", "metaROI", v)}
              suffix="x"
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
