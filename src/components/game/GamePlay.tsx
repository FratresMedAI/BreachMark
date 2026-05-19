"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AttackTimeline } from "@/components/game/AttackTimeline";
import { ControlShop } from "@/components/game/ControlShop";
import { MetricsHUD } from "@/components/game/MetricsHUD";
import { NetworkGraph } from "@/components/game/NetworkGraph";
import { useSimulationStore } from "@/store/simulation-store";

export function GamePlay() {
  const scenario = useSimulationStore((s) => s.scenario);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const tick = useSimulationStore((s) => s.tick);
  const lastToast = useSimulationStore((s) => s.lastToast);
  const clearToast = useSimulationStore((s) => s.clearToast);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => tick(1), 1000);
    return () => window.clearInterval(id);
  }, [isPlaying, tick]);

  useEffect(() => {
    if (lastToast) {
      toast.message(lastToast);
      clearToast();
    }
  }, [lastToast, clearToast]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-100">{scenario.title}</h2>
          <p className="text-sm text-slate-400">{scenario.subtitle}</p>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="flex min-h-0 flex-col gap-4">
          <div className="min-h-[280px] flex-1">
            <NetworkGraph />
          </div>
          <AttackTimeline />
        </div>
        <aside className="flex flex-col gap-4 overflow-y-auto">
          <MetricsHUD />
          <ControlShop />
        </aside>
      </div>
    </div>
  );
}
