import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const attackTimeline = `"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GlassPanel } from "@/components/ui/glass-panel";
import { cn } from "@/lib/utils";
import { useSimulationStore } from "@/store/simulation-store";

export function AttackTimeline() {
  const scenario = useSimulationStore((s) => s.scenario);
  const simTime = useSimulationStore((s) => s.simTime);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const replay = useSimulationStore((s) => s.replay);
  const setSimTime = useSimulationStore((s) => s.setSimTime);
  const setIsPlaying = useSimulationStore((s) => s.setIsPlaying);
  const finishScenario = useSimulationStore((s) => s.finishScenario);

  const progress = (simTime / scenario.maxTime) * 100;

  return (
    <GlassPanel
      className="p-4"
      header={
        <motionShell>
          <motionShell />
        </motionShell>
      }
    >
      PLACEHOLDER_BODY
    </GlassPanel>
  );
}
`;

// Use X as placeholder for div to avoid corruption
const header = `<div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Attack timeline
            </p>
            <p className="font-mono text-2xl font-semibold tracking-tight text-foreground">
              T+{Math.floor(simTime)}
              <span className="text-base font-normal text-muted-foreground">
                s / {scenario.maxTime}s
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="rounded-xl border-border/70 bg-background/40"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-xl border-border/70 bg-background/40"
              onClick={() => finishScenario()}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>`;

const body = `<div className="space-y-4">
        <motionShell />
      </motionShell>`;

fs.writeFileSync(
  path.join(root, "src/components/game/AttackTimeline.tsx"),
  "BROKEN"
);
