"use client";

import { motion } from "framer-motion";
import { Code2, Play, Shield, UserRound, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ScanlineOverlay } from "@/components/effects/ScanlineOverlay";
import { HeroGraphPreview } from "@/components/game/HeroGraphPreview";
import { useSimulationStore } from "@/store/simulation-store";

const features = [
  {
    icon: Zap,
    title: "Credit tradeoffs",
    body: "Every control has a cost. You cannot deploy the full playbook.",
  },
  {
    icon: Shield,
    title: "Timeline rewind",
    body: "Scrub to T+120s and test earlier defensive decisions.",
  },
  {
    icon: Play,
    title: "Live blast radius",
    body: "Watch compromise spread across the graph in real time.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function LandingHero() {
  const setPhase = useSimulationStore((s) => s.setPhase);

  return (
    <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2">
          <HeroGraphPreview />
        </div>
        <ScanlineOverlay />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div>
          <motion.div variants={item} className="mb-8">
            <BrandLogo size="hero" glow priority className="mb-6" />
            <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Breach
              <span className="bm-text-gradient">Mark</span>
            </h1>
            <p className="mt-4 text-xl font-medium tracking-tight text-primary sm:text-2xl">
              Simulate. Respond. Get Marked.
            </p>
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Twelve response credits. A live attack timeline. A network graph that
            reacts when you pause the breach and deploy controls.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bm-glow-cyan h-12 rounded-xl px-8 text-base font-semibold"
              onClick={() => setPhase("briefing")}
            >
              <Play className="mr-2 h-5 w-5" />
              Launch Simulator
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-primary/25 bg-card/30 backdrop-blur-sm"
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
              className="h-12 rounded-xl border-primary/25 bg-card/30 backdrop-blur-sm"
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
          </motion.div>

          <motion.ul
            variants={container}
            className="mt-14 grid gap-4 sm:grid-cols-3"
          >
            {features.map((f) => (
              <motion.li
                key={f.title}
                variants={item}
                className="bm-panel group rounded-xl p-4 transition-shadow hover:bm-glow-cyan"
              >
                <f.icon className="mb-2 h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div variants={item} className="relative">
          <GlassPanel glow variant="hud" className="relative p-5">
            <ScanlineOverlay className="rounded-2xl" />
            <div className="relative z-10">
              <p className="bm-tactical-label text-primary/80">SOC preview</p>
              <p className="mt-1 font-mono text-sm text-foreground">
                Monday Morning Phish
              </p>
              <div className="my-4 h-36 rounded-lg border border-primary/15 bg-background/40 p-2">
                <HeroGraphPreview />
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <PreviewStat label="Credits" value="7 / 12" accent />
                <PreviewStat label="MTTD" value="62s" />
                <PreviewStat label="Hosts lost" value="1" warn />
                <PreviewStat label="Exfil" value="0 rec" accent />
              </div>
              <Button
                className="bm-glow-cyan mt-4 w-full rounded-xl"
                onClick={() => setPhase("briefing")}
              >
                Launch Simulator
              </Button>
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PreviewStat({
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
    <div className="rounded-lg border border-border/40 bg-background/30 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`float-right font-semibold ${
          warn ? "text-[#f59e0b]" : accent ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
