import type { AllInputs, FinanceKPIs } from "../types";
import { safeDivide } from "../utils";

export function calculateFinanceKPIs(
  inputs: AllInputs,
  facturacion: number
): FinanceKPIs {
  const { traffic, sales, finance } = inputs;
  const totalVentas = sales.ventasPrincipal + sales.ventasDownsell;

  const cogsTotal = finance.cogs * totalVentas;
  const grossProfit = sales.cashRecibido - cogsTotal;
  const operatingCosts =
    finance.costosFijos + finance.costosVariables + traffic.inversionPublicitaria;
  const netProfit = grossProfit - operatingCosts;
  const profitMargin = safeDivide(netProfit, sales.cashRecibido);
  const margenPorVenta =
    totalVentas > 0
      ? safeDivide(sales.cashRecibido, totalVentas) - finance.cogs
      : 0;
  const mtrr = safeDivide(facturacion, traffic.inversionPublicitaria);
  const netCash = finance.balance - finance.deudas;
  const coreCapital = safeDivide(finance.balance, finance.costosFijos);
  const netWorth = netCash + finance.porCobrar;

  return {
    cogsTotal,
    grossProfit,
    operatingCosts,
    netProfit,
    profitMargin,
    margenPorVenta,
    mtrr,
    netCash,
    coreCapital,
    netWorth,
  };
}
