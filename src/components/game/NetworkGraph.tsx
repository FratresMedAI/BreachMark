"use client";

import {
  Background,
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
import { motion } from "framer-motion";
import {
  Cloud,
  Laptop,
  Router,
  Server,
  type LucideIcon,
} from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { NodeRole, SimNodeState } from "@/lib/simulation/types";
import { useSimulationStore } from "@/store/simulation-store";
import { CONTROL_MAP } from "@/lib/simulation/controls";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    ring: "border-primary/55",
    glow: "shadow-[0_0_25px_rgba(0,240,255,0.28)]",
    badge: "bg-primary/10 text-primary",
  },
  1: {
    ring: "border-[#fbbf24]/70",
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.32)]",
    badge: "bg-[#fbbf24]/15 text-[#fbbf24]",
    pulse: true,
  },
  2: {
    ring: "border-destructive/75",
    glow: "shadow-[0_0_25px_rgba(255,59,92,0.4)]",
    badge: "bg-destructive/15 text-destructive",
    pulse: true,
  },
  3: {
    ring: "border-destructive/80",
    glow: "shadow-[0_0_25px_#ff3b5c]",
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
  const blastRadius = level === 0 ? "Contained surface" : `${level + 1} linked host risk`;
  const creditCost = data.creditCost as number | undefined;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          layout
          animate={pulse ? { scale: [1, 1.06, 1], filter: ["brightness(1)", "brightness(1.45)", "brightness(1)"] } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "transition-transform duration-300 ease-out",
            selected && "scale-[1.05]",
            pulse && style.pulse && "bm-pulse-ring",
          )}
          aria-label={`${node.label} ${node.role} compromise level ${level}`}
        >
          <div
            className={cn(
              "relative min-w-[168px] rounded-xl border-2 bg-card/95 px-3.5 py-3 backdrop-blur-md",
              style.ring,
              style.glow,
              "shadow-[inset_0_0_24px_rgba(0,240,255,0.04)]",
              highlight &&
                "ring-2 ring-primary ring-offset-2 ring-offset-background",
              node.isolated &&
                "ring-2 ring-[#22ff88] ring-offset-2 ring-offset-background",
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
                <span className="text-[9px] font-semibold uppercase tracking-widest text-[#22ff88]">
                  Isolated
                </span>
              )}
            </div>
            <p className="font-mono text-sm font-semibold tracking-tight text-foreground">
              {node.label}
            </p>
            <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
              Blast radius:{" "}
              <span className="font-semibold text-foreground">{blastRadius}</span>
            </p>
            <Handle
              type="source"
              position={Position.Right}
              className="!h-2.5 !w-2.5 !border-0 !bg-primary !shadow-[0_0_8px_#00f0ff]"
            />
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="space-y-1">
        <p className="font-semibold text-foreground">Blast radius preview</p>
        <p className="font-mono text-primary">{node.label} · level {level}</p>
        <p className="text-muted-foreground">
          {creditCost ? `${creditCost} credits to deploy selected control here.` : "Select a response control to preview credit cost."}
        </p>
      </TooltipContent>
    </Tooltip>
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
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setInitializing(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  const lastEvent = replay.resolvedEvents[replay.resolvedEvents.length - 1];
  const pulseId =
    lastEvent && lastEvent.event.at <= simTime
      ? (lastEvent.event.target ?? lastEvent.event.source)
      : null;

  const highlightRoles = selectedControlId
    ? CONTROL_MAP[selectedControlId]?.targetRoles
    : null;
  const selectedControlCost = selectedControlId
    ? CONTROL_MAP[selectedControlId]?.cost
    : undefined;
  const metrics = replay.metrics;
  const exfilPct = Math.min(100, (metrics.recordsExfiltrated / 29800) * 100);

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
          creditCost: selectedControlCost,
        },
        selected: targetNodeId === n.id,
      })),
    [
      replay.nodes,
      pulseId,
      targetNodeId,
      highlightRoles,
      selectedControlId,
      selectedControlCost,
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
        const color = hot ? "#ff3b5c" : "#00f0ff";
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          animated: hot,
          style: {
            stroke: color,
            strokeWidth: hot ? 2.75 : 1.75,
            opacity: hot ? 0.95 : 0.55,
            strokeDasharray: "8 4",
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
      className="relative flex h-full min-h-0 flex-col"
      header={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="bm-tactical-label">Network topology</p>
            <p className="text-sm text-foreground/90">
              {selectedControlId
                ? "Select a host to apply the chosen control"
                : "Live compromise state"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <InlineHudStat
              label="MTTD"
              value={metrics.mttd !== null ? `${metrics.mttd}s` : "Never"}
              tone="text-primary"
            />
            <InlineHudStat
              label="Hosts"
              value={String(metrics.hostsCompromised)}
              tone="text-[#ffb020]"
            />
            <InlineHudStat
              label="Contained"
              value={`${metrics.eventsContained}/${scenario.events.length}`}
              tone="text-accent"
            />
            <div className="hidden min-w-28 rounded-lg border border-destructive/15 bg-background/35 px-2 py-1.5 xl:block">
              <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                <span>Exfil</span>
                <span className="text-destructive">
                  {metrics.recordsExfiltrated.toLocaleString()}
                </span>
              </div>
              <Progress
                value={exfilPct}
                className="h-1 bg-muted/40 [&_[data-slot=progress-indicator]]:bg-destructive"
              />
            </div>
            <div className="flex gap-2 pl-1 text-[9px] uppercase tracking-wider text-muted-foreground">
              <LegendDot label="Clean" className="bg-primary shadow-[0_0_8px_#00f0ff]" />
              <LegendDot label="Safe" className="bg-[#22ff88] shadow-[0_0_8px_#22ff88]" />
              <LegendDot label="Hot" className="bg-destructive shadow-[0_0_8px_#ff3b5c]" />
            </div>
          </div>
        </div>
      }
    >
      <div className="relative h-full min-h-0 w-full overflow-hidden rounded-b-xl">
        <div className="bm-grid pointer-events-none absolute inset-0 z-0 opacity-70" />
        <div className="bm-scanlines pointer-events-none absolute inset-0 z-10 opacity-60" />
        {initializing && (
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center bg-background/60 backdrop-blur-sm">
            <div className="w-64 rounded-xl border border-primary/20 bg-card/70 p-4">
              <div className="bm-skeleton mb-3 h-3 rounded" />
              <div className="bm-skeleton h-20 rounded-xl" />
              <p className="mt-3 font-mono text-xs text-primary">
                Initializing graph telemetry...
              </p>
            </div>
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.1 }}
          minZoom={0.25}
          maxZoom={1.1}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          className="dark h-full min-h-[240px] bg-[#0a0a0a]"
        >
          <Background color="#00f0ff" gap={28} size={1} />
        </ReactFlow>
      </div>
    </GlassPanel>
  );
}

function InlineHudStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="min-w-20 rounded-lg border border-primary/15 bg-background/35 px-2 py-1.5">
      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className={cn("font-mono text-sm font-semibold leading-tight", tone)}>
        {value}
      </p>
    </div>
  );
}

function LegendDot({ label, className }: { label: string; className: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={cn("h-2 w-2 rounded-full", className)} />
      {label}
    </span>
  );
}

export function NetworkGraph() {
  return (
    <ReactFlowProvider>
      <NetworkGraphInner />
    </ReactFlowProvider>
  );
}
