import { 
  APP_CONFIG, 
  ANOMALY_THRESHOLDS, 
  COLORS, 
  SUPPORTED_CHAINS,
  MAX_BENCHMARK_HISTORY,
  MAX_RECENT_ALERTS
} from './constants';

describe('constants', () => {
  it('exports APP_CONFIG', () => {
    expect(APP_CONFIG).toBeDefined();
    expect(APP_CONFIG.NAME).toBe('Aegis Intercept');
  });

  it('exports ANOMALY_THRESHOLDS', () => {
    expect(ANOMALY_THRESHOLDS).toBeDefined();
  });

  it('exports COLORS', () => {
    expect(COLORS).toBeDefined();
  });

  it('exports SUPPORTED_CHAINS', () => {
    expect(SUPPORTED_CHAINS).toContain('1');
  });

  it('exports numbers', () => {
    expect(MAX_BENCHMARK_HISTORY).toBeGreaterThan(0);
    expect(MAX_RECENT_ALERTS).toBeGreaterThan(0);
  });
});
