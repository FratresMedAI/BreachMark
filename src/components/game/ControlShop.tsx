"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="border-cyan-500/20 bg-slate-900/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-cyan-100">Response controls</CardTitle>
        <CardDescription>
          {replay.creditsRemaining} / {scenario.startingCredits} credits left
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {CONTROLS.map((control) => {
          const disabled = control.cost > replay.creditsRemaining;
          const selected = selectedControlId === control.id;
          return (
            <Button
              key={control.id}
              variant={selected ? "default" : "outline"}
              className={cn(
                "h-auto flex-col items-start gap-1 border-cyan-800 py-3 text-left",
                selected && "border-cyan-400 bg-cyan-950",
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
              <span className="flex w-full items-center justify-between">
                <span className="font-medium">{control.name}</span>
                <Badge variant="secondary">{control.cost} cr</Badge>
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                {control.description}
                {control.requiresTarget && " — click a host on the graph"}
              </span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
