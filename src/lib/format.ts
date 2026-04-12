// ============================================================================
// Aegis Intercept — Formatting Utilities
// Human-readable formatters for latency, USD values, block numbers, etc.
// ============================================================================

/**
 * Format a latency value in milliseconds to a human-readable string.
 * - Values < 1000ms: "142ms"
 * - Values >= 1000ms: "4.8s"
 * - Values >= 60000ms: "1.2m"
 */
export function formatLatency(ms: number): string {
  if (ms < 0) return '0ms';
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Format a USD value with abbreviation.
 * - Values < 1000: "$500"
 * - Values < 1,000,000: "$48.2K"
 * - Values < 1,000,000,000: "$48.2M"
 * - Values >= 1,000,000,000: "$2.5B"
 */
export function formatUsd(value: number): string {
  if (value < 0) return '-' + formatUsd(-value);
  if (value < 1000) return `$${Math.round(value)}`;
  if (value < 1_000_000) return `$${(value / 1_000).toFixed(1)}K`;
  if (value < 1_000_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${(value / 1_000_000_000).toFixed(1)}B`;
}

/**
 * Format a block number with commas: 18234567 → "18,234,567"
 */
export function formatBlockNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Truncate a transaction hash: "0x1a2b3c...9f8e" (first 6 + last 4)
 */
export function formatTxHash(hash: string): string {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

/**
 * Format speed advantage as "34x FASTER"
 */
export function formatSpeedAdvantage(x: number): string {
  if (x <= 1) return '1x';
  return `${Math.round(x)}x FASTER`;
}

/**
 * Format a relative time string from an ISO date.
 * Returns "12s ago", "5m ago", "2h ago", "3d ago"
 */
export function formatRelativeTime(isoDate: string, now?: Date): string {
  const target = new Date(isoDate);
  const reference = now ?? new Date();
  const diffMs = reference.getTime() - target.getTime();

  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Format throughput: 142 → "142 txn/s"
 */
export function formatThroughput(tps: number): string {
  return `${Math.round(tps)} txn/s`;
}

/**
 * Format uptime seconds to human readable: "4h 23m 17s"
 */
export function formatUptime(seconds: number): string {
  if (seconds < 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
}

/**
 * Format a severity level to an emoji prefix.
 */
export function formatSeverityEmoji(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return '🔴';
    case 'HIGH':
      return '🟠';
    case 'MEDIUM':
      return '🟡';
    case 'LOW':
      return '⚪';
    default:
      return '❓';
  }
}

/**
 * Format alert type to human-readable label.
 */
export function formatAlertType(type: string): string {
  switch (type) {
    case 'flash_loan':
      return 'Flash Loan';
    case 'liquidity_drain':
      return 'Liquidity Drain';
    case 'bridge_volume_spike':
      return 'Bridge Volume Spike';
    case 'whale_alert':
      return 'Whale Alert';
    default:
      return type;
  }
}
