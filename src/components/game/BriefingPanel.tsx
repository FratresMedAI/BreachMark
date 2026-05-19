"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useSimulationStore } from "@/store/simulation-store";

const phases = [
  "Malicious attachment on finance workstation",
  "C2 beacon and credential theft",
  "Lateral movement toward DC-01",
  "DCSync and object-storage exfiltration",
];

export function BriefingPanel() {
  const scenario = useSimulationStore((s) => s.scenario);
  const setPhase = useSimulationStore((s) => s.setPhase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl px-4 py-8"
    >
      <GlassPanel
        glow
        header={
          <>
            <p className="bm-tactical-label text-primary">Scenario briefing</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              {scenario.title}
            </h2>
            <p className="mt-1 text-muted-foreground">{scenario.subtitle}</p>
          </>
        }
      >
        <div className="space-y-5 p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="text-foreground/90">{scenario.description}</p>
          <ol className="space-y-2">
            {phases.map((phase, i) => (
              <li
                key={phase}
                className="flex gap-3 rounded-lg border border-primary/15 bg-background/25 px-3 py-2"
              >
                <span className="font-mono text-xs font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{phase}</span>
              </li>
            ))}
          </ol>
          <p className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs text-primary">
            Tip: Isolate FIN-WS-04 before T+180s or reset credentials early to
            keep DC-01 clean.
          </p>
          <Button
            className="bm-glow-cyan h-12 w-full rounded-xl text-base font-semibold"
            size="lg"
            onClick={() => setPhase("play")}
          >
            Start incident response
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
