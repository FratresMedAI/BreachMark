"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useSimulationStore } from "@/store/simulation-store";

const phases = [
  "T+30 edge-gateway phish lands on finance",
  "T+45 VPN token replay lands on HR-WS-11",
  "Credential theft and lateral movement",
  "Domain controller escalation",
  "Object-storage exfiltration near the end",
];

export function BriefingPanel() {
  const scenario = useSimulationStore((s) => s.scenario);
  const setPhase = useSimulationStore((s) => s.setPhase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="mx-auto w-full max-w-3xl px-4 py-8"
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
                className="bm-neon-hover flex gap-3 rounded-xl border border-primary/15 bg-background/25 px-3 py-2"
              >
                <span className="font-mono text-xs font-semibold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{phase}</span>
              </li>
            ))}
          </ol>
          <p className="rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-xs text-primary">
            Tip: Try one control, scrub the timeline, and watch the graph. Block
            IOC slows the edge path; revoke sessions addresses the VPN replay on
            HR.
          </p>
          <Button
            className="bm-glow-cyan h-12 w-full rounded-xl text-base font-semibold"
            size="lg"
            onClick={() => setPhase("play")}
            aria-label="Start incident response simulation"
          >
            Start incident response
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
