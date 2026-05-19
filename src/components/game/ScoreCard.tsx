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
import { AfterActionReview } from "@/components/education/AfterActionReview";
import { LearnBadge } from "@/components/education/EduTooltip";
import { learningInsight } from "@/lib/education";

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
  const containmentPct = Math.round(
    (replay.metrics.eventsContained / scenario.events.length) * 100,
  );
  const exfilPrevented = Math.max(0, 20600 - replay.metrics.recordsExfiltrated);

  const isGradeA = grade === "A";
  const insight = learningInsight(containmentPct);

  useEffect(() => {
    if (!isGradeA) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.55 },
      colors: ["#00f0ff", "#fbbf24", "#c026d3"],
    });
  }, [isGradeA]);

  const stats = [
    ["Containment", `${containmentPct}%`],
    ["Exfil prevented", exfilPrevented.toLocaleString()],
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
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-background/82 px-4 py-8 backdrop-blur-md"
    >
      <GlassPanel glow className="w-full max-w-3xl overflow-hidden">
        <div className="relative px-6 pb-2 pt-8 text-center">
          <div className="bm-grid pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,240,255,0.22),transparent_55%)]" />
          <BrandLogo size="lg" glow className="mx-auto mb-2" />
          <p className="relative bm-tactical-label">Mission debrief</p>
          <motion.p
            className={cn(
              "relative mt-2 font-display text-8xl font-black",
              isGradeA ? "bm-grade-a bm-glow-gold" : "bm-text-gradient",
            )}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            {grade}
          </motion.p>
          <p className="relative mt-2 text-lg font-medium text-foreground">
            {scenario.title}
          </p>
          <p className="relative mt-1 text-sm text-muted-foreground">
            {stageMsg}
          </p>
          <p className="relative mx-auto mt-3 max-w-xl rounded-xl border border-[#c026d3]/25 bg-[#c026d3]/10 px-3 py-2 text-sm text-foreground/90">
            <LearnBadge className="mr-2" />
            {insight}
          </p>
        </div>
        <ul className="grid gap-2 px-6 pb-4 text-sm sm:grid-cols-2">
          {stats.map(([label, value], i) => (
            <motion.li
              key={String(label)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="bm-neon-hover flex justify-between rounded-xl border border-primary/10 bg-background/30 px-3 py-2"
            >
              <span className="text-muted-foreground">{label}</span>
              <span className="font-mono font-medium text-foreground">
                {value}
              </span>
            </motion.li>
          ))}
        </ul>
        <div className="px-6 pb-4">
          <div className="rounded-xl border border-[#c026d3]/20 bg-[#c026d3]/10 px-3 py-2 text-xs text-muted-foreground">
            You contained {containmentPct}% of the attack path. This maps to
            NIST Detect + Respond: identify signal, contain spread, then protect
            data from exfiltration.
          </div>
        </div>
        <AfterActionReview scenario={scenario} replay={replay} />
        <div className="flex flex-col gap-2 border-t border-primary/10 p-4 sm:flex-row">
          <Button
            className="bm-glow-cyan flex-1 rounded-xl"
            onClick={() => {
              const richSummary = `BreachMark SOC run complete: ${grade} grade. ${containmentPct}% containment, ${hostsSaved} hosts saved, ${exfilPrevented.toLocaleString()} records protected. Learning highlight: ${insight} #CyberSecurity #BlueTeam #IncidentResponse #BreachMark`;
              void navigator.clipboard.writeText(`${richSummary}\n\n${scoreSummary}`);
              toast.success("LinkedIn summary copied");
            }}
            aria-label="Copy LinkedIn summary"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy LinkedIn Summary
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl border-primary/25"
            onClick={reset}
            aria-label="Play the BreachMark scenario again"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Play again
          </Button>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
