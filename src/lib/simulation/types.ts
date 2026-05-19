export type NodeRole = "workstation" | "dc" | "storage" | "gateway";

export type CompromiseLevel = 0 | 1 | 2 | 3;

export interface ScenarioNode {
  id: string;
  label: string;
  role: NodeRole;
  position: { x: number; y: number };
}

export interface ScenarioEdge {
  id: string;
  source: string;
  target: string;
}

export interface ControlRequirement {
  controlId: string;
  /** If set, the control must target this node (or event source when target omitted). */
  targetNode?: string;
}

export interface EventEffect {
  type: "compromise" | "exfil" | "lateral_mark";
  nodeId: string;
  level?: CompromiseLevel;
  records?: number;
}

export interface ScenarioEvent {
  id: string;
  at: number;
  type: string;
  title: string;
  description: string;
  source?: string;
  target?: string;
  /** Event is contained if ANY requirement is satisfied by an active control. */
  blockedBy: ControlRequirement[];
  effects: EventEffect[];
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  startingCredits: number;
  maxTime: number;
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
  events: ScenarioEvent[];
}

export interface AppliedControl {
  controlId: string;
  appliedAt: number;
  targetNode?: string;
}

export interface SimNodeState {
  id: string;
  label: string;
  role: NodeRole;
  position: { x: number; y: number };
  compromise: CompromiseLevel;
  enhancedLogging: boolean;
}

export interface SimMetrics {
  mttd: number | null;
  hostsCompromised: number;
  recordsExfiltrated: number;
  detectionFired: boolean;
  eventsContained: number;
  eventsFired: number;
}

export interface ResolvedEvent {
  event: ScenarioEvent;
  contained: boolean;
  containmentControlId?: string;
}

export interface ReplayResult {
  simTime: number;
  nodes: SimNodeState[];
  metrics: SimMetrics;
  creditsSpent: number;
  creditsRemaining: number;
  resolvedEvents: ResolvedEvent[];
  containmentStage: number | null;
}
