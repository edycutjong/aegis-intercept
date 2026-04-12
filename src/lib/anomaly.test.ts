import { 
  calculateAverageLatency, 
  isLatencySpike, 
  filterAlertsBySeverity, 
  calculateValueAtRisk,
  getTopTargetedContract
} from './anomaly';
import { Benchmark, Alert } from './types';
import { ANOMALY_THRESHOLDS } from './constants';

describe('anomaly logic', () => {
  const mockBenchmarks: Benchmark[] = [
    { timestamp: '1', chain_id: '1', liquify_latency_ms: 10, standard_latency_ms: 100, difference_ms: 90, speed_factor: 10 },
    { timestamp: '2', chain_id: '1', liquify_latency_ms: 20, standard_latency_ms: 200, difference_ms: 180, speed_factor: 10 },
  ];

  describe('calculateAverageLatency', () => {
    it('returns 0 for empty array', () => {
      expect(calculateAverageLatency([], 'liquify')).toBe(0);
    });

    it('calculates liquify average', () => {
      expect(calculateAverageLatency(mockBenchmarks, 'liquify')).toBe(15);
    });

    it('calculates standard average', () => {
      expect(calculateAverageLatency(mockBenchmarks, 'standard')).toBe(150);
    });

    it('falls back to 0 for missing latency values', () => {
      const missingData = [{ timestamp: '3', chain_id: '1' } as Benchmark];
      expect(calculateAverageLatency(missingData, 'liquify')).toBe(0);
      expect(calculateAverageLatency(missingData, 'standard')).toBe(0);
    });
  });

  describe('isLatencySpike', () => {
    it('returns true if over threshold', () => {
      expect(isLatencySpike({
         timestamp: '1', chain_id: '1', liquify_latency_ms: 10, standard_latency_ms: ANOMALY_THRESHOLDS.LATENCY_SPIKE_MS + 100, difference_ms: 0, speed_factor: 0 
      })).toBe(true);
    });

    it('returns false if under threshold', () => {
      expect(isLatencySpike({
         timestamp: '1', chain_id: '1', liquify_latency_ms: 10, standard_latency_ms: 100, difference_ms: 0, speed_factor: 0 
      })).toBe(false);
    });

    it('returns false for missing latency values', () => {
      expect(isLatencySpike({
         timestamp: '1', chain_id: '1'
      } as Benchmark)).toBe(false);
    });
  });

  describe('filterAlertsBySeverity', () => {
    const alerts: Pick<Alert, 'severity'>[] = [
      { severity: 'CRITICAL' },
      { severity: 'HIGH' },
      { severity: 'MEDIUM' },
      { severity: 'LOW' }
    ];

    it('filters CRITICAL', () => {
      const filtered = filterAlertsBySeverity(alerts as Alert[], 'CRITICAL');
      expect(filtered.length).toBe(1);
      expect(filtered[0].severity).toBe('CRITICAL');
    });

    it('filters HIGH', () => {
      const filtered = filterAlertsBySeverity(alerts as Alert[], 'HIGH');
      expect(filtered.length).toBe(2);
    });

    it('filters MEDIUM', () => {
      const filtered = filterAlertsBySeverity(alerts as Alert[], 'MEDIUM');
      expect(filtered.length).toBe(3);
    });

    it('filters LOW', () => {
      const filtered = filterAlertsBySeverity(alerts as Alert[], 'LOW');
      expect(filtered.length).toBe(4);
    });
  });

  describe('calculateValueAtRisk', () => {
    const alerts: Partial<Alert>[] = [
      { status: 'UNRESOLVED', value_usd: 1000 },
      { status: 'UNRESOLVED', value_usd: 2000 },
      { status: 'MITIGATED', value_usd: 5000 }, // should be ignored
      { status: 'UNRESOLVED' }, // missing value
    ];

    it('calculates total value of unresolved alerts', () => {
      expect(calculateValueAtRisk(alerts as Alert[])).toBe(3000);
    });

    it('falls back to 0 when value_usd is 0', () => {
      expect(calculateValueAtRisk([{ status: 'UNRESOLVED', value_usd: 0 } as Alert])).toBe(0);
    });
  });

  describe('getTopTargetedContract', () => {
    const alerts: Partial<Alert>[] = [
      { target_contract: 'A' },
      { target_contract: 'B' },
      { target_contract: 'A' },
      { target_contract: undefined }, // missing
    ];

    it('returns null for empty array', () => {
      expect(getTopTargetedContract([])).toBe(null);
    });

    it('returns the most frequent target', () => {
      expect(getTopTargetedContract(alerts as Alert[])).toBe('A');
    });
  });
});
