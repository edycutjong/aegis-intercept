<p align="center">
  <img src="public/logo.png" alt="Aegis Intercept Logo" width="120" />
</p>

<h1 align="center">🛡️ Aegis Intercept</h1>
<p align="center"><strong>Zero-Block Exploit Interceptor</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61dafb?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Realtime-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Jest-100%25%20Coverage-C21325?logo=jest" alt="Jest" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
</p>

> Real-time cross-chain exploit interceptor that catches bridge hacks in <200ms — with a live split-screen proving Liquify is **30× faster** than standard RPCs.

Aegis Intercept is a high-performance, multi-chain security dashboard built for the **[Liquify Indexer API Hackathon](https://dorahacks.io/hackathon/liquify)**. It continuously monitors 4 blockchains via Liquify's sub-second indexer, runs heuristic anomaly detection, and fires defensive responses — all faster than a human blink.

---

## 🎯 Problem

**$2.5 billion** stolen from cross-chain bridges since 2022 — Wormhole ($326M), Ronin ($625M), Nomad ($190M). Every single hack shares the same root cause:

> The monitoring infrastructure was **5–30 seconds too slow.**

Attackers exploit bridges in seconds. Standard RPCs take 5–30 seconds to index the malicious block. By the time anyone notices, the stolen funds have been bridged, swapped, and tumbled across three chains.

## 💡 Solution

**Aegis Intercept** shifts the equation: sub-200ms detection across 4 chains, powered by Liquify's indexer.

**Key features:**
- **Multi-Chain Threat Matrix** — Unified alert dashboard across Ethereum, BNB Chain, Arbitrum, and Polygon
- **Split-Screen Latency Benchmark** — Live, real-time chart comparing standard RPC latency vs Liquify Indexer API latency. Not a static chart — continuous live proof
- **Autonomous Response Controls** — Front-run pausing and capital migration controls for rapid incident response
- **Exploit Replay Player** — Replay famous hacks (Wormhole, Ronin) and see how fast Aegis would have caught them
- **100% Core Test Coverage** — Deterministic alert analysis logic fully covered with Jest

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Next.js 16 App Router                   │
├──────────────────┬───────────────────────────────────────┤
│  Command Center  │  4-chain status indicators            │
│                  │  Split-screen benchmark (Recharts)    │
│                  │  Live threat feed + severity pills     │
│                  │  Aggregate stats (animated counters)   │
├──────────────────┼───────────────────────────────────────┤
│  Replay Player   │  Historical exploit timeline scrubber │
│                  │  "Original: 4 hours vs Aegis: 142ms"  │
├──────────────────┼───────────────────────────────────────┤
│  API Routes      │  /api/alerts — threat detection       │
│                  │  /api/benchmark — latency comparison  │
│                  │  /api/simulate — exploit replay       │
│                  │  /api/chains — multi-chain status     │
├──────────────────┼───────────────────────────────────────┤
│  Data Layer      │  Supabase Realtime (push alerts)      │
│                  │  viem (EVM chain interaction)         │
│                  │  Recharts (latency visualization)     │
└──────────────────┴───────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer       | Technology                           |
| ----------- | ------------------------------------ |
| Framework   | Next.js 16.2.3 (App Router)          |
| UI          | React 19.2.4                         |
| Styling     | Tailwind CSS v4 + CSS custom props   |
| Animations  | Framer Motion 12                     |
| Charts      | Recharts 3.8                         |
| Blockchain  | viem 2.47 (EVM chain data)           |
| Backend     | Supabase (Realtime push + storage)   |
| Testing     | Jest + Testing Library (100% cov)    |
| CI/CD       | GitHub Actions (lint + typecheck + test) |
| Language    | TypeScript 5                         |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.9.0
- **npm** ≥ 10

### Installation

```bash
git clone https://github.com/edycutjong/aegis-intercept.git
cd aegis-intercept

# Install dependencies
npm ci

# Configure environment
cp .env.example .env.local
# Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js 16 local dev server |
| `npm run build` | Compile for production (Vercel optimized) |
| `npm run lint` | ESLint with Next.js 16 rules |
| `npm run typecheck` | Full TypeScript validation |
| `npm run test` | Unit tests (Jest) |
| `npm run test:coverage` | Coverage report (target: 100%) |

---

## 📁 Project Structure

```
aegis-intercept/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── alerts/       # Threat detection API
│   │   │   ├── benchmark/    # Latency comparison API
│   │   │   ├── chains/       # Multi-chain status API
│   │   │   └── simulate/     # Exploit replay API
│   │   ├── replay/           # Exploit replay player page
│   │   ├── globals.css       # Design tokens + animations
│   │   ├── layout.tsx        # Root layout with metadata
│   │   └── page.tsx          # Main command center dashboard
│   ├── components/           # React components
│   └── lib/                  # Utility functions + detection rules
├── .github/
│   └── workflows/ci.yml      # CI: lint + typecheck + 100% coverage
├── jest.config.js
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🎨 Demo Flow

1. **Command Center** — Dark-mode security operations center with 4 green chain status indicators
2. **Split-Screen Benchmark** — Watch Liquify's data stream update in real-time at 142ms while the standard RPC lags at 4,820ms. Gold "34× FASTER" badge pulses
3. **Trigger Exploit** — Simulate a flash-loan liquidity drain on the Ethereum fork
4. **RED ALERT** — Dashboard explodes red: "⚠️ EXPLOIT DETECTED" with 147ms detection latency
5. **Response Waterfall** — "Bridge Pause Sent at T+312ms" timeline cascades
6. **Replay** — Load the Wormhole hack replay: "Original detection: ~4 hours. Aegis: 142ms."

---

## 🏆 Hackathon Context

**Competition:** [Liquify Indexer API Hackathon](https://dorahacks.io/hackathon/liquify)  
**Track:** Speed & Multi-chain Functionality  
**Core Thesis:** Speed isn't just a feature — it's a **security primitive.** The difference between 200ms and 7 seconds isn't "slightly faster" — it's the difference between catching an attacker and losing $50M.

### Why Liquify Should Care

The split-screen benchmark isn't just a feature — it's **marketing collateral** for Liquify. The visual proof that Liquify catches exploits while standard RPCs are still processing the previous block is something Liquify can use in their next investor pitch.

---

## 📹 Demo

> 🎥 [Watch Demo Video](#) | 🌐 [Live Demo](#)

---

## 📄 License

MIT © 2026 [Edy Cu](https://github.com/edycutjong)
