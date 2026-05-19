"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { LandingHero } from "@/components/game/LandingHero";
import { useSimulationStore } from "@/store/simulation-store";

const BriefingPanel = dynamic(() =>
  import("@/components/game/BriefingPanel").then((mod) => mod.BriefingPanel),
);
const GamePlay = dynamic(() =>
  import("@/components/game/GamePlay").then((mod) => mod.GamePlay),
);
const ScoreCard = dynamic(() =>
  import("@/components/game/ScoreCard").then((mod) => mod.ScoreCard),
);

const phaseMotion = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10, scale: 0.99 },
  transition: { type: "spring", stiffness: 300, damping: 30 },
} as const;

export function GameShell() {
  const phase = useSimulationStore((s) => s.phase);
  const setPhase = useSimulationStore((s) => s.setPhase);

  useEffect(() => {
    if (window.location.search.includes("phase=play")) {
      setPhase("play");
    }
  }, [setPhase]);

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
