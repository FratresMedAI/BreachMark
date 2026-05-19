"use client";

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { learningInsight } from "@/lib/education";
import type { ReplayResult, Scenario } from "@/lib/simulation/types";
import { LearnBadge } from "./EduTooltip";

export function AfterActionReview({
  scenario,
  replay,
}: {
  scenario: Scenario;
  replay: ReplayResult;
}) {
  const containmentPct = Math.round(
    (replay.metrics.eventsContained / scenario.events.length) * 100,
  );
  const lessons = [
    learningInsight(containmentPct),
    replay.metrics.recordsExfiltrated === 0
      ? "You protected the data store; that is the practical goal of exfiltration response."
      : "Exfiltration occurred; use the timeline to find the last event before data left.",
    replay.metrics.mttd !== null
      ? "Enhanced logging improved Detect coverage by creating an earlier MTTD signal."
      : "No detection signal fired; real SOCs need telemetry before they can respond.",
    replay.creditsRemaining > 0
      ? "Unused credits are capacity; in a real incident, spend them where blast radius is growing."
      : "You used the full budget, which mirrors the tradeoff between speed and disruption.",
  ];

  return (
    <GlassPanel className="mx-6 mb-4 border-[#c026d3]/25">
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-2">
          <LearnBadge />
          <p className="font-semibold text-foreground">Key Lessons Learned</p>
        </div>
        <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {lessons.map((lesson, index) => (
            <motion.li
              key={lesson}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl border border-[#c026d3]/15 bg-[#c026d3]/10 px-3 py-2"
            >
              {lesson}
            </motion.li>
          ))}
        </ul>
      </div>
    </GlassPanel>
  );
}
