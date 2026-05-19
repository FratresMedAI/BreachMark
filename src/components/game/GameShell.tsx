"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LandingHero } from "@/components/game/LandingHero";
import { BriefingPanel } from "@/components/game/BriefingPanel";
import { GamePlay } from "@/components/game/GamePlay";
import { ScoreCard } from "@/components/game/ScoreCard";
import { useSimulationStore } from "@/store/simulation-store";

const phaseMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 },
};

export function GameShell() {
  const phase = useSimulationStore((s) => s.phase);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={phase} {...phaseMotion}>
        {phase === "landing" && <LandingHero />}
        {phase === "briefing" && <BriefingPanel />}
        {phase === "play" && <GamePlay />}
        {phase === "score" && (
          <div className="flex min-h-[80vh] items-center justify-center p-4">
            <ScoreCard />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
