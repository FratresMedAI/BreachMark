# Breach Budget

**Interactive blue-team incident simulator** — spend limited response credits, scrub the attack timeline, and watch the blast radius change on a live network graph.

[![Live demo](https://img.shields.io/badge/demo-play-brightgreen?style=for-the-badge)](https://breach-budget.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> You get **12 response credits**. The attack keeps moving. Pause the timeline, spend credits, watch the blast radius shrink or spread.

![Breach Budget demo](docs/demo-preview.svg)

## What makes this different

- **Tradeoffs, not checklists** — every control costs credits; you cannot deploy everything.
- **Timeline scrub** — rewind to T+120s and ask *“what if I isolated finance 30 seconds earlier?”*
- **Deterministic engine** — pure TypeScript simulation, separated from the React UI (good for interviews).

## 30-second recruiter path

1. Open the [live demo](https://breach-budget.vercel.app).
2. Click **Play demo** → **Start incident response**.
3. Deploy **Isolate host** on `FIN-WS-04` before T+180s (or **Force password reset**).
4. Scrub the timeline and hit **Finish** → copy your scorecard for LinkedIn.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui, Tailwind CSS v4 |
| Graph | React Flow (`@xyflow/react`) |
| Motion | Framer Motion |
| State | Zustand |
| Tests | Vitest |

## Local development

```bash
git clone https://github.com/FratresMedAI/BreachMark.git
cd BreachMark
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test        # simulation engine unit tests
npm run build   # production build
```

## Architecture

```
src/lib/simulation/   ← deterministic replay engine (no React)
src/data/scenarios/   ← JSON attack timelines
src/components/game/  ← graph, timeline, controls, scorecard
src/store/            ← Zustand game state
```

See [SCENARIO_DESIGN.md](SCENARIO_DESIGN.md) for MITRE mapping and control economics.

## What I learned

- Modeling **reachability** (events cannot fire from uncompromised hosts) matters as much as listing defensive controls.
- **Deterministic replay** from T+0 makes timeline scrub trustworthy.
- Recruiters engage when outcomes change in **under 60 seconds** without reading docs.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/FratresMedAI/BreachMark)

## Topics

`blue-team` `cybersecurity` `incident-response` `nextjs` `security-awareness` `interactive`

## License

[MIT](LICENSE) — fictional scenario data only; no real systems are scanned.
