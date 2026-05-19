"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

  return (
    <div className="space-y-3 rounded-xl border border-cyan-500/20 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400/80">
            Attack timeline
          </p>
          <p className="font-mono text-lg text-slate-100">
            T+{Math.floor(simTime)}s{" "}
            <span className="text-sm text-slate-500">
              / {scenario.maxTime}s
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-cyan-700"
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
            className="border-cyan-700"
            onClick={() => finishScenario()}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
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
                passed && contained && "border-cyan-400 bg-cyan-500",
                passed && !contained && "border-orange-500 bg-orange-500",
                !passed && "border-slate-600 bg-slate-700",
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
                  ? "bg-cyan-950 text-cyan-300"
                  : "bg-orange-950 text-orange-300",
              )}
            >
              {r.contained ? "Contained" : "Fired"}: {r.event.title}
            </span>
          ))}
      </div>
    </div>
  );
}
