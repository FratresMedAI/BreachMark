"use client";

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import {
  Cloud,
  Laptop,
  Router,
  Server,
  type LucideIcon,
} from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { NodeRole, SimNodeState } from "@/lib/simulation/types";
import { useSimulationStore } from "@/store/simulation-store";
import { CONTROL_MAP } from "@/lib/simulation/controls";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ScanlineOverlay } from "@/components/effects/ScanlineOverlay";

const roleIcons: Record<NodeRole, LucideIcon> = {
  workstation: Laptop,
  dc: Server,
  storage: Cloud,
  gateway: Router,
};

const compromiseStyles: Record<
  number,
  { ring: string; glow: string; badge: string; pulse?: boolean }
> = {
  0: {
    ring: "border-primary/30",
    glow: "",
    badge: "bg-primary/10 text-primary",
  },
  1: {
    ring: "border-[#f59e0b]/55",
    glow: "shadow-[0_0_24px_-4px_rgba(245,158,11,0.45)]",
    badge: "bg-[#f59e0b]/15 text-[#fbbf24]",
    pulse: true,
  },
  2: {
    ring: "border-[#ff6b35]/65",
    glow: "shadow-[0_0_28px_-4px_rgba(255,107,53,0.5)]",
    badge: "bg-[#ff6b35]/15 text-[#ff9f7a]",
    pulse: true,
  },
  3: {
    ring: "border-destructive/80",
    glow: "shadow-[0_0_32px_-4px_rgba(255,107,53,0.65)]",
    badge: "bg-destructive/25 text-destructive",
    pulse: true,
  },
};

const HostNode = memo(function HostNode({ data, selected }: NodeProps) {
  const node = data.node as SimNodeState;
  const pulse = Boolean(data.pulse);
  const highlight = Boolean(data.highlight);
  const level = node.compromise;
  const style = compromiseStyles[level] ?? compromiseStyles[0];
  const Icon = roleIcons[node.role];

  return (
    <motion.div
      layout
      className={cn(
        "transition-transform duration-300",
        selected && "scale-[1.05]",
        pulse && style.pulse && "bm-pulse-ring",
      )}
    >
      <div
        className={cn(
          "relative min-w-[152px] rounded-xl border bg-card/95 px-3.5 py-3 backdrop-blur-md",
          style.ring,
          style.glow,
          highlight &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background",
          node.isolated &&
            "ring-2 ring-[#00f0ff] ring-offset-2 ring-offset-background",
        )}
      >
        <Handle
          type="target"
          position={Position.Left}
          className="!h-2.5 !w-2.5 !border-0 !bg-primary !shadow-[0_0_8px_#00f0ff]"
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
            Compromise{" "}
            <span className="font-semibold text-foreground">{level}</span>
          </p>
        )}
        <Handle
          type="source"
          position={Position.Right}
          className="!h-2.5 !w-2.5 !border-0 !bg-primary !shadow-[0_0_8px_#00f0ff]"
        />
      </div>
    </motion.div>
  );
});

const nodeTypes = { host: HostNode };

function NetworkGraphInner() {
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

  const highlightRoles = selectedControlId
    ? CONTROL_MAP[selectedControlId]?.targetRoles
    : null;

  const nodes: Node[] = useMemo(
    () =>
      replay.nodes.map((n) => ({
        id: n.id,
        type: "host",
        position: n.position,
        data: {
          node: n,
          pulse: n.id === pulseId,
          highlight:
            highlightRoles?.includes(n.role) && selectedControlId != null,
        },
        selected: targetNodeId === n.id,
      })),
    [
      replay.nodes,
      pulseId,
      targetNodeId,
      highlightRoles,
      selectedControlId,
    ],
  );

  const edges: Edge[] = useMemo(
    () =>
      scenario.edges.map((e) => {
        const sourceNode = replay.nodes.find((n) => n.id === e.source);
        const targetNode = replay.nodes.find((n) => n.id === e.target);
        const hot =
          (sourceNode?.compromise ?? 0) > 0 ||
          (targetNode?.compromise ?? 0) > 0;
        const color = hot ? "#ff6b35" : "#00f0ff";
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          animated: hot,
          style: {
            stroke: color,
            strokeWidth: hot ? 2.5 : 1.75,
            opacity: hot ? 0.95 : 0.55,
            strokeDasharray: hot ? "8 4" : undefined,
            animation: hot ? "bm-edge-flow 1s linear infinite" : undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
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
      glow
      className="relative flex h-full min-h-[340px] flex-col"
      header={
        <div className="flex items-center justify-between">
          <div>
            <p className="bm-tactical-label">Network topology</p>
            <p className="text-sm text-foreground/90">
              {selectedControlId
                ? "Select a host to apply the chosen control"
                : "Live compromise state"}
            </p>
          </div>
          <div className="flex gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#00f0ff]" />
              Clean
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-destructive shadow-[0_0_8px_#ff6b35]" />
              Hot
            </span>
          </div>
        </div>
      }
    >
      <div className="relative h-full min-h-[300px] w-full">
        <ScanlineOverlay className="rounded-b-2xl" />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.35 }}
          minZoom={0.4}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          panOnScroll
          className="bg-transparent"
        >
          <Background color="#00f0ff" gap={28} size={1} />
          <Controls showInteractive={false} position="bottom-right" />
          <MiniMap
            nodeColor={() => "rgba(0, 240, 255, 0.5)"}
            maskColor="rgba(0, 240, 255, 0.08)"
            className="!bottom-3 !left-3"
            pannable
            zoomable
          />
        </ReactFlow>
      </div>
    </GlassPanel>
  );
}

export function NetworkGraph() {
  return (
    <ReactFlowProvider>
      <NetworkGraphInner />
    </ReactFlowProvider>
  );
}
