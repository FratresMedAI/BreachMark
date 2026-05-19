"use client";

import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { glossary } from "@/lib/education";
import { LearnBadge } from "./EduTooltip";

export function GlossaryModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-4 left-4 z-30 rounded-xl border border-[#c026d3]/35 bg-[#c026d3]/20 text-[#f0abfc] hover:bg-[#c026d3]/30">
          <BookOpen className="mr-2 h-4 w-4" />
          Glossary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[82vh] overflow-y-auto border-[#c026d3]/30 bg-background/95 sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <LearnBadge />
            <DialogTitle>Cybersecurity Glossary</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid gap-2 sm:grid-cols-2">
          {glossary.map(([term, definition, link]) => (
            <a
              key={term}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-primary/10 bg-background/45 p-3 transition hover:border-[#c026d3]/50 hover:bg-[#c026d3]/10"
            >
              <p className="font-semibold text-foreground">{term}</p>
              <p className="mt-1 text-xs text-muted-foreground">{definition}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#f0abfc]">
                MITRE / NIST reference
              </p>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
