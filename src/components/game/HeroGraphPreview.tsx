"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "a", x: 40, y: 80, label: "FIN-WS", hot: true },
  { id: "b", x: 140, y: 40, label: "DC-01", hot: false },
  { id: "c", x: 140, y: 120, label: "S3", hot: false },
  { id: "d", x: 220, y: 80, label: "EDGE", hot: false },
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
          <stop offset="100%" stopColor="#c026d3" stopOpacity="0.5" />
        </linearGradient>
        <filter id="nodeBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
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
          <rect
            x={n.x - 28}
            y={n.y - 16}
            width="56"
            height="32"
            rx="7"
            fill="rgba(17,17,19,0.88)"
            stroke={n.hot ? "#ff3b5c" : "#00f0ff"}
            strokeWidth="1.5"
            filter="url(#nodeBlur)"
          />
          <rect
            x={n.x - 35}
            y={n.y - 22}
            width="70"
            height="44"
            rx="9"
            fill="none"
            stroke={n.hot ? "rgba(255,59,92,0.28)" : "rgba(0,240,255,0.24)"}
            strokeWidth="1"
          />
          <text
            x={n.x}
            y={n.y + 4}
            textAnchor="middle"
            fill="#f0f0f0"
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
