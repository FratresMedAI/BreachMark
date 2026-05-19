"use client";

import { Progress } from "@/components/ui/progress";
import { GlassPanel } from "@/components/ui/glass-panel";
import { cn } from "@/lib/utils";
import { useSimulationStore } from "@/store/simulation-store";

export function MetricsHUD() {
  const replay = useSimulationStore((s) => s.replay);
  const scenario = useSimulationStore((s) => s.scenario);
  const m = replay.metrics;
  const exfilPct = Math.min(100, (m.recordsExfiltrated / 20600) * 100);

  const stats = [
    { label: "MTTD", value: m.mttd !== null ? `${m.mttd}s` : "—", tone: "text-primary" },
    { label: "Hosts compromised", value: String(m.hostsCompromised), tone: "text-[oklch(0.8_0.14_75)]" },
    {
      label: "Detection",
      value: m.detectionFired ? "Active" : "None",
      tone: m.detectionFired ? "text-emerald-400" : "text-muted-foreground",
    },
    {
      label: "Contained",
      value: `${m.eventsContained}/${scenario.events.length}`,
      tone: "text-primary",
    },
  ];

  return (
    <GlassPanel
      header={
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Blast radius
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-2 p-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border/50 bg-background/30 px-3 py-2.5"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className={cn("mt-1 font-mono text-lg font-semibold", s.tone)}>
              {s.value}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-border/50 px-3 pb-3 pt-2">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted-foreground">Records exfiltrated</span>
          <span className="font-mono text-destructive">
            {m.recordsExfiltrated.toLocaleString()}
          </span>
        </div>
        <Progress value={exfilPct} className="h-2 bg-muted/50" />
      </div>
    </GlassPanel>
  );
}
