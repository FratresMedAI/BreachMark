"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSimulationStore } from "@/store/simulation-store";
import type { GamePhase } from "@/store/simulation-store";

const phaseLabels: Partial<Record<GamePhase, string>> = {
  briefing: "Scenario briefing",
  play: "Incident response",
  score: "Mission debrief",
};

export function AppHeader() {
  const phase = useSimulationStore((s) => s.phase);
  const replay = useSimulationStore((s) => s.replay);
  const scenario = useSimulationStore((s) => s.scenario);
  const setPhase = useSimulationStore((s) => s.setPhase);
  const reset = useSimulationStore((s) => s.reset);

  if (phase === "landing") return null;

  const goBack = () => {
    if (phase === "play") setPhase("briefing");
    else if (phase === "briefing" || phase === "score") reset();
  };

  return (
    <header className="bm-panel relative z-20 mx-4 mt-4 flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={goBack}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            Breach<span className="bm-text-gradient">Mark</span>
          </p>
          <p className="text-xs text-muted-foreground">{phaseLabels[phase]}</p>
        </div>
      </div>
      {phase === "play" && (
        <div className="hidden items-center gap-6 sm:flex">
          <Stat label="Credits" value={`${replay.creditsRemaining}/${scenario.startingCredits}`} />
          <Stat label="Contained" value={`${replay.metrics.eventsContained}/${scenario.events.length}`} />
        </div>
      )}
    </header>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-sm font-medium text-primary">{value}</p>
    </div>
  );
}
