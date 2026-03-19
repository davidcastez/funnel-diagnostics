export interface TrafficInputs {
  inversionPublicitaria: number;
  impresiones: number;
  clics: number;
  visitasLanding: number;
  leads: number;
}

export interface VSLInputs {
  reproduccionesVSL: number;
  promedioRetencion: number;
  clicsAgendar: number;
}

export interface SalesInputs {
  agendas: number;
  agendasCalificadas: number;
  asistencias: number;
  ventasPrincipal: number;
  ventasDownsell: number;
  precioPrincipal: number;
  precioDownsell: number;
  cashRecibido: number;
  seguimientos: number;
}

export interface FinanceInputs {
  costosFijos: number;
  costosVariables: number;
  cogs: number;
  balance: number;
  deudas: number;
  porCobrar: number;
}

export interface ServiceInputs {
  clientesActivos: number;
  referidos: number;
  upsells: number;
  reembolsos: number;
  nps: number;
}

export interface GoalInputs {
  metaFacturacion: number;
  metaCash: number;
  metaCTR: number;
  metaCRLanding: number;
  metaTasaRep: number;
  metaPorcentajeAgenda: number;
  metaPorcentajeAsistencia: number;
  metaPorcentajeCierre: number;
  metaROI: number;
}

export interface AllInputs {
  traffic: TrafficInputs;
  vsl: VSLInputs;
  sales: SalesInputs;
  finance: FinanceInputs;
  service: ServiceInputs;
  goals: GoalInputs;
}

export type SemaforoStatus = "green" | "yellow" | "red" | "neutral";

export interface FunnelStageMetric {
  id: string;
  label: string;
  value: number;
  rawValue: number;
  meta: number;
  percentOfMeta: number;
  semaforo: SemaforoStatus;
  action: string;
  category: "marketing" | "sistema" | "ventas";
  impactWeight: number;
}

export interface DashboardResults {
  facturacion: number;
  cash: number;
  roi: number;
  pca: number;
  fcr: number;
}

export interface MarketingKPIs {
  cpm: number;
  ctr: number;
  cpc: number;
  porcentajeLlegada: number;
  crLanding: number;
  cpl: number;
  tasaReproduccion: number;
  promedioRetencion: number;
  porcentajeLeadAgendas: number;
  epc: number;
  epl: number;
}

export interface SalesKPIs {
  porcentajeAgenda: number;
  cpb: number;
  porcentajeCalificadas: number;
  cpqb: number;
  porcentajeAsistencia: number;
  noAsiste: number;
  cpAsistencia: number;
  ventasTotales: number;
  scrPrincipal: number;
  dwcr: number;
  scrTotal: number;
  bts: number;
  cac: number;
  epb: number;
  epAsistencia: number;
  margenPorVenta: number;
}

export interface FinanceKPIs {
  cogsTotal: number;
  grossProfit: number;
  operatingCosts: number;
  netProfit: number;
  profitMargin: number;
  margenPorVenta: number;
  mtrr: number;
  netCash: number;
  coreCapital: number;
  netWorth: number;
}

export interface ServiceKPIs {
  referralRate: number;
  upsellRate: number;
  reembolsoRate: number;
  nps: number;
  ltv: number;
  ltw: number;
  ltvCacRatio: number;
}

export interface BottleneckResult {
  metricId: string;
  label: string;
  category: "marketing" | "sistema" | "ventas";
  currentValue: number;
  metaValue: number;
  percentOfMeta: number;
  semaforo: SemaforoStatus;
  impactScore: number;
  revenueImpact: number;
  priorityRank: number;
  actionRecommendation: string;
}

export interface AllCalculations {
  dashboard: DashboardResults;
  funnelStages: FunnelStageMetric[];
  marketing: MarketingKPIs;
  sales: SalesKPIs;
  finance: FinanceKPIs;
  service: ServiceKPIs;
  bottlenecks: BottleneckResult[];
  primaryBottleneck: BottleneckResult | null;
}
