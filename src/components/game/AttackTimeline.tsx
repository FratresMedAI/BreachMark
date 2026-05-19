"use client";

import { motion } from "framer-motion";
import { Flag, Pause, Play, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSimulationStore } from "@/store/simulation-store";

const PHASE_SEGMENTS = [
  { label: "Initial", end: 120 },
  { label: "C2", end: 240 },
  { label: "Lateral", end: 420 },
  { label: "Exfil", end: 600 },
];

function ShortcutBadge({ children }: { children: string }) {
  return (
    <kbd className="rounded border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] text-primary">
      {children}
    </kbd>
  );
}

export function AttackTimeline() {
  const scenario = useSimulationStore((s) => s.scenario);
  const simTime = useSimulationStore((s) => s.simTime);
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const replay = useSimulationStore((s) => s.replay);
  const setSimTime = useSimulationStore((s) => s.setSimTime);
  const setIsPlaying = useSimulationStore((s) => s.setIsPlaying);
  const finishScenario = useSimulationStore((s) => s.finishScenario);
  const progress = (simTime / scenario.maxTime) * 100;

  const skipToNext = () => {
    const next = scenario.events.find((ev) => ev.at > simTime);
    if (next) {
      setIsPlaying(false);
      setSimTime(next.at);
    }
  };

  return (
    <GlassPanel glow variant="hud" className="space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="bm-tactical-label">Attack timeline</p>
          <p className="font-mono text-2xl font-semibold text-foreground">
            T+{Math.floor(simTime)}s{" "}
            <span className="text-base font-normal text-muted-foreground">
              / {scenario.maxTime}s
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-primary/25 bg-background/40"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? "Pause attack timeline" : "Play attack timeline"}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2">
              <span>Play / Pause</span>
              <ShortcutBadge>Space</ShortcutBadge>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-primary/25 bg-background/40"
                onClick={skipToNext}
                aria-label="Skip to next attack event"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2">
              <span>Next event</span>
              <ShortcutBadge>→</ShortcutBadge>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="bm-glow-cyan rounded-xl"
                onClick={() => finishScenario()}
                aria-label="Finish scenario and open scorecard"
              >
                <Flag className="mr-1 h-4 w-4" />
                Finish
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex items-center gap-2">
              <span>End scenario</span>
              <ShortcutBadge>F</ShortcutBadge>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="mb-1 flex justify-between px-0.5">
          {PHASE_SEGMENTS.map((seg, i) => {
            const start = i === 0 ? 0 : PHASE_SEGMENTS[i - 1].end;
            const width = ((seg.end - start) / scenario.maxTime) * 100;
            return (
              <span
                key={seg.label}
                style={{ width: `${width}%` }}
                className="bm-tactical-label truncate text-center text-[9px] text-primary/70"
              >
                {seg.label}
              </span>
            );
          })}
        </div>

        <div className="relative grid h-4 overflow-hidden rounded-xl border border-primary/15 bg-muted/30">
          <div className="absolute inset-0 grid grid-cols-4">
            {PHASE_SEGMENTS.map((seg) => (
              <div key={seg.label} className="border-r border-primary/10 last:border-r-0" />
            ))}
          </div>
          <motion.div
            className="absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r from-primary/65 via-primary to-accent/85"
            style={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <div
            className="absolute top-[-6px] bottom-[-6px] w-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_18px_#00f0ff]"
            style={{
              left: `${progress}%`,
              animation: "bm-playhead-glow 2s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative mt-3 h-12">
          {scenario.events.map((ev) => {
            const pct = (ev.at / scenario.maxTime) * 100;
            const resolved = replay.resolvedEvents.find(
              (r) => r.event.id === ev.id,
            );
            const contained = resolved?.contained;
            const passed = ev.at <= simTime;
            return (
              <Tooltip key={ev.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "bm-focus-ring absolute top-3 h-3.5 w-3.5 -translate-x-1/2 rounded-sm border-2 transition-all duration-200 ease-out hover:scale-125",
                      passed &&
                        contained &&
                        "border-primary bg-primary shadow-[0_0_10px_rgba(0,240,255,0.7)]",
                      passed &&
                        !contained &&
                        "border-destructive bg-destructive shadow-[0_0_10px_rgba(255,59,92,0.6)]",
                      !passed && "border-border/80 bg-muted/80",
                    )}
                    style={{ left: `${pct}%` }}
                    onClick={() => {
                      setIsPlaying(false);
                      setSimTime(ev.at);
                    }}
                    aria-label={`Scrub to ${ev.title} at T plus ${ev.at} seconds`}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="font-semibold text-foreground">{ev.title}</p>
                  <p className="font-mono text-primary">T+{ev.at}s</p>
                  {ev.target && (
                    <p className="text-muted-foreground">Target: {ev.target}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
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
        aria-label="Scrub attack timeline"
      />

      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="bm-tactical-label text-[9px]">Recent events</span>
        {replay.resolvedEvents
          .filter((r) => r.event.at <= simTime)
          .slice(-3)
          .map((r) => (
            <span
              key={r.event.id}
              className={cn(
                "rounded-md border px-2 py-1 font-mono",
                r.contained
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {r.contained ? "Contained" : "Fired"}: {r.event.title}
            </span>
          ))}
      </div>
    </GlassPanel>
  );
}
