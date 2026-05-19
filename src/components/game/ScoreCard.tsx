"use client";

import { motion } from "framer-motion";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      ? `Contained at stage ${replay.containmentStage} of ${scenario.events.length} — ${scenario.events.length - replay.containmentStage} stages prevented.`
      : "No containment — full breach progression.";

  const hostsSaved = Math.max(
    0,
    scenario.nodes.length - replay.metrics.hostsCompromised,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-lg"
    >
      <Card className="border-cyan-500/30 bg-slate-900/90 shadow-2xl shadow-cyan-950/40">
        <CardHeader className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
            Mission debrief
          </p>
          <CardTitle className="text-6xl font-black text-amber-400">
            {grade}
          </CardTitle>
          <CardDescription className="text-base text-slate-300">
            {scenario.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-cyan-200">{stageMsg}</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Hosts saved: {hostsSaved}</li>
            <li>
              Records exfiltrated:{" "}
              {replay.metrics.recordsExfiltrated.toLocaleString()}
            </li>
            <li>
              MTTD:{" "}
              {replay.metrics.mttd !== null
                ? `${replay.metrics.mttd}s`
                : "Never detected"}
            </li>
            <li>Credits remaining: {replay.creditsRemaining}</li>
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="flex-1 bg-cyan-600 hover:bg-cyan-500"
              onClick={() => {
                void navigator.clipboard.writeText(scoreSummary);
                toast.success("Score copied — paste on LinkedIn or your README");
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy result
            </Button>
            <Button variant="outline" className="flex-1" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Play again
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
