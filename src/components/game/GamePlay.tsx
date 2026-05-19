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
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-3 px-3 pb-5 pt-3 sm:px-4 lg:h-[calc(100vh-5.25rem)] lg:min-h-[640px] lg:overflow-hidden">
      <div className="grid min-h-0 flex-1 items-start gap-3 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <div className="h-[360px] min-h-[360px] sm:h-[390px] lg:h-[min(42vh,380px)] xl:h-[min(46vh,400px)] 2xl:h-[min(48vh,430px)]">
            <NetworkGraph />
          </div>
          <AttackTimeline />
        </div>

        <aside className="hidden max-h-[calc(100vh-5.5rem)] min-h-0 flex-col gap-3 overflow-hidden lg:sticky lg:top-20 lg:flex">
          <SidePanel />
        </aside>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button
            className="bm-glow-cyan fixed bottom-20 right-4 z-30 lg:hidden"
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
