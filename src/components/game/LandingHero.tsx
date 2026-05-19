"use client";

import { motion } from "framer-motion";
import { Shield, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSimulationStore } from "@/store/simulation-store";

export function LandingHero() {
  const setPhase = useSimulationStore((s) => s.setPhase);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1 text-sm text-cyan-300"
      >
        <Shield className="h-4 w-4" />
        Interactive blue-team simulator
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl text-5xl font-black tracking-tight text-slate-50 sm:text-6xl"
      >
        Breach{" "}
        <span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
          Budget
        </span>
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-6 max-w-xl text-lg text-slate-400"
      >
        You get 12 response credits. The attack keeps moving. Pause the timeline,
        spend credits, and watch the blast radius shrink or spread.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-col gap-3 sm:flex-row"
      >
        <Button
          size="lg"
          className="bg-cyan-600 px-8 hover:bg-cyan-500"
          onClick={() => setPhase("briefing")}
        >
          <Play className="mr-2 h-5 w-5" />
          Play demo
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-cyan-700"
          asChild
        >
          <a
            href="https://github.com/FratresMedAI/BreachMark"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source
          </a>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-cyan-700"
          asChild
        >
          <a
            href="https://www.linkedin.com/in/kyle-bean-fratresxai/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </Button>
      </motion.div>

      <ul className="mt-16 grid max-w-2xl gap-4 text-left text-sm text-slate-400 sm:grid-cols-3">
        <li className="rounded-lg border border-cyan-900/50 bg-slate-900/50 p-4">
          <strong className="text-cyan-300">Tradeoffs</strong>
          <br />
          Every control costs credits — you cannot do everything.
        </li>
        <li className="rounded-lg border border-cyan-900/50 bg-slate-900/50 p-4">
          <strong className="text-cyan-300">Timeline scrub</strong>
          <br />
          Rewind and ask &quot;what if I acted 30s earlier?&quot;
        </li>
        <li className="rounded-lg border border-cyan-900/50 bg-slate-900/50 p-4">
          <strong className="text-cyan-300">Live blast radius</strong>
          <br />
          Network graph shows compromise spread in real time.
        </li>
      </ul>
    </motion.section>
  );
}
