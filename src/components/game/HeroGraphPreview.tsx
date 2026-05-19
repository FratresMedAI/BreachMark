"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "a", x: 40, y: 80, label: "FIN-WS" },
  { id: "b", x: 140, y: 40, label: "DC-01" },
  { id: "c", x: 140, y: 120, label: "S3" },
  { id: "d", x: 220, y: 80, label: "Edge" },
];

const edges = [
  ["a", "b"],
  ["b", "c"],
  ["a", "d"],
];

export function HeroGraphPreview() {
  return (
    <svg
      viewBox="0 0 280 160"
      className="h-full w-full opacity-70"
      aria-hidden
    >
      <defs>
        <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d946ef" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {edges.map(([from, to], i) => {
        const a = nodes.find((n) => n.id === from)!;
        const b = nodes.find((n) => n.id === to)!;
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="url(#edgeGlow)"
            strokeWidth="2"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 0.85, strokeDashoffset: [0, -20] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.1 }}
        >
          <circle
            cx={n.x}
            cy={n.y}
            r="22"
            fill="rgba(10,10,14,0.85)"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />
          <circle
            cx={n.x}
            cy={n.y}
            r="28"
            fill="none"
            stroke="rgba(0,240,255,0.25)"
            strokeWidth="1"
          />
          <text
            x={n.x}
            y={n.y + 4}
            textAnchor="middle"
            fill="#f0f9ff"
            fontSize="9"
            fontFamily="var(--font-geist-mono), monospace"
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
