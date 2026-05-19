"use client";

import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EducationEntry } from "@/lib/education";
import { cn } from "@/lib/utils";

export function LearnBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[#c026d3]/40 bg-[#c026d3]/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#f0abfc]",
        className,
      )}
    >
      Learn
    </span>
  );
}

export function EduTooltip({
  entry,
  children,
  side = "top",
}: {
  entry: EducationEntry;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className="max-w-xs border-[#c026d3]/35 bg-popover/95">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-3.5 w-3.5 text-[#c026d3]" />
            <LearnBadge />
          </div>
          <p className="font-semibold text-foreground">{entry.title}</p>
          <p className="font-mono text-[11px] text-[#f0abfc]">{entry.mapping}</p>
          <p className="text-xs text-muted-foreground">{entry.body}</p>
          <p className="text-xs text-foreground/90">{entry.why}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
