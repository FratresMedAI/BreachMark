"use client";

import { useEffect, useState } from "react";
import { PanelRight } from "lucide-react";
import { toast } from "sonner";
import { AttackTimeline } from "@/components/game/AttackTimeline";
import { ControlShop } from "@/components/game/ControlShop";
import { MetricsHUD } from "@/components/game/MetricsHUD";
import { NetworkGraph } from "@/components/game/NetworkGraph";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useKeyboardControls } from "@/hooks/use-keyboard-controls";
import { useSimulationStore } from "@/store/simulation-store";

function SidePanel() {
  return (
    <>
      <MetricsHUD />
      <ControlShop />
    </>
  );
}

export function GamePlay() {
  const scenario = useSimulationStore((s) => s.scenario);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const tick = useSimulationStore((s) => s.tick);
  const lastToast = useSimulationStore((s) => s.lastToast);
  const clearToast = useSimulationStore((s) => s.clearToast);
  const [sheetOpen, setSheetOpen] = useState(false);

  useKeyboardControls();

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
      <div className="bm-panel relative overflow-hidden rounded-2xl px-4 py-3">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(0,240,255,0.07),transparent_45%,rgba(217,70,239,0.05))]" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="bm-tactical-label text-primary/90">Active scenario</p>
            <p className="font-sans text-xl font-bold tracking-tight text-foreground">
              {scenario.title}
            </p>
            <p className="font-mono text-xs text-muted-foreground">{scenario.subtitle}</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded border border-primary/35 bg-primary/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
              Live
            </span>
            <span className="rounded border border-white/10 bg-background/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Sim
            </span>
          </div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1fr_300px]">
        <div className="flex min-h-0 flex-col gap-4">
          <div className="min-h-[280px] flex-1 sm:min-h-[300px]">
            <NetworkGraph />
          </div>
          <AttackTimeline />
        </div>

        <aside className="hidden flex-col gap-4 overflow-y-auto xl:flex">
          <SidePanel />
        </aside>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className="bm-glow-cyan fixed bottom-20 right-4 z-30 xl:hidden"
            size="lg"
          >
            <PanelRight className="mr-2 h-4 w-4" />
            Controls
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="overflow-y-auto p-0">
          <SheetHeader>
            <SheetTitle className="font-mono text-primary">
              Response panel
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 p-4 pt-0">
            <SidePanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
