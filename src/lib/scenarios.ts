import phishToExfil from "@/data/scenarios/phish-to-exfil.json";
import type { Scenario } from "@/lib/simulation/types";

export const SCENARIOS: Scenario[] = [phishToExfil as Scenario];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export const DEFAULT_SCENARIO = SCENARIOS[0];
