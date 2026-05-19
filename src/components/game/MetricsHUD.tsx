"use client";

import { motion } from "framer-motion";
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
    {
      label: "Hosts compromised",
      value: String(m.hostsCompromised),
      tone: "text-[#fbbf24]",
    },
    {
      label: "Detection",
      value: m.detectionFired ? "Active" : "None",
      tone: m.detectionFired ? "text-primary" : "text-muted-foreground",
    },
    {
      label: "Contained",
      value: `${m.eventsContained}/${scenario.events.length}`,
      tone: "text-[#d946ef]",
    },
  ];

  return (
    <GlassPanel
      variant="hud"
      glow
      header={<p className="bm-tactical-label">Tactical HUD</p>}
    >
      <div className="grid grid-cols-2 gap-2 p-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-primary/15 bg-background/40 px-3 py-2.5 shadow-[inset_0_0_20px_-16px_rgba(0,240,255,0.3)]"
          >
            <p className="bm-tactical-label text-[9px]">{s.label}</p>
            <p className={cn("mt-1 font-mono text-lg font-semibold", s.tone)}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="border-t border-primary/10 px-3 pb-3 pt-2">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-muted-foreground">Records exfiltrated</span>
          <span className="font-mono text-destructive">
            {m.recordsExfiltrated.toLocaleString()}
          </span>
        </div>
        <Progress
          value={exfilPct}
          className="h-2 bg-muted/40 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-destructive/80 [&>[data-slot=progress-indicator]]:to-destructive"
        />
      </div>
    </GlassPanel>
  );
}
