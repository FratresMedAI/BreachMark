"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { EducationEntry } from "@/lib/education";
import { LearnBadge } from "./EduTooltip";

export function ConceptPopover({
  entry,
  onClose,
}: {
  entry: EducationEntry | null;
  onClose: () => void;
}) {
  if (!entry) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-[#c026d3]/30 bg-background/95 p-4 shadow-[0_0_34px_rgba(192,38,211,0.24)] backdrop-blur-xl sm:left-auto sm:right-4 sm:w-[360px]"
      role="dialog"
      aria-label="Learning explanation"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <LearnBadge />
        <Button variant="ghost" size="sm" className="h-7 rounded-lg" onClick={onClose}>
          Close
        </Button>
      </div>
      <p className="font-semibold text-foreground">{entry.title}</p>
      <p className="mt-1 font-mono text-xs text-[#f0abfc]">{entry.mapping}</p>
      <p className="mt-2 text-sm text-muted-foreground">{entry.body}</p>
      <p className="mt-2 rounded-xl border border-[#c026d3]/20 bg-[#c026d3]/10 px-3 py-2 text-xs text-foreground/90">
        {entry.why}
      </p>
    </motion.aside>
  );
}
