"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useSimulationStore } from "@/store/simulation-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  const isGradeA = grade === "A";

  useEffect(() => {
    if (!isGradeA) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ["#00f0ff", "#fbbf24", "#d946ef"],
    });
  }, [isGradeA]);

  const stats = [
    ["Hosts saved", String(hostsSaved)],
    ["Records exfiltrated", replay.metrics.recordsExfiltrated.toLocaleString()],
    [
      "MTTD",
      replay.metrics.mttd !== null ? `${replay.metrics.mttd}s` : "Never",
    ],
    ["Credits left", String(replay.creditsRemaining)],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-lg px-4 py-12"
    >
      <GlassPanel glow className="overflow-hidden">
        <div className="relative px-6 pb-2 pt-8 text-center">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.2),transparent_55%)]" />
          <BrandLogo size="lg" glow className="mx-auto mb-2" />
          <p className="relative bm-tactical-label">Mission debrief</p>
          <motion.p
            className={cn(
              "relative mt-2 font-display text-8xl font-extrabold",
              isGradeA ? "bm-grade-a bm-glow-gold" : "bm-text-gradient",
            )}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14 }}
          >
            {grade}
          </motion.p>
          <p className="relative mt-2 text-lg font-medium text-foreground">
            {scenario.title}
          </p>
          <p className="relative mt-1 text-sm text-muted-foreground">
            {stageMsg}
          </p>
        </div>
        <ul className="grid gap-2 px-6 pb-4 text-sm">
          {stats.map(([label, value], i) => (
            <motion.li
              key={String(label)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex justify-between rounded-lg border border-primary/10 bg-background/30 px-3 py-2"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono font-medium text-foreground">
                {value}
              </span>
            </motion.li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-primary/10 p-4 sm:flex-row">
          <Button
            className="bm-glow-cyan flex-1 rounded-xl"
            onClick={() => {
              void navigator.clipboard.writeText(scoreSummary);
              toast.success("Score copied — ready for LinkedIn");
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy result
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl border-primary/25" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Play again
          </Button>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
