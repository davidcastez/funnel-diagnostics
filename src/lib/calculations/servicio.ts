import type { AllInputs, ServiceKPIs } from "../types";
import { safeDivide } from "../utils";

export function calculateServiceKPIs(
  inputs: AllInputs,
  facturacion: number
): ServiceKPIs {
  const { traffic, sales, service } = inputs;
  const totalVentas = sales.ventasPrincipal + sales.ventasDownsell;
  const cac = safeDivide(traffic.inversionPublicitaria, totalVentas);

  const referralRate = safeDivide(service.referidos, service.clientesActivos);
  const upsellRate = safeDivide(service.upsells, service.clientesActivos);
  const reembolsoRate = safeDivide(service.reembolsos, totalVentas);
  const ltv = safeDivide(facturacion, service.clientesActivos);
  const ltw = ltv * (1 + referralRate);
  const ltvCacRatio = safeDivide(ltv, cac);

  return {
    referralRate,
    upsellRate,
    reembolsoRate,
    nps: service.nps,
    ltv,
    ltw,
    ltvCacRatio,
  };
}
