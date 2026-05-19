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
import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { SimNodeState } from "@/lib/simulation/types";
import { useSimulationStore } from "@/store/simulation-store";
import { CONTROL_MAP } from "@/lib/simulation/controls";

const compromiseColors: Record<number, string> = {
  0: "border-cyan-500/40 bg-slate-900",
  1: "border-amber-500/60 bg-amber-950/40",
  2: "border-orange-500/70 bg-orange-950/50",
  3: "border-red-500 bg-red-950/60",
};

function HostNode({ data, selected }: NodeProps) {
  const node = data.node as SimNodeState;
  const pulse = Boolean(data.pulse);
  const level = node.compromise;

  return (
    <div className={cn(selected && "scale-105", pulse && "animate-pulse")}>
      <div
        className={cn(
          "min-w-[120px] rounded-lg border-2 px-3 py-2 shadow-lg transition-colors",
          compromiseColors[level] ?? compromiseColors[0],
          node.isolated &&
            "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950",
        )}
      >
        <Handle type="target" position={Position.Left} className="!bg-cyan-500" />
        <div className="text-[10px] uppercase tracking-wider text-cyan-300/80">
          {node.role}
        </div>
        <div className="font-mono text-sm font-semibold text-slate-100">
          {node.label}
        </div>
        {node.isolated && (
          <div className="mt-1 text-[10px] font-medium text-cyan-300">ISOLATED</div>
        )}
        {level > 0 && (
          <div className="mt-1 text-[10px] text-amber-200">Compromise L{level}</div>
        )}
        <Handle type="source" position={Position.Right} className="!bg-cyan-500" />
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
            stroke: hot ? "#f97316" : "#22d3ee",
            strokeWidth: hot ? 2 : 1,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: hot ? "#f97316" : "#22d3ee",
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
    <div className="h-full min-h-[320px] w-full rounded-xl border border-cyan-500/20 bg-slate-950/80">
      <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnScroll
        className="bg-transparent"
      >
        <Background color="#164e63" gap={20} size={1} />
        <Controls className="!border-cyan-800 !bg-slate-900" />
      </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
