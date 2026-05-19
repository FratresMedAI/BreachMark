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
      <ul className="grid gap-2 p-3">
        {CONTROLS.map((control, index) => {
          const disabled = control.cost > replay.creditsRemaining;
          const selected = selectedControlId === control.id;
          const Icon = CONTROL_ICONS[control.id];
          const disabledReason = disabled
            ? `Need ${control.cost} credits (${replay.creditsRemaining} left)`
            : null;

          const button = (
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-all hover:bg-background/50",
                selected &&
                  "border-primary/50 bg-primary/10 shadow-[inset_0_0_24px_-12px_rgba(0,240,255,0.4)]",
                disabled && "opacity-40",
              )}
              disabled={disabled}
              onClick={() => {
                if (control.requiresTarget) {
                  selectControl(selected ? null : control.id);
                } else {
                  applyControl(control.id);
                }
              }}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-primary/25 text-primary"
                    : "bg-muted/80 text-muted-foreground",
                )}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium text-foreground">
                    {control.name}
                  </span>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {control.cost} cr
                  </Badge>
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  {control.description}
                  {control.requiresTarget && " — click a host on the graph"}
                </span>
              </span>
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
