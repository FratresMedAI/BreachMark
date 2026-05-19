"use client";

import { LandingHero } from "@/components/game/LandingHero";
import { BriefingPanel } from "@/components/game/BriefingPanel";
import { GamePlay } from "@/components/game/GamePlay";
import { ScoreCard } from "@/components/game/ScoreCard";
import { useSimulationStore } from "@/store/simulation-store";

export function GameShell() {
  const phase = useSimulationStore((s) => s.phase);

  if (phase === "landing") return <LandingHero />;
  if (phase === "briefing") return <BriefingPanel />;
  if (phase === "play") return <GamePlay />;
  if (phase === "score") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <ScoreCard />
      </div>
    );
  }
  return null;
}
