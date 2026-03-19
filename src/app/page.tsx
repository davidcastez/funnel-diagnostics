"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFunnelStore, type ActiveTab } from "@/stores/funnel-store";
import { InputForm } from "@/components/input-form/input-form";
import { BottleneckHero } from "@/components/bottleneck/bottleneck-hero";
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard";
import { FunnelVisualization } from "@/components/funnel/funnel-visualization";
import { MarketingDeepDive } from "@/components/marketing/marketing-deep-dive";
import { SalesDeepDive } from "@/components/ventas/sales-deep-dive";
import { FinanceOverview } from "@/components/finanzas/finance-overview";
import { ServiceOverview } from "@/components/servicio/service-overview";
import {
  Zap,
  ClipboardList,
  BarChart3,
  GitBranch,
  Megaphone,
  Handshake,
  Wallet,
  Star,
} from "lucide-react";

const tabs: { id: ActiveTab; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "bottleneck", label: "Diagnostico", shortLabel: "Diag.", icon: Zap },
  { id: "inputs", label: "Datos", shortLabel: "Datos", icon: ClipboardList },
  { id: "dashboard", label: "Dashboard", shortLabel: "Dash.", icon: BarChart3 },
  { id: "funnel", label: "Embudo", shortLabel: "Emb.", icon: GitBranch },
  { id: "marketing", label: "Marketing", shortLabel: "Mkt.", icon: Megaphone },
  { id: "ventas", label: "Ventas", shortLabel: "Vtas.", icon: Handshake },
  { id: "finanzas", label: "Finanzas", shortLabel: "Fin.", icon: Wallet },
  { id: "servicio", label: "Servicio", shortLabel: "Serv.", icon: Star },
];

const tabContent: Record<ActiveTab, React.ComponentType> = {
  bottleneck: BottleneckHero,
  inputs: InputForm,
  dashboard: ExecutiveDashboard,
  funnel: FunnelVisualization,
  marketing: MarketingDeepDive,
  ventas: SalesDeepDive,
  finanzas: FinanceOverview,
  servicio: ServiceOverview,
};

export default function Home() {
  const { activeTab, setActiveTab } = useFunnelStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const ActiveComponent = tabContent[activeTab];

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold tracking-tight">
                  Funnel <span className="gradient-text">Diagnostics</span>
                </h1>
              </div>
            </div>

            {/* Desktop tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "text-primary-foreground bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-primary/15 border border-primary/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_6px_rgba(139,92,246,0.5)]" : ""}`} />
                <span className="text-[9px] font-medium">{tab.shortLabel}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute bottom-0.5 w-8 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
