import type { AllInputs, MarketingKPIs } from "../types";
import { safeDivide } from "../utils";

export function calculateMarketingKPIs(
  inputs: AllInputs,
  facturacion: number
): MarketingKPIs {
  const { traffic, vsl, sales } = inputs;

  return {
    cpm: safeDivide(traffic.inversionPublicitaria, traffic.impresiones) * 1000,
    ctr: safeDivide(traffic.clics, traffic.impresiones),
    cpc: safeDivide(traffic.inversionPublicitaria, traffic.clics),
    porcentajeLlegada: safeDivide(traffic.visitasLanding, traffic.clics),
    crLanding: safeDivide(traffic.leads, traffic.visitasLanding),
    cpl: safeDivide(traffic.inversionPublicitaria, traffic.leads),
    tasaReproduccion: safeDivide(vsl.reproduccionesVSL, traffic.visitasLanding),
    promedioRetencion: vsl.promedioRetencion,
    porcentajeLeadAgendas: safeDivide(sales.agendas, traffic.leads),
    epc: safeDivide(facturacion, traffic.clics),
    epl: safeDivide(facturacion, traffic.leads),
  };
}
