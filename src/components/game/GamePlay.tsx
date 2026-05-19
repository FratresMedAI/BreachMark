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
    <div className="mx-auto flex h-[calc(100vh-5.5rem)] max-w-[1600px] flex-col gap-4 px-4 pb-4 pt-2">
      <div className="bm-panel rounded-2xl px-4 py-3">
        <p className="font-display text-xl font-semibold text-foreground">
          {scenario.title}
        </p>
        <p className="text-sm text-muted-foreground">{scenario.subtitle}</p>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1fr_300px]">
        <div className="flex min-h-0 flex-col gap-4">
          <div className="min-h-[300px] flex-1">
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
