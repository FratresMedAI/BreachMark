"use client";

import { motion } from "framer-motion";
import { Code2, Play, Radar, Shield, UserRound, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ScanlineOverlay } from "@/components/effects/ScanlineOverlay";
import { HeroGraphPreview } from "@/components/game/HeroGraphPreview";
import { useSimulationStore } from "@/store/simulation-store";

const features = [
  {
    icon: Zap,
    title: "Credit tradeoffs",
    body: "Each control costs credits—experiment and see what changes on the graph.",
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
    <section className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col justify-center overflow-hidden px-4 py-12 sm:px-6 lg:py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bm-grid absolute inset-0 opacity-80" />
        <div className="bm-particles absolute inset-0 opacity-80" />
        <div className="bm-scanlines absolute inset-0" />
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[760px] -translate-x-1/2 -translate-y-1/2 opacity-45 blur-[0.2px]">
          <HeroGraphPreview />
        </div>
        <ScanlineOverlay />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="bm-hero-frame relative overflow-hidden p-5 backdrop-blur-sm sm:p-8 lg:p-10"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div variants={item} className="mb-8">
            <h1 className="relative inline-block font-display text-6xl font-black leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              Breach<span className="bm-text-gradient">Mark</span>
              <span className="absolute -bottom-3 left-1 h-1 w-[78%] rounded-full bg-primary shadow-[0_0_24px_#00f0ff]" />
            </h1>
            <p className="mt-7 font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Simulate. <span className="text-accent drop-shadow-[0_0_12px_rgba(192,38,211,0.75)]">Spend credits.</span>{" "}
              Get Marked.
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
              <span className="text-primary">SYS.ONLINE</span>
              <span className="hidden text-border sm:inline">|</span>
              <span className="text-accent">DEFCON · SIM</span>
              <span className="hidden text-border sm:inline">|</span>
              <span>CREDITS: 15</span>
            </p>
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Fifteen response credits. Two gateway attacks. Scrub the timeline and
            learn which controls matter at each stage.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bm-glow-cyan bm-pulse-ring h-12 rounded-xl px-8 text-base font-semibold"
              onClick={() => setPhase("briefing")}
              aria-label="Launch BreachMark simulator"
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
                className="bm-panel bm-neon-hover group rounded-xl p-4"
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
            <ScanlineOverlay className="rounded-xl" />
            <div className="relative z-10">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="bm-tactical-label text-primary/80">SOC preview</p>
                  <p className="mt-1 font-mono text-sm text-foreground">
                    Monday Morning Phish
                  </p>
                </div>
                <Radar className="h-5 w-5 text-primary drop-shadow-[0_0_10px_#00f0ff]" />
              </div>
              <div className="my-4 h-44 rounded-xl border border-primary/15 bg-background/40 p-2">
                <HeroGraphPreview />
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <PreviewStat label="Credits" value="5 / 12" accent />
                <PreviewStat label="MTTD" value="90s" />
                <PreviewStat label="Hosts lost" value="2" warn />
                <PreviewStat label="Exfil" value="0 rec" accent />
              </div>
              <Button
                className="bm-glow-cyan mt-4 w-full rounded-xl"
                onClick={() => setPhase("briefing")}
                aria-label="Launch BreachMark simulator from SOC preview"
              >
                Launch Simulator
              </Button>
            </div>
          </GlassPanel>
        </motion.div>
        </div>
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
