import { 
  generateMockAlert, 
  generateMockAlerts, 
  generateMockBenchmark, 
  generateMockBenchmarkHistory, 
  generateMockChains 
} from './mock-data';

describe('mock-data', () => {
  describe('generateMockAlert', () => {
    it('generates a valid alert', () => {
      const alert = generateMockAlert();
      expect(alert.id).toBeDefined();
      expect(alert.timestamp).toBeDefined();
    });

    it('respects overrides', () => {
      const alert = generateMockAlert({ id: 'test-id', severity: 'CRITICAL' });
      expect(alert.id).toBe('test-id');
      expect(alert.severity).toBe('CRITICAL');
    });
  });

  describe('generateMockAlerts', () => {
    it('generates specified number of alerts', () => {
      const alerts = generateMockAlerts(5);
      expect(alerts.length).toBe(5);
    });
  });

  describe('generateMockBenchmark', () => {
    it('generates benchmark with given timestamp', () => {
      const timestamp = '2023-01-01T00:00:00Z';
      const benchmark = generateMockBenchmark(timestamp);
      expect(benchmark.timestamp).toBe(timestamp);
      expect(benchmark.liquify_latency_ms).toBeLessThan(benchmark.standard_latency_ms || Number.MAX_SAFE_INTEGER);
    });

    it('respects overrides', () => {
      const benchmark = generateMockBenchmark('ts', { chain_id: '56' });
      expect(benchmark.chain_id).toBe('56');
    });
  });

  describe('generateMockBenchmarkHistory', () => {
    it('generates history', () => {
      const history = generateMockBenchmarkHistory(10);
      expect(history.length).toBe(11); // points + 1
    });

    it('generates history with default point size', () => {
      // should probably return `MAX_BENCHMARK_HISTORY + 1` entries
      const history = generateMockBenchmarkHistory();
      expect(history.length).toBeGreaterThan(0);
    });
  });

  describe('generateMockChains', () => {
    it('generates 4 chains by default', () => {
      const chains = generateMockChains();
      expect(chains.length).toBe(4);
      expect(chains.map(c => c.id)).toEqual(['1', '56', '42161', '137']);
    });
  });
});
