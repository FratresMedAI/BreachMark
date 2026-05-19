"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CONTROL_ICONS } from "@/lib/control-icons";
import { CONTROLS } from "@/lib/simulation/controls";
import { cn } from "@/lib/utils";
import { useSimulationStore } from "@/store/simulation-store";
import { X } from "lucide-react";

export function ControlShop() {
  const selectedControlId = useSimulationStore((s) => s.selectedControlId);
  const selectControl = useSimulationStore((s) => s.selectControl);
  const applyControl = useSimulationStore((s) => s.applyControl);
  const replay = useSimulationStore((s) => s.replay);
  const scenario = useSimulationStore((s) => s.scenario);

  return (
    <GlassPanel
      variant="hud"
      header={
        <>
          <p className="bm-tactical-label">Response controls</p>
          <p className="mt-1 font-mono text-lg text-foreground">
            {replay.creditsRemaining}
            <span className="text-muted-foreground">
              {" "}
              / {scenario.startingCredits} credits
            </span>
          </p>
        </>
      }
    >
      <ul className="grid gap-3 p-3">
        {CONTROLS.map((control, index) => {
          const disabled = control.cost > replay.creditsRemaining;
          const selected = selectedControlId === control.id;
          const affordable = !disabled;
          const Icon = CONTROL_ICONS[control.id];
          const disabledReason = disabled
            ? "Insufficient credits"
            : null;

          const button = (
            <Button
              variant="ghost"
              className={cn(
                "group/control relative h-auto w-full justify-start gap-3 overflow-hidden rounded-xl border border-primary/15 bg-background/35 px-3 py-3 text-left transition-all hover:border-primary/45 hover:bg-primary/10",
                selected &&
                  "border-primary/60 bg-primary/10 shadow-[inset_0_0_24px_-12px_rgba(0,240,255,0.65),0_0_22px_rgba(0,240,255,0.18)]",
                disabled && "opacity-40 hover:border-destructive/50 hover:bg-destructive/10",
              )}
              disabled={disabled}
              aria-label={`${control.name}, costs ${control.cost} credits`}
              onClick={() => {
                if (control.requiresTarget) {
                  selectControl(selected ? null : control.id);
                } else {
                  applyControl(control.id);
                }
              }}
            >
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover/control:opacity-100">
                <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              </span>
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                  selected
                    ? "border-primary/40 bg-primary/25 text-primary"
                    : "border-primary/10 bg-muted/80 text-muted-foreground",
                )}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {control.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "shrink-0 border border-primary/20 bg-primary/10 font-mono text-[10px] text-primary",
                      affordable && "bm-pulse-ring",
                      disabled && "border-destructive/30 bg-destructive/15 text-destructive",
                    )}
                  >
                    {control.cost} cr
                  </Badge>
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  {control.description}
                  {control.requiresTarget && " — click a host on the graph"}
                </span>
              </span>
              {disabled && (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-destructive/40 bg-destructive/20 text-destructive">
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <kbd className="hidden shrink-0 rounded border border-border/60 px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
                {index + 1}
              </kbd>
            </Button>
          );

          return (
            <li key={control.id}>
              {disabled && disabledReason ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block">{button}</span>
                  </TooltipTrigger>
                  <TooltipContent>{disabledReason}</TooltipContent>
                </Tooltip>
              ) : (
                button
              )}
            </li>
          );
        })}
      </ul>
    </GlassPanel>
  );
}
