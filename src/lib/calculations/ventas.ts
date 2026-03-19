import type { AllInputs, SalesKPIs } from "../types";
import { safeDivide } from "../utils";

export function calculateSalesKPIs(
  inputs: AllInputs,
  facturacion: number
): SalesKPIs {
  const { traffic, vsl, sales } = inputs;
  const totalVentas = sales.ventasPrincipal + sales.ventasDownsell;

  return {
    porcentajeAgenda: safeDivide(sales.agendas, vsl.clicsAgendar),
    cpb: safeDivide(traffic.inversionPublicitaria, sales.agendas),
    porcentajeCalificadas: safeDivide(sales.agendasCalificadas, sales.agendas),
    cpqb: safeDivide(traffic.inversionPublicitaria, sales.agendasCalificadas),
    porcentajeAsistencia: safeDivide(sales.asistencias, sales.agendasCalificadas),
    noAsiste: sales.agendasCalificadas - sales.asistencias,
    cpAsistencia: safeDivide(traffic.inversionPublicitaria, sales.asistencias),
    ventasTotales: totalVentas,
    scrPrincipal: safeDivide(sales.ventasPrincipal, sales.asistencias),
    dwcr: safeDivide(sales.ventasDownsell, sales.asistencias),
    scrTotal: safeDivide(totalVentas, sales.asistencias),
    bts: safeDivide(totalVentas, sales.agendas),
    cac: safeDivide(traffic.inversionPublicitaria, totalVentas),
    epb: safeDivide(facturacion, sales.agendas),
    epAsistencia: safeDivide(facturacion, sales.asistencias),
    margenPorVenta: totalVentas > 0
      ? safeDivide(sales.cashRecibido, totalVentas) - inputs.finance.cogs
      : 0,
  };
}
