import type { AllInputs } from "./types";

export const SAMPLE_INPUTS: AllInputs = {
  traffic: {
    inversionPublicitaria: 3209,
    impresiones: 514376,
    clics: 5628,
    visitasLanding: 3410,
    leads: 154,
  },
  vsl: {
    reproduccionesVSL: 948,
    promedioRetencion: 0.49,
    clicsAgendar: 154,
  },
  sales: {
    agendas: 81,
    agendasCalificadas: 71,
    asistencias: 41,
    ventasPrincipal: 18,
    ventasDownsell: 10,
    precioPrincipal: 3250,
    precioDownsell: 0,
    cashRecibido: 29938,
    seguimientos: 0,
  },
  finance: {
    costosFijos: 0,
    costosVariables: 0,
    cogs: 0,
    balance: 0,
    deudas: 0,
    porCobrar: 0,
  },
  service: {
    clientesActivos: 0,
    referidos: 0,
    upsells: 0,
    reembolsos: 0,
    nps: 0,
  },
  goals: {
    metaFacturacion: 80000,
    metaCash: 40000,
    metaCTR: 0.02,
    metaCRLanding: 0.1,
    metaTasaRep: 0.8,
    metaPorcentajeAgenda: 0.6,
    metaPorcentajeAsistencia: 0.7,
    metaPorcentajeCierre: 0.5,
    metaROI: 2.0,
  },
};

export const EMPTY_INPUTS: AllInputs = {
  traffic: {
    inversionPublicitaria: 0,
    impresiones: 0,
    clics: 0,
    visitasLanding: 0,
    leads: 0,
  },
  vsl: {
    reproduccionesVSL: 0,
    promedioRetencion: 0,
    clicsAgendar: 0,
  },
  sales: {
    agendas: 0,
    agendasCalificadas: 0,
    asistencias: 0,
    ventasPrincipal: 0,
    ventasDownsell: 0,
    precioPrincipal: 0,
    precioDownsell: 0,
    cashRecibido: 0,
    seguimientos: 0,
  },
  finance: {
    costosFijos: 0,
    costosVariables: 0,
    cogs: 0,
    balance: 0,
    deudas: 0,
    porCobrar: 0,
  },
  service: {
    clientesActivos: 0,
    referidos: 0,
    upsells: 0,
    reembolsos: 0,
    nps: 0,
  },
  goals: {
    metaFacturacion: 80000,
    metaCash: 40000,
    metaCTR: 0.02,
    metaCRLanding: 0.1,
    metaTasaRep: 0.8,
    metaPorcentajeAgenda: 0.6,
    metaPorcentajeAsistencia: 0.7,
    metaPorcentajeCierre: 0.5,
    metaROI: 2.0,
  },
};

export const CATEGORY_LABELS: Record<string, string> = {
  marketing: "Marketing",
  sistema: "Sistema",
  ventas: "Ventas",
};

export const CATEGORY_COLORS: Record<string, string> = {
  marketing: "#8b5cf6",
  sistema: "#3b82f6",
  ventas: "#f59e0b",
};
