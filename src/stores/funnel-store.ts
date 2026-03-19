import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AllInputs } from "@/lib/types";
import { SAMPLE_INPUTS, EMPTY_INPUTS } from "@/lib/constants";

export type ActiveTab =
  | "bottleneck"
  | "inputs"
  | "dashboard"
  | "funnel"
  | "marketing"
  | "ventas"
  | "finanzas"
  | "servicio";

interface FunnelStore {
  inputs: AllInputs;
  activeTab: ActiveTab;
  updateInput: <
    K extends keyof AllInputs,
    F extends keyof AllInputs[K]
  >(
    section: K,
    field: F,
    value: number
  ) => void;
  setActiveTab: (tab: ActiveTab) => void;
  loadSampleData: () => void;
  resetInputs: () => void;
}

export const useFunnelStore = create<FunnelStore>()(
  persist(
    (set) => ({
      inputs: SAMPLE_INPUTS,
      activeTab: "bottleneck",
      updateInput: (section, field, value) =>
        set((state) => ({
          inputs: {
            ...state.inputs,
            [section]: {
              ...state.inputs[section],
              [field]: value,
            },
          },
        })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      loadSampleData: () => set({ inputs: SAMPLE_INPUTS }),
      resetInputs: () => set({ inputs: EMPTY_INPUTS }),
    }),
    {
      name: "funnel-diagnostics-v1",
      version: 1,
    }
  )
);
