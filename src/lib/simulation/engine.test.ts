import { describe, expect, it } from "vitest";
import scenarioJson from "@/data/scenarios/phish-to-exfil.json";
import { replayToTime } from "./engine";
import type { AppliedControl, Scenario } from "./types";

const scenario = scenarioJson as Scenario;

describe("replayToTime", () => {
  it("runs full breach with no controls", () => {
    const result = replayToTime(scenario, [], 600);
    expect(result.metrics.eventsFired).toBe(12);
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

  it("containing the edge gateway still leaves the VPN attack active", () => {
    const controls: AppliedControl[] = [
      { controlId: "isolate-host", appliedAt: 10, targetNode: "gw-edge" },
    ];
    const result = replayToTime(scenario, controls, 600);
    const dc = result.nodes.find((n) => n.id === "dc-01");
    const ops = result.nodes.find((n) => n.id === "ws-ops");
    expect(result.resolvedEvents[0]?.contained).toBe(true);
    expect(ops?.compromise ?? 0).toBeGreaterThan(0);
    expect(dc?.compromise ?? 0).toBeGreaterThan(0);
    expect(result.metrics.recordsExfiltrated).toBeGreaterThan(0);
  });

  it("requires containing both gateways to keep DC clean", () => {
    const controls: AppliedControl[] = [
      { controlId: "isolate-host", appliedAt: 10, targetNode: "gw-edge" },
      { controlId: "isolate-host", appliedAt: 40, targetNode: "gw-vpn" },
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
    expect(result.creditsSpent).toBe(5);
    expect(result.creditsRemaining).toBe(7);
  });
});
