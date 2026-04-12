<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ⚡ Aegis Intercept — Agent Instructions

## Project
Real-time cross-chain exploit interceptor that detects bridge hacks and flash loan attacks in <200ms using Liquify Indexer APIs. Military-grade SOC (Security Operations Center) dashboard aesthetic.

## Hackathon
**DoraHacks Liquify Indexer API Hackathon 2026** — Demonstrating sub-second anomaly detection advantage over standard RPCs.

## Structure
- `src/app/` — Next.js 16 App Router pages (dashboard, replay, API routes)
- `src/components/` — React 19 components (AlertCard, LatencyChart, ExploitReplayPlayer, etc.)
- `src/lib/` — Shared types, constants, formatting utilities, mock data generators, anomaly detection
- `db/schema.sql` — Supabase schema (4 tables: chains, alerts, benchmarks, exploits) with RLS
- `scripts/run-demo.js` — Playwright automation for demo recording
- `public/` — Logo SVG and OG image assets

## Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **Database** | Supabase (PostgreSQL + Realtime) |
| **Data Source** | Liquify Indexer APIs (primary), Public RPCs (benchmark) |
| **Testing** | Jest + React Testing Library |
| **Deploy** | Vercel |

## Key Rules
- **Frontend** = ESM (`import`), Next.js 16, React 19, Tailwind v4
- **Tests** = Jest globals (`describe`/`it`/`expect`), NOT vitest — no explicit imports needed
- **RLS** = anon key for reads, service_role key for writes
- **CI** = `npm run ci` → lint + typecheck + test:coverage (must pass 100%)
- **Build** = `npm run build` with Node.js ≥ 20.9.0
- **Colors** = Cyan (#06b6d4) for Liquify, Slate (#475569) for standard RPC, Red (#ef4444) for threats

## Critical Patterns
- All state initialization uses **lazy initializers** (not setState-in-useEffect)
- `CustomTooltip` components must be declared **outside** the render function
- Ref updates go in `useEffect`, never during render
- Unused catch variables use underscore prefix (`_err`)
