// ============================================================================
// Aegis Intercept — Constants
// Configuration, thresholds, and UI tokens.
// ============================================================================

export const APP_CONFIG = {
  NAME: 'Aegis Intercept',
  VERSION: '1.0.0',
  REFRESH_INTERVAL_MS: 500, // Global poll rate for updates
};

export const ANOMALY_THRESHOLDS = {
  LATENCY_SPIKE_MS: 1500,
  THROUGHPUT_DROP_PCT: 30, // 30% drop in throughput
  HIGH_VALUE_TX_USD: 50_000,
  CRITICAL_VALUE_TX_USD: 1_000_000,
};

// Colors mapped to severity and status for Tailwind usage
// Note: We use Hex here to easily pass into Recharts
export const COLORS = {
  // Severity
  CRITICAL: '#ef4444', // red-500
  HIGH: '#f97316',     // orange-500
  MEDIUM: '#eab308',   // yellow-500
  LOW: '#64748b',      // slate-500
  
  // Status
  HEALTHY: '#22c55e',  // green-500
  DEGRADED: '#eab308', // yellow-500
  DOWN: '#ef4444',     // red-500

  // Brand
  PRIMARY: '#3b82f6',  // blue-500
  LIQUIFY: '#06b6d4',  // cyan-500 (Liquify RPC branding)
  STANDARD: '#94a3b8', // slate-400 (Standard RPC)
};

// Supported chains in the demo
export const SUPPORTED_CHAINS = [
  '1',     // Ethereum
  '56',    // BSC
  '42161', // Arbitrum
  '137',   // Polygon
] as const;

export type SupportedChainId = typeof SUPPORTED_CHAINS[number];

export const MAX_BENCHMARK_HISTORY = 50; // How many data points to show in charts
export const MAX_RECENT_ALERTS = 20;
