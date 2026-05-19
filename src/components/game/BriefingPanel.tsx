"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSimulationStore } from "@/store/simulation-store";

export function BriefingPanel() {
  const scenario = useSimulationStore((s) => s.scenario);
  const setPhase = useSimulationStore((s) => s.setPhase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-2xl px-4"
    >
      <Card className="border-cyan-500/20 bg-slate-900/90">
        <CardHeader>
          <CardDescription className="uppercase tracking-widest text-cyan-400">
            Scenario briefing
          </CardDescription>
          <CardTitle className="text-2xl text-slate-50">{scenario.title}</CardTitle>
          <CardDescription className="text-base">{scenario.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-300">
          <p>{scenario.description}</p>
          <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
            <li>Malicious attachment on finance workstation</li>
            <li>C2 beacon and credential theft</li>
            <li>Lateral movement toward DC-01</li>
            <li>DCSync and S3 exfiltration</li>
          </ol>
          <p className="text-sm text-amber-200/90">
            Tip: Isolate FIN-WS-04 early or reset creds before T+180s to save the
            domain controller.
          </p>
          <Button
            className="w-full bg-cyan-600 hover:bg-cyan-500"
            size="lg"
            onClick={() => setPhase("play")}
          >
            Start incident response
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
