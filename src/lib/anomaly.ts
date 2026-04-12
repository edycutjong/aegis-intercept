import { Alert, Benchmark } from './types';
import { ANOMALY_THRESHOLDS } from './constants';

// ============================================================================
// Aegis Intercept — Anomaly Logic
// Utility functions for processing and analyzing alerts and benchmarks.
// ============================================================================

/**
 * Calculates the average latency over a set of benchmarks
 */
export function calculateAverageLatency(benchmarks: Benchmark[], target: 'liquify' | 'standard'): number {
  if (!benchmarks.length) return 0;
  
  const sum = benchmarks.reduce((acc, b) => {
    return acc + (target === 'liquify' ? (b.liquify_latency_ms || 0) : (b.standard_latency_ms || 0));
  }, 0);
  
  return sum / benchmarks.length;
}

/**
 * Determines if a benchmark sample represents an RPC latency spike
 */
export function isLatencySpike(benchmark: Benchmark): boolean {
  return (benchmark.standard_latency_ms || 0) >= ANOMALY_THRESHOLDS.LATENCY_SPIKE_MS;
}

/**
 * Filter alerts by minimum severity level
 */
export function filterAlertsBySeverity(alerts: Alert[], minSeverity: Alert['severity']): Alert[] {
  const ranks: Record<Alert['severity'], number> = {
    'CRITICAL': 4,
    'HIGH': 3,
    'MEDIUM': 2,
    'LOW': 1
  };
  
  const minRank = ranks[minSeverity];
  
  return alerts.filter(a => ranks[a.severity] >= minRank);
}

/**
 * Calculates the total value at risk (in USD) from a list of UNRESOLVED alerts
 */
export function calculateValueAtRisk(alerts: Alert[]): number {
  return alerts
    .filter(a => a.status === 'UNRESOLVED' && a.value_usd !== undefined)
    .reduce((acc, a) => acc + (a.value_usd || 0), 0);
}

/**
 * Identifies the top targeted contract by occurrence in recent alerts
 */
export function getTopTargetedContract(alerts: Alert[]): string | null {
  if (!alerts.length) return null;
  
  const counts: Record<string, number> = {};
  let maxCount = 0;
  let topContract = null;
  
  for (const alert of alerts) {
    if (!alert.target_contract) continue;
    
    counts[alert.target_contract] = (counts[alert.target_contract] || 0) + 1;
    if (counts[alert.target_contract] > maxCount) {
      maxCount = counts[alert.target_contract];
      topContract = alert.target_contract;
    }
  }
  
  return topContract;
}
