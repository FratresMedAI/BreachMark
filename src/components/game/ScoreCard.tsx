"use client";

import { motion } from "framer-motion";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useSimulationStore } from "@/store/simulation-store";
import { toast } from "sonner";

export function ScoreCard() {
  const scenario = useSimulationStore((s) => s.scenario);
  const replay = useSimulationStore((s) => s.replay);
  const grade = useSimulationStore((s) => s.grade);
  const scoreSummary = useSimulationStore((s) => s.scoreSummary);
  const reset = useSimulationStore((s) => s.reset);

  const stageMsg =
    replay.containmentStage !== null
      ? `Contained at stage ${replay.containmentStage} of ${scenario.events.length}`
      : "No containment — full breach progression";

  const hostsSaved = Math.max(
    0,
    scenario.nodes.length - replay.metrics.hostsCompromised,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-lg px-4 py-12"
    >
      <GlassPanel className="overflow-hidden">
        <div className="relative px-6 pb-2 pt-8 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.72_0.12_195/25%),transparent_55%)]" />
          <BrandLogo size="lg" glow className="mx-auto mb-2" />
          <p className="relative text-[10px] font-medium uppercase tracking-[0.35em] text-muted-foreground">
            Mission debrief
          </p>
          <p className="relative mt-2 font-display text-7xl font-extrabold bm-text-gradient">
            {grade}
          </p>
          <p className="relative mt-2 text-lg font-medium text-foreground">
            {scenario.title}
          </p>
          <p className="relative mt-1 text-sm text-muted-foreground">{stageMsg}</p>
        </div>
        <ul className="grid gap-2 px-6 pb-4 text-sm">
          {[
            ["Hosts saved", hostsSaved],
            ["Records exfiltrated", replay.metrics.recordsExfiltrated.toLocaleString()],
            [
              "MTTD",
              replay.metrics.mttd !== null ? `${replay.metrics.mttd}s` : "Never",
            ],
            ["Credits left", replay.creditsRemaining],
          ].map(([label, value]) => (
            <li
              key={String(label)}
              className="flex justify-between rounded-lg bg-background/30 px-3 py-2"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono font-medium text-foreground">{value}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-border/50 p-4 sm:flex-row">
          <Button
            className="bm-glow-primary flex-1 rounded-xl"
            onClick={() => {
              void navigator.clipboard.writeText(scoreSummary);
              toast.success("Score copied — ready for LinkedIn");
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy result
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Play again
          </Button>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
