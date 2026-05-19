import { getControlCost } from "./controls";
import type {
  AppliedControl,
  CompromiseLevel,
  ControlRequirement,
  ReplayResult,
  ResolvedEvent,
  Scenario,
  ScenarioEvent,
  SimMetrics,
  SimNodeState,
} from "./types";

function cloneNodes(scenario: Scenario): SimNodeState[] {
  return scenario.nodes.map((n) => ({
    ...n,
    compromise: 0 as CompromiseLevel,
    isolated: false,
    enhancedLogging: false,
  }));
}

function controlAppliesToRequirement(
  control: AppliedControl,
  req: ControlRequirement,
  event: ScenarioEvent,
): boolean {
  if (control.controlId !== req.controlId) return false;
  if (control.appliedAt > event.at) return false;

  const requiredTarget = req.targetNode ?? event.target ?? event.source;
  if (requiredTarget && control.targetNode && control.targetNode !== requiredTarget) {
    return false;
  }
  if (requiredTarget && !control.targetNode && req.targetNode) {
    return false;
  }

  return true;
}

function isEventContained(
  event: ScenarioEvent,
  controls: AppliedControl[],
  nodes: SimNodeState[],
): { contained: boolean; controlId?: string } {
  if (event.source && event.type !== "initial_access") {
    const source = nodes.find((n) => n.id === event.source);
    if (source && source.compromise === 0) {
      return { contained: true, controlId: "unreachable" };
    }
  }

  for (const req of event.blockedBy) {
    const match = controls.find((c) => controlAppliesToRequirement(c, req, event));
    if (match) {
      return { contained: true, controlId: match.controlId };
    }
  }

  if (event.source) {
    const source = nodes.find((n) => n.id === event.source);
    if (source?.isolated) {
      return { contained: true, controlId: "isolate-host" };
    }
  }

  if (event.target) {
    const target = nodes.find((n) => n.id === event.target);
    if (target?.isolated) {
      return { contained: true, controlId: "isolate-host" };
    }
  }

  return { contained: false };
}

function applyEffects(
  nodes: SimNodeState[],
  event: ScenarioEvent,
  metrics: SimMetrics,
): void {
  for (const effect of event.effects) {
    const node = nodes.find((n) => n.id === effect.nodeId);
    if (!node) continue;

    if (effect.type === "compromise" || effect.type === "lateral_mark") {
      const level = (effect.level ?? 2) as CompromiseLevel;
      node.compromise = Math.max(node.compromise, level) as CompromiseLevel;
    }
    if (effect.type === "exfil" && effect.records) {
      metrics.recordsExfiltrated += effect.records;
    }
  }
}

function applyControlSideEffects(
  nodes: SimNodeState[],
  controls: AppliedControl[],
  metrics: SimMetrics,
  upToTime: number,
): void {
  for (const control of controls) {
    if (control.appliedAt > upToTime) continue;

    if (control.controlId === "isolate-host" && control.targetNode) {
      const node = nodes.find((n) => n.id === control.targetNode);
      if (node) node.isolated = true;
    }
    if (control.controlId === "enhanced-logging") {
      metrics.detectionFired = true;
      if (metrics.mttd === null) metrics.mttd = control.appliedAt;
      for (const n of nodes) n.enhancedLogging = true;
    }
  }
}

export function replayToTime(
  scenario: Scenario,
  controls: AppliedControl[],
  simTime: number,
): ReplayResult {
  const nodes = cloneNodes(scenario);
  const metrics: SimMetrics = {
    mttd: null,
    hostsCompromised: 0,
    recordsExfiltrated: 0,
    detectionFired: false,
    eventsContained: 0,
    eventsFired: 0,
  };

  const sortedControls = [...controls].sort((a, b) => a.appliedAt - b.appliedAt);
  const creditsSpent = sortedControls
    .filter((c) => c.appliedAt <= simTime)
    .reduce((sum, c) => sum + getControlCost(c.controlId), 0);

  applyControlSideEffects(nodes, sortedControls, metrics, simTime);

  const resolvedEvents: ResolvedEvent[] = [];
  let containmentStage: number | null = null;

  const events = [...scenario.events].sort((a, b) => a.at - b.at);
  for (const event of events) {
    if (event.at > simTime) break;

    const { contained, controlId } = isEventContained(event, sortedControls, nodes);
    resolvedEvents.push({
      event,
      contained,
      containmentControlId: controlId,
    });

    if (contained) {
      metrics.eventsContained += 1;
      if (containmentStage === null) {
        containmentStage = resolvedEvents.length;
      }
      if (controlId === "enhanced-logging" && metrics.mttd === null) {
        metrics.mttd = sortedControls.find((c) => c.controlId === "enhanced-logging")?.appliedAt ?? event.at;
      }
      if (controlId && controlId !== "enhanced-logging" && metrics.mttd === null) {
        const ctrl = sortedControls.find((c) => c.controlId === controlId);
        if (ctrl) metrics.mttd = ctrl.appliedAt;
        metrics.detectionFired = true;
      }
    } else {
      metrics.eventsFired += 1;
      applyEffects(nodes, event, metrics);
    }
  }

  metrics.hostsCompromised = nodes.filter((n) => n.compromise > 0).length;

  return {
    simTime,
    nodes,
    metrics,
    creditsSpent,
    creditsRemaining: scenario.startingCredits - creditsSpent,
    resolvedEvents,
    containmentStage,
  };
}

export function computeGrade(metrics: SimMetrics, maxEvents: number): string {
  const containedRatio = metrics.eventsContained / Math.max(maxEvents, 1);
  if (metrics.recordsExfiltrated === 0 && metrics.hostsCompromised <= 1) return "A";
  if (containedRatio >= 0.7 && metrics.recordsExfiltrated < 5000) return "B";
  if (containedRatio >= 0.4) return "C";
  if (metrics.hostsCompromised < maxEvents) return "D";
  return "F";
}

export function buildScoreSummary(
  scenario: Scenario,
  result: ReplayResult,
  grade: string,
): string {
  const stage =
    result.containmentStage !== null
      ? `Contained at stage ${result.containmentStage} of ${scenario.events.length}`
      : "No containment — full breach progression";

  return [
    `## Breach Budget — ${scenario.title}`,
    `**Grade:** ${grade}`,
    `**${stage}**`,
    `- Hosts compromised: ${result.metrics.hostsCompromised}`,
    `- Records exfiltrated: ${result.metrics.recordsExfiltrated.toLocaleString()}`,
    `- MTTD: ${result.metrics.mttd !== null ? `${result.metrics.mttd}s` : "Never detected"}`,
    `- Credits remaining: ${result.creditsRemaining}/${scenario.startingCredits}`,
    "",
    "https://github.com/FratresMedAI/BreachMark",
    "https://www.linkedin.com/in/kyle-bean-fratresxai/",
  ].join("\n");
}
