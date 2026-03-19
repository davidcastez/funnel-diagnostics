"use client";

import { useMemo } from "react";
import { useFunnelStore } from "@/stores/funnel-store";
import type { AllCalculations, DashboardResults } from "@/lib/types";
import {
  calculateFunnelStages,
  calculateMarketingKPIs,
  calculateSalesKPIs,
  calculateFinanceKPIs,
  calculateServiceKPIs,
  calculateBottlenecks,
} from "@/lib/calculations";

export function useCalculations(): AllCalculations {
  const inputs = useFunnelStore((s) => s.inputs);

  return useMemo(() => {
    const { traffic, sales, goals } = inputs;
    const totalVentas = sales.ventasPrincipal + sales.ventasDownsell;
    const facturacion =
      sales.ventasPrincipal * sales.precioPrincipal +
      sales.ventasDownsell * sales.precioDownsell;

    const dashboard: DashboardResults = {
      facturacion,
      cash: sales.cashRecibido,
      roi: traffic.inversionPublicitaria > 0
        ? facturacion / traffic.inversionPublicitaria
        : 0,
      pca: sales.cashRecibido - traffic.inversionPublicitaria,
      fcr: inputs.traffic.leads > 0 ? totalVentas / inputs.traffic.leads : 0,
    };

    const funnelStages = calculateFunnelStages(inputs);
    const marketing = calculateMarketingKPIs(inputs, facturacion);
    const salesKPIs = calculateSalesKPIs(inputs, facturacion);
    const finance = calculateFinanceKPIs(inputs, facturacion);
    const service = calculateServiceKPIs(inputs, facturacion);
    const bottlenecks = calculateBottlenecks(inputs, funnelStages, facturacion);
    const primaryBottleneck = bottlenecks.length > 0 ? bottlenecks[0] : null;

    return {
      dashboard,
      funnelStages,
      marketing,
      sales: salesKPIs,
      finance,
      service,
      bottlenecks,
      primaryBottleneck,
    };
  }, [inputs]);
}
