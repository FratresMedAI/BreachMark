"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Play, Shield, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useSimulationStore } from "@/store/simulation-store";

const features = [
  {
    title: "Credit tradeoffs",
    body: "Every control has a cost. You cannot deploy the full playbook.",
  },
  {
    title: "Timeline rewind",
    body: "Scrub to T+120s and test earlier defensive decisions.",
  },
  {
    title: "Live blast radius",
    body: "Watch compromise spread across the graph in real time.",
  },
];

export function LandingHero() {
  const setPhase = useSimulationStore((s) => s.setPhase);

  return (
    <section className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col justify-center px-6 py-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-4 w-4" />
            Interactive blue-team simulator
          </div>

          <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Breach
            <span className="bm-text-gradient">Mark</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Twelve response credits. A live attack timeline. A network graph that
            reacts when you pause the breach and deploy controls.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bm-glow-primary h-12 rounded-xl px-8 text-base font-semibold"
              onClick={() => setPhase("briefing")}
            >
              <Play className="mr-2 h-5 w-5" />
              Start simulation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border/80 bg-card/30 backdrop-blur-sm"
              asChild
            >
              <a
                href="https://github.com/FratresMedAI/BreachMark"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 className="mr-2 h-4 w-4" />
                Source
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-border/80 bg-card/30 backdrop-blur-sm"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/kyle-bean-fratresxai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <UserRound className="mr-2 h-4 w-4" />
                LinkedIn
              </a>
            </Button>
          </div>

          <ul className="mt-14 grid gap-4 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.li
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="bm-panel rounded-xl p-4"
              >
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="relative flex flex-col items-center gap-6"
        >
          <BrandLogo size="hero" glow priority className="mx-auto" />
          <GlassPanel className="relative w-full p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Live preview
                </p>
                <p className="font-mono text-sm text-foreground">
                  Monday Morning Phish
                </p>
              </div>
              <span className="rounded-md bg-primary/15 px-2 py-1 font-mono text-xs text-primary">
                T+240s
              </span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <PreviewRow label="Credits" value="7 / 12" accent />
              <PreviewRow label="MTTD" value="62s" />
              <PreviewRow label="Hosts lost" value="1" warn />
              <PreviewRow label="Exfil" value="0 records" accent />
            </div>
            <div className="mt-4 flex h-28 items-end gap-1 rounded-lg border border-border/50 bg-background/40 p-3">
              {[35, 48, 62, 55, 72, 40, 28, 18, 12, 8].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-primary/20 to-primary/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <Button
              className="mt-4 w-full rounded-xl"
              variant="secondary"
              onClick={() => setPhase("briefing")}
            >
              Enter scenario
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewRow({
  label,
  value,
  accent,
  warn,
}: {
  label: string;
  value: string;
  accent?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex justify-between rounded-lg bg-background/30 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          warn
            ? "text-[oklch(0.8_0.14_75)]"
            : accent
              ? "text-primary"
              : "text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
