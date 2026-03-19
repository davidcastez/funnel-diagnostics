import type { AllInputs, FunnelStageMetric } from "../types";
import { safeDivide } from "../utils";
import { getSemaforo } from "../semaforo";
import { getActionForMetric } from "./bottleneck";

export function calculateFunnelStages(inputs: AllInputs): FunnelStageMetric[] {
  const { traffic, vsl, sales, goals } = inputs;
  const totalVentas = sales.ventasPrincipal + sales.ventasDownsell;

  const stages: Omit<FunnelStageMetric, "percentOfMeta" | "semaforo" | "action">[] = [
    {
      id: "ctr",
      label: "CTR",
      value: safeDivide(traffic.clics, traffic.impresiones),
      rawValue: traffic.clics,
      meta: goals.metaCTR,
      category: "marketing",
      impactWeight: 5,
    },
    {
      id: "llegada",
      label: "% Llegada",
      value: safeDivide(traffic.visitasLanding, traffic.clics),
      rawValue: traffic.visitasLanding,
      meta: 0.95,
      category: "marketing",
      impactWeight: 3,
    },
    {
      id: "cr_landing",
      label: "CR Landing",
      value: safeDivide(traffic.leads, traffic.visitasLanding),
      rawValue: traffic.leads,
      meta: goals.metaCRLanding,
      category: "marketing",
      impactWeight: 8,
    },
    {
      id: "tasa_reproduccion",
      label: "Tasa Reproduccion",
      value: safeDivide(vsl.reproduccionesVSL, traffic.visitasLanding),
      rawValue: vsl.reproduccionesVSL,
      meta: goals.metaTasaRep,
      category: "sistema",
      impactWeight: 6,
    },
    {
      id: "lead_to_cita",
      label: "% Lead a Cita",
      value: safeDivide(vsl.clicsAgendar, traffic.leads),
      rawValue: vsl.clicsAgendar,
      meta: 0.15,
      category: "sistema",
      impactWeight: 4,
    },
    {
      id: "porcentaje_agenda",
      label: "% Agenda",
      value: safeDivide(sales.agendas, vsl.clicsAgendar),
      rawValue: sales.agendas,
      meta: goals.metaPorcentajeAgenda,
      category: "sistema",
      impactWeight: 5,
    },
    {
      id: "porcentaje_asistencia",
      label: "% Asistencia",
      value: safeDivide(sales.asistencias, sales.agendasCalificadas),
      rawValue: sales.asistencias,
      meta: goals.metaPorcentajeAsistencia,
      category: "ventas",
      impactWeight: 7,
    },
    {
      id: "porcentaje_cierre",
      label: "% Cierre",
      value: safeDivide(totalVentas, sales.asistencias),
      rawValue: totalVentas,
      meta: goals.metaPorcentajeCierre,
      category: "ventas",
      impactWeight: 10,
    },
  ];

  return stages.map((stage) => {
    const percentOfMeta = stage.meta === 0 ? 0 : safeDivide(stage.value, stage.meta);
    const semaforo = getSemaforo(percentOfMeta);
    return {
      ...stage,
      percentOfMeta,
      semaforo,
      action: getActionForMetric(stage.id, semaforo),
    };
  });
}

export function calculateDashboardCascade(inputs: AllInputs) {
  const { traffic, sales } = inputs;
  const totalVentas = sales.ventasPrincipal + sales.ventasDownsell;
  const facturacion =
    sales.ventasPrincipal * sales.precioPrincipal +
    sales.ventasDownsell * sales.precioDownsell;

  return {
    stages: [
      { label: "Inversion", value: traffic.inversionPublicitaria, type: "currency" as const },
      { label: "Impresiones", value: traffic.impresiones, type: "number" as const },
      { label: "Clics", value: traffic.clics, type: "number" as const },
      { label: "Visitas", value: traffic.visitasLanding, type: "number" as const },
      { label: "Leads", value: traffic.leads, type: "number" as const },
      { label: "Reproducciones", value: inputs.vsl.reproduccionesVSL, type: "number" as const },
      { label: "Agendas", value: sales.agendas, type: "number" as const },
      { label: "Asistencias", value: sales.asistencias, type: "number" as const },
      { label: "Ventas", value: totalVentas, type: "number" as const },
      { label: "Facturacion", value: facturacion, type: "currency" as const },
    ],
  };
}
