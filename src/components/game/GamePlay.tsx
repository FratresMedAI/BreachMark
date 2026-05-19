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
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-5 px-3 pb-8 pt-3 sm:px-5">
      <div className="grid items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="h-[440px] min-h-[440px] sm:h-[500px] lg:h-[560px] 2xl:h-[600px]">
            <NetworkGraph />
          </div>
          <AttackTimeline />
        </div>

        <aside className="hidden max-h-[calc(100vh-7rem)] flex-col gap-4 overflow-y-auto pr-1 2xl:sticky 2xl:top-24 2xl:flex">
          <SidePanel />
        </aside>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className="bm-glow-cyan fixed bottom-20 right-4 z-30 2xl:hidden"
            size="lg"
            aria-label="Open response controls"
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
