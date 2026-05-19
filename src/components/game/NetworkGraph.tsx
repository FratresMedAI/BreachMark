"use client";

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Cloud,
  Laptop,
  Router,
  Server,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { NodeRole, SimNodeState } from "@/lib/simulation/types";
import { useSimulationStore } from "@/store/simulation-store";
import { CONTROL_MAP } from "@/lib/simulation/controls";
import { GlassPanel } from "@/components/ui/glass-panel";

const roleIcons: Record<NodeRole, LucideIcon> = {
  workstation: Laptop,
  dc: Server,
  storage: Cloud,
  gateway: Router,
};

const compromiseStyles: Record<
  number,
  { ring: string; glow: string; badge: string }
> = {
  0: {
    ring: "border-primary/25",
    glow: "",
    badge: "bg-primary/10 text-primary",
  },
  1: {
    ring: "border-[oklch(0.75_0.14_75)]/50",
    glow: "shadow-[0_0_24px_-4px_oklch(0.65_0.14_75/50%)]",
    badge: "bg-[oklch(0.35_0.08_75)] text-[oklch(0.85_0.12_75)]",
  },
  2: {
    ring: "border-[oklch(0.65_0.2_45)]/60",
    glow: "shadow-[0_0_28px_-4px_oklch(0.55_0.2_45/55%)]",
    badge: "bg-[oklch(0.32_0.1_45)] text-[oklch(0.82_0.14_55)]",
  },
  3: {
    ring: "border-destructive/70",
    glow: "shadow-[0_0_32px_-4px_oklch(0.55_0.22_25/60%)]",
    badge: "bg-destructive/20 text-destructive",
  },
};

function HostNode({ data, selected }: NodeProps) {
  const node = data.node as SimNodeState;
  const pulse = Boolean(data.pulse);
  const level = node.compromise;
  const style = compromiseStyles[level] ?? compromiseStyles[0];
  const Icon = roleIcons[node.role];

  return (
    <div
      className={cn(
        "transition-transform duration-300",
        selected && "scale-[1.04]",
        pulse && "animate-pulse",
      )}
    >
      <div
        className={cn(
          "relative min-w-[148px] rounded-xl border bg-card/90 px-3.5 py-3 backdrop-blur-md",
          style.ring,
          style.glow,
          node.isolated && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        )}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2 !w-2 !border-0 !bg-primary"
        />
        <div className="mb-2 flex items-center justify-between gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider",
              style.badge,
            )}
          >
            <Icon className="h-3 w-3" />
            {node.role}
          </span>
          {node.isolated && (
            <span className="text-[9px] font-semibold uppercase tracking-widest text-primary">
              Isolated
            </span>
          )}
        </div>
        <p className="font-mono text-sm font-semibold tracking-tight text-foreground">
          {node.label}
        </p>
        {level > 0 && (
          <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
            Compromise level{" "}
            <span className="font-semibold text-foreground">{level}</span>
          </p>
        )}
        <Handle
          type="source"
          position={Position.Right}
          className="!h-2 !w-2 !border-0 !bg-primary"
        />
      </div>
    </div>
  );
}

const nodeTypes = { host: HostNode };

export function NetworkGraph() {
  const scenario = useSimulationStore((s) => s.scenario);
  const replay = useSimulationStore((s) => s.replay);
  const selectedControlId = useSimulationStore((s) => s.selectedControlId);
  const targetNodeId = useSimulationStore((s) => s.targetNodeId);
  const applyControl = useSimulationStore((s) => s.applyControl);
  const simTime = useSimulationStore((s) => s.simTime);

  const lastEvent = replay.resolvedEvents[replay.resolvedEvents.length - 1];
  const pulseId =
    lastEvent && lastEvent.event.at <= simTime
      ? (lastEvent.event.target ?? lastEvent.event.source)
      : null;

  const nodes: Node[] = useMemo(
    () =>
      replay.nodes.map((n) => ({
        id: n.id,
        type: "host",
        position: n.position,
        data: { node: n, pulse: n.id === pulseId },
        selected: targetNodeId === n.id,
      })),
    [replay.nodes, pulseId, targetNodeId],
  );

  const edges: Edge[] = useMemo(
    () =>
      scenario.edges.map((e) => {
        const sourceNode = replay.nodes.find((n) => n.id === e.source);
        const targetNode = replay.nodes.find((n) => n.id === e.target);
        const hot =
          (sourceNode?.compromise ?? 0) > 0 || (targetNode?.compromise ?? 0) > 0;
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          animated: hot,
          style: {
            stroke: hot ? "oklch(0.65 0.2 45)" : "oklch(0.55 0.1 195)",
            strokeWidth: hot ? 2.5 : 1.5,
            opacity: hot ? 0.95 : 0.45,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: hot ? "oklch(0.65 0.2 45)" : "oklch(0.55 0.1 195)",
          },
        };
      }),
    [scenario.edges, replay.nodes],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!selectedControlId) return;
      const def = CONTROL_MAP[selectedControlId];
      if (!def?.requiresTarget) return;
      const simNode = replay.nodes.find((n) => n.id === node.id);
      if (!simNode || !def.targetRoles?.includes(simNode.role)) return;
      applyControl(selectedControlId, node.id);
    },
    [selectedControlId, replay.nodes, applyControl],
  );

  return (
    <GlassPanel
      className="flex h-full min-h-[340px] flex-col"
      header={
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Network topology
            </p>
            <p className="text-sm text-foreground/90">
              {selectedControlId
                ? "Select a host to apply the chosen control"
                : "Live compromise state"}
            </p>
          </div>
          <div className="flex gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary/60" />
              Clean
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-destructive/80" />
              Hot
            </span>
          </div>
        </div>
      }
    >
      <div className="h-full min-h-[300px] w-full">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.35 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            panOnScroll
            className="bg-transparent"
          >
            <Background color="oklch(0.45 0.08 195)" gap={28} size={1} />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </GlassPanel>
  );
}
