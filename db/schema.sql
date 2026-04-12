-- 🛡️ AegisIntercept — Database Schema (Supabase/PostgreSQL)
-- Run this in Supabase SQL Editor to set up the database
-- Matches ARCHITECTURE.md specification

-- ═══════════════════════════════════════════════════
-- Chain connection status and metadata
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.chains (
  id TEXT PRIMARY KEY,                          -- 'ethereum', 'arbitrum', 'base', 'bnb'
  name TEXT NOT NULL,
  chain_id INTEGER NOT NULL,
  rpc_url TEXT NOT NULL,                        -- Liquify API endpoint
  benchmark_rpc_url TEXT NOT NULL,              -- Standard public RPC for comparison
  status TEXT DEFAULT 'connecting'
    CHECK (status IN ('connected', 'connecting', 'disconnected')),
  latest_block BIGINT DEFAULT 0,
  txns_per_second NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════
-- Detected anomaly alerts
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_id TEXT REFERENCES public.chains(id),
  alert_type TEXT NOT NULL
    CHECK (alert_type IN ('flash_loan', 'liquidity_drain', 'bridge_volume_spike', 'whale_alert')),
  severity TEXT NOT NULL
    CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
  value_usd NUMERIC(20,2),                     -- Estimated value involved
  tx_hash TEXT,                                 -- Transaction hash that triggered alert
  block_number BIGINT,
  detection_latency_ms INTEGER NOT NULL,        -- Time from block to detection (via Liquify)
  rpc_latency_ms INTEGER,                       -- Time the standard RPC took for same block
  speed_advantage_x NUMERIC(5,1),               -- liquify_ms / rpc_ms ratio
  details JSONB DEFAULT '{}',                   -- Additional alert-specific data
  response_actions JSONB DEFAULT '[]',          -- Actions taken (simulated)
  is_simulation BOOLEAN DEFAULT false,          -- Whether this is a replay/simulation
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════
-- Latency benchmark samples for split-screen chart
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.benchmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_id TEXT REFERENCES public.chains(id),
  liquify_latency_ms INTEGER NOT NULL,
  rpc_latency_ms INTEGER NOT NULL,
  speed_advantage_x NUMERIC(5,1) GENERATED ALWAYS AS (
    CASE WHEN liquify_latency_ms > 0
      THEN rpc_latency_ms::NUMERIC / liquify_latency_ms
      ELSE 0
    END
  ) STORED,
  block_number BIGINT,
  sample_type TEXT DEFAULT 'live'
    CHECK (sample_type IN ('live', 'simulation')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════
-- Historical exploit replay definitions
-- ═══════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.exploits (
  id TEXT PRIMARY KEY,                          -- 'wormhole-2022', 'ronin-2022', 'custom-demo'
  name TEXT NOT NULL,
  description TEXT,
  chain_origin TEXT NOT NULL,
  chain_destination TEXT,
  value_stolen_usd NUMERIC(20,2),
  date_original TIMESTAMPTZ,
  replay_script JSONB NOT NULL,                 -- Sequence of simulated transactions
  aegis_detection_estimate_ms INTEGER,          -- How fast Aegis would have caught it
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_alerts_chain ON public.alerts(chain_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON public.alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON public.alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_benchmarks_chain ON public.benchmarks(chain_id);
CREATE INDEX IF NOT EXISTS idx_benchmarks_created ON public.benchmarks(created_at DESC);

-- ═══════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════
ALTER TABLE public.chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exploits ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key via dashboard)
CREATE POLICY "Public read chains" ON public.chains FOR SELECT USING (true);
CREATE POLICY "Public read alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Public read benchmarks" ON public.benchmarks FOR SELECT USING (true);
CREATE POLICY "Public read exploits" ON public.exploits FOR SELECT USING (true);

-- Service role full access (engine/ingestion uses service_role key)
CREATE POLICY "Service write chains" ON public.chains FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service write alerts" ON public.alerts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service write benchmarks" ON public.benchmarks FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service write exploits" ON public.exploits FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════════════════
-- Auto-update updated_at trigger for chains
-- ═══════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_chains
  BEFORE UPDATE ON public.chains
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════
-- Seed data: Supported chains
-- ═══════════════════════════════════════════════════
INSERT INTO public.chains (id, name, chain_id, rpc_url, benchmark_rpc_url, status) VALUES
  ('ethereum', 'Ethereum',  1,     'https://eth.liquify.com/v1', 'https://eth.llamarpc.com',     'connected'),
  ('arbitrum', 'Arbitrum',  42161, 'https://arb.liquify.com/v1', 'https://arb1.arbitrum.io/rpc', 'connected'),
  ('base',     'Base',      8453,  'https://base.liquify.com/v1','https://mainnet.base.org',     'connected'),
  ('bnb',      'BNB Chain', 56,    'https://bnb.liquify.com/v1', 'https://bsc-dataseed.binance.org', 'connected')
ON CONFLICT (id) DO NOTHING;
