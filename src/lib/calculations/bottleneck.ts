import type { AllInputs, FunnelStageMetric, BottleneckResult, SemaforoStatus } from "../types";

export function calculateBottlenecks(
  inputs: AllInputs,
  funnelStages: FunnelStageMetric[],
  currentRevenue: number
): BottleneckResult[] {
  const results: BottleneckResult[] = funnelStages
    .filter((stage) => stage.semaforo !== "green" && stage.semaforo !== "neutral")
    .map((stage) => {
      const gap = Math.max(0, 1 - stage.percentOfMeta);
      const revenueImpact = simulateRevenueWithMetricAtMeta(inputs, stage.id, currentRevenue);
      const revenueGain = revenueImpact - currentRevenue;
      const impactScore =
        gap * stage.impactWeight * (1 + revenueGain / Math.max(currentRevenue, 1));

      return {
        metricId: stage.id,
        label: stage.label,
        category: stage.category,
        currentValue: stage.value,
        metaValue: stage.meta,
        percentOfMeta: stage.percentOfMeta,
        semaforo: stage.semaforo,
        impactScore,
        revenueImpact: revenueGain,
        priorityRank: 0,
        actionRecommendation: getActionForMetric(stage.id, stage.semaforo),
      };
    })
    .sort((a, b) => b.impactScore - a.impactScore)
    .map((result, index) => ({
      ...result,
      priorityRank: index + 1,
    }));

  return results;
}

function simulateRevenueWithMetricAtMeta(
  inputs: AllInputs,
  metricId: string,
  currentRevenue: number
): number {
  const { traffic, vsl, sales, goals } = inputs;
  let simVPP = sales.ventasPrincipal;
  let simVDS = sales.ventasDownsell;

  switch (metricId) {
    case "ctr": {
      const currentCTR = traffic.impresiones > 0 ? traffic.clics / traffic.impresiones : 0;
      if (currentCTR === 0) return currentRevenue;
      const ratio = goals.metaCTR / currentCTR;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    case "llegada": {
      const current = traffic.clics > 0 ? traffic.visitasLanding / traffic.clics : 0;
      if (current === 0) return currentRevenue;
      const ratio = 0.95 / current;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    case "cr_landing": {
      const current = traffic.visitasLanding > 0 ? traffic.leads / traffic.visitasLanding : 0;
      if (current === 0) return currentRevenue;
      const ratio = goals.metaCRLanding / current;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    case "tasa_reproduccion": {
      const current = traffic.visitasLanding > 0 ? vsl.reproduccionesVSL / traffic.visitasLanding : 0;
      if (current === 0) return currentRevenue;
      const ratio = goals.metaTasaRep / current;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    case "lead_to_cita": {
      const current = traffic.leads > 0 ? vsl.clicsAgendar / traffic.leads : 0;
      if (current === 0) return currentRevenue;
      const ratio = 0.15 / current;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    case "porcentaje_agenda": {
      const current = vsl.clicsAgendar > 0 ? sales.agendas / vsl.clicsAgendar : 0;
      if (current === 0) return currentRevenue;
      const ratio = goals.metaPorcentajeAgenda / current;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    case "porcentaje_asistencia": {
      const current = sales.agendasCalificadas > 0 ? sales.asistencias / sales.agendasCalificadas : 0;
      if (current === 0) return currentRevenue;
      const ratio = goals.metaPorcentajeAsistencia / current;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    case "porcentaje_cierre": {
      const totalVentas = sales.ventasPrincipal + sales.ventasDownsell;
      const current = sales.asistencias > 0 ? totalVentas / sales.asistencias : 0;
      if (current === 0) return currentRevenue;
      const ratio = goals.metaPorcentajeCierre / current;
      simVPP *= ratio;
      simVDS *= ratio;
      break;
    }
    default:
      return currentRevenue;
  }

  return simVPP * sales.precioPrincipal + simVDS * sales.precioDownsell;
}

export function getActionForMetric(metricId: string, severity: SemaforoStatus): string {
  const actions: Record<string, Record<string, string>> = {
    ctr: {
      red: "URGENTE: Cambiar angulo del mensaje, probar video vs imagen, revisar segmentacion. Tu CTR esta muy por debajo del objetivo.",
      yellow: "Testear 3 nuevos hooks y creativos esta semana. Probar variaciones de copy y formatos.",
      green: "CTR saludable. Mantener monitoreo.",
    },
    llegada: {
      red: "URGENTE: Verificar redirects, optimizar imagenes, revisar tracking pixels. Muchos clics no llegan a la landing.",
      yellow: "Revisar velocidad de carga con GTmetrix. Optimizar imagenes y scripts.",
      green: "Buen ratio de llegada.",
    },
    cr_landing: {
      red: "URGENTE: Redisenar above the fold, agregar prueba social, simplificar formulario. La landing no convierte.",
      yellow: "A/B test de headline y CTA esta semana. Probar diferentes propuestas de valor.",
      green: "CR Landing en buen nivel.",
    },
    tasa_reproduccion: {
      red: "URGENTE: Mover video arriba del fold, mejorar hook primeros 3 segundos. Las visitas no ven el VSL.",
      yellow: "Probar nuevo thumbnail y activar autoplay. Mejorar presentacion del video.",
      green: "Buena tasa de reproduccion.",
    },
    lead_to_cita: {
      red: "URGENTE: Revisar propuesta de valor, agregar bonus por agendar hoy. Los leads no avanzan a cita.",
      yellow: "Reforzar escasez y urgencia en CTA. Agregar incentivos para agendar.",
      green: "Buen ratio lead a cita.",
    },
    porcentaje_agenda: {
      red: "URGENTE: Simplificar a nombre+email+telefono, agregar mas horarios. El proceso de agenda tiene mucha friccion.",
      yellow: "Reducir campos del formulario a maximo 4. Simplificar el proceso.",
      green: "Buen ratio de agendamiento.",
    },
    porcentaje_asistencia: {
      red: "URGENTE: Implementar secuencia email+SMS+WhatsApp, enviar video pre-llamada. Demasiados no-shows.",
      yellow: "Agregar recordatorio SMS 1 hora antes. Mejorar seguimiento pre-sesion.",
      green: "Buena tasa de asistencia.",
    },
    porcentaje_cierre: {
      red: "URGENTE: Revisar script completo, agregar garantia, crear urgencia real. El cierre de ventas necesita mejoras criticas.",
      yellow: "Practicar manejo de 3 objeciones principales. Mejorar storytelling y presentacion.",
      green: "Excelente tasa de cierre.",
    },
  };

  return actions[metricId]?.[severity] ?? "Revisar esta metrica.";
}
