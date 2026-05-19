"use client";

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
    <GlassPanel className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Attack timeline
          </p>
          <p className="font-mono text-2xl font-semibold text-foreground">
            T+{Math.floor(simTime)}s{" "}
            <span className="text-base font-normal text-muted-foreground">
              / {scenario.maxTime}s
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-border/70 bg-background/40"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-border/70 bg-background/40"
            onClick={() => finishScenario()}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-muted/40">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <Slider
        value={[simTime]}
        min={0}
        max={scenario.maxTime}
        step={5}
        onValueChange={([v]) => {
          setIsPlaying(false);
          setSimTime(v);
        }}
      />

      <div className="relative h-14">
        {scenario.events.map((ev) => {
          const pct = (ev.at / scenario.maxTime) * 100;
          const resolved = replay.resolvedEvents.find(
            (r) => r.event.id === ev.id,
          );
          const contained = resolved?.contained;
          const passed = ev.at <= simTime;
          return (
            <button
              key={ev.id}
              type="button"
              title={`${ev.title} (T+${ev.at}s)`}
              className={cn(
                "absolute top-4 h-3 w-3 -translate-x-1/2 rounded-full border transition-colors",
                passed && contained && "border-primary bg-primary shadow-[0_0_8px_oklch(0.72_0.12_195/60%)]",
                passed && !contained && "border-[oklch(0.65_0.2_45)] bg-[oklch(0.65_0.2_45)]",
                !passed && "border-border bg-muted",
              )}
              style={{ left: `${pct}%` }}
              onClick={() => {
                setIsPlaying(false);
                setSimTime(ev.at);
              }}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
        {replay.resolvedEvents
          .filter((r) => r.event.at <= simTime)
          .slice(-2)
          .map((r) => (
            <span
              key={r.event.id}
              className={cn(
                "rounded px-2 py-0.5",
                r.contained
                  ? "bg-primary/15 text-primary"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              {r.contained ? "Contained" : "Fired"}: {r.event.title}
            </span>
          ))}
      </div>
    </GlassPanel>
  );
}
