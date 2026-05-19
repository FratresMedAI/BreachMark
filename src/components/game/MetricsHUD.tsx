"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulationStore } from "@/store/simulation-store";

export function MetricsHUD() {
  const replay = useSimulationStore((s) => s.replay);
  const scenario = useSimulationStore((s) => s.scenario);
  const m = replay.metrics;

  const exfilPct = Math.min(
    100,
    (m.recordsExfiltrated / 20600) * 100,
  );

  return (
    <Card className="border-cyan-500/20 bg-slate-900/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-cyan-100">Blast radius</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">MTTD</span>
          <span className="font-mono text-cyan-300">
            {m.mttd !== null ? `${m.mttd}s` : "—"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Hosts compromised</span>
          <span className="font-mono text-amber-300">{m.hostsCompromised}</span>
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-slate-400">Records exfiltrated</span>
            <span className="font-mono text-orange-300">
              {m.recordsExfiltrated.toLocaleString()}
            </span>
          </div>
          <Progress value={exfilPct} className="h-2" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Events contained</span>
          <span className="font-mono text-cyan-300">
            {m.eventsContained} / {scenario.events.length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Detection</span>
          <span
            className={
              m.detectionFired ? "text-emerald-400" : "text-slate-500"
            }
          >
            {m.detectionFired ? "Active" : "None"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
