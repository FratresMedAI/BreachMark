import { describe, expect, it } from "vitest";
import scenarioJson from "@/data/scenarios/phish-to-exfil.json";
import { replayToTime } from "./engine";
import type { AppliedControl, Scenario } from "./types";

const scenario = scenarioJson as Scenario;

describe("replayToTime", () => {
  it("runs full breach with no controls", () => {
    const result = replayToTime(scenario, [], 600);
    expect(result.metrics.eventsFired).toBe(10);
    expect(result.metrics.recordsExfiltrated).toBeGreaterThan(0);
    expect(result.metrics.hostsCompromised).toBeGreaterThan(1);
  });

  it("contains early phish with awareness push", () => {
    const controls: AppliedControl[] = [
      { controlId: "awareness-push", appliedAt: 10 },
    ];
    const result = replayToTime(scenario, controls, 600);
    const first = result.resolvedEvents[0];
    expect(first.contained).toBe(true);
    expect(result.metrics.eventsContained).toBeGreaterThan(0);
  });

  it("isolate finance before lateral limits DC compromise", () => {
    const controls: AppliedControl[] = [
      { controlId: "isolate-host", appliedAt: 60, targetNode: "ws-finance" },
    ];
    const result = replayToTime(scenario, controls, 600);
    const dc = result.nodes.find((n) => n.id === "dc-01");
    expect(dc?.compromise ?? 0).toBe(0);
    expect(result.metrics.recordsExfiltrated).toBe(0);
  });

  it("recomputes deterministically when scrubbing time", () => {
    const controls: AppliedControl[] = [
      { controlId: "block-ioc", appliedAt: 200 },
    ];
    const at180 = replayToTime(scenario, controls, 180);
    const at600 = replayToTime(scenario, controls, 600);
    expect(at180.metrics.recordsExfiltrated).toBeLessThanOrEqual(
      at600.metrics.recordsExfiltrated,
    );
  });

  it("tracks credits spent", () => {
    const controls: AppliedControl[] = [
      { controlId: "awareness-push", appliedAt: 5 },
      { controlId: "block-ioc", appliedAt: 50 },
    ];
    const result = replayToTime(scenario, controls, 600);
    expect(result.creditsSpent).toBe(3);
    expect(result.creditsRemaining).toBe(9);
  });
});
