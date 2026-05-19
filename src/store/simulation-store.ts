"use client";

import { create } from "zustand";
import { CONTROL_MAP } from "@/lib/simulation/controls";
import {
  buildScoreSummary,
  computeGrade,
  replayToTime,
} from "@/lib/simulation/engine";
import type { AppliedControl, ReplayResult, Scenario } from "@/lib/simulation/types";
import { DEFAULT_SCENARIO } from "@/lib/scenarios";
import type { EducationEntry, EducationMode } from "@/lib/education";

export type GamePhase = "landing" | "briefing" | "play" | "score";

interface SimulationStore {
  phase: GamePhase;
  scenario: Scenario;
  simTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  appliedControls: AppliedControl[];
  selectedControlId: string | null;
  targetNodeId: string | null;
  replay: ReplayResult;
  grade: string;
  scoreSummary: string;
  lastToast: string | null;
  educationMode: EducationMode;
  activeExplanation: EducationEntry | null;
  firstActionLessonShown: boolean;

  setPhase: (phase: GamePhase) => void;
  setEducationMode: (mode: EducationMode) => void;
  showExplanation: (entry: EducationEntry | null) => void;
  setSimTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  selectControl: (controlId: string | null) => void;
  selectTarget: (nodeId: string | null) => void;
  applyControl: (controlId: string, targetNode?: string) => void;
  tick: (deltaSeconds: number) => void;
  finishScenario: () => void;
  reset: () => void;
  clearToast: () => void;
}

function recompute(
  scenario: Scenario,
  controls: AppliedControl[],
  simTime: number,
): ReplayResult {
  return replayToTime(scenario, controls, simTime);
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  phase: "landing",
  scenario: DEFAULT_SCENARIO,
  simTime: 0,
  isPlaying: false,
  playbackSpeed: 15,
  appliedControls: [],
  selectedControlId: null,
  targetNodeId: null,
  replay: recompute(DEFAULT_SCENARIO, [], 0),
  grade: "—",
  scoreSummary: "",
  lastToast: null,
  educationMode: "learning",
  activeExplanation: null,
  firstActionLessonShown: false,

  setPhase: (phase) => set({ phase }),
  setEducationMode: (educationMode) => set({ educationMode }),
  showExplanation: (activeExplanation) => set({ activeExplanation }),

  setSimTime: (time) => {
    const { scenario, appliedControls } = get();
    const simTime = Math.max(0, Math.min(time, scenario.maxTime));
    set({ simTime, replay: recompute(scenario, appliedControls, simTime) });
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  selectControl: (controlId) =>
    set({ selectedControlId: controlId, targetNodeId: null }),

  selectTarget: (nodeId) => set({ targetNodeId: nodeId }),

  applyControl: (controlId, targetNode) => {
    const state = get();
    const def = CONTROL_MAP[controlId];
    if (!def) return;

    const cost = def.cost;
    const spent = state.replay.creditsSpent;
    if (spent + cost > state.scenario.startingCredits) {
      set({ lastToast: "Not enough response credits." });
      return;
    }

    const appliedAt = state.simTime;
    const newControl: AppliedControl = {
      controlId,
      appliedAt,
      targetNode,
    };

    const appliedControls = [...state.appliedControls, newControl];
    const replay = recompute(state.scenario, appliedControls, state.simTime);

    set({
      appliedControls,
      replay,
      isPlaying:
        state.educationMode === "learning" && !state.firstActionLessonShown
          ? false
          : state.isPlaying,
      selectedControlId: null,
      targetNodeId: null,
      firstActionLessonShown:
        state.firstActionLessonShown || state.educationMode === "learning",
      lastToast:
        state.educationMode === "learning" && !state.firstActionLessonShown
          ? `${def.name} deployed. Learning Mode paused the timeline so you can inspect the impact.`
          : `${def.name} deployed at T+${appliedAt}s`,
    });
  },

  tick: (deltaSeconds) => {
    const state = get();
    if (!state.isPlaying) return;
    const next = Math.min(
      state.simTime + deltaSeconds * state.playbackSpeed,
      state.scenario.maxTime,
    );
    const replay = recompute(state.scenario, state.appliedControls, next);
    if (next >= state.scenario.maxTime) {
      const grade = computeGrade(replay.metrics, state.scenario.events.length);
      const scoreSummary = buildScoreSummary(state.scenario, replay, grade);
      set({
        simTime: next,
        replay,
        isPlaying: false,
        phase: "score",
        grade,
        scoreSummary,
      });
      return;
    }
    set({ simTime: next, replay });
  },

  finishScenario: () => {
    const state = get();
    const replay = recompute(
      state.scenario,
      state.appliedControls,
      state.scenario.maxTime,
    );
    const grade = computeGrade(replay.metrics, state.scenario.events.length);
    const scoreSummary = buildScoreSummary(state.scenario, replay, grade);
    set({
      simTime: state.scenario.maxTime,
      replay,
      isPlaying: false,
      phase: "score",
      grade,
      scoreSummary,
    });
  },

  reset: () => {
    const scenario = DEFAULT_SCENARIO;
    set({
      phase: "landing",
      scenario,
      simTime: 0,
      isPlaying: false,
      appliedControls: [],
      selectedControlId: null,
      targetNodeId: null,
      replay: recompute(scenario, [], 0),
      grade: "—",
      scoreSummary: "",
      lastToast: null,
      activeExplanation: null,
      firstActionLessonShown: false,
    });
  },

  clearToast: () => set({ lastToast: null }),
}));
