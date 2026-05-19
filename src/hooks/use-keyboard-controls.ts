"use client";

import { useEffect } from "react";
import { useSimulationStore } from "@/store/simulation-store";

export function useKeyboardControls() {
  const isPlaying = useSimulationStore((s) => s.isPlaying);
  const setIsPlaying = useSimulationStore((s) => s.setIsPlaying);
  const scenario = useSimulationStore((s) => s.scenario);
  const simTime = useSimulationStore((s) => s.simTime);
  const setSimTime = useSimulationStore((s) => s.setSimTime);
  const finishScenario = useSimulationStore((s) => s.finishScenario);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
      if (e.code === "ArrowRight") {
        e.preventDefault();
        const next = scenario.events.find((ev) => ev.at > simTime);
        if (next) {
          setIsPlaying(false);
          setSimTime(next.at);
        }
      }
      if (e.key === "f" || e.key === "F") {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        finishScenario();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    isPlaying,
    setIsPlaying,
    scenario.events,
    simTime,
    setSimTime,
    finishScenario,
  ]);
}
