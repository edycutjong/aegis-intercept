import { Alert, Benchmark, Chain } from './types';
import { MAX_BENCHMARK_HISTORY } from './constants';

// ============================================================================
// Aegis Intercept — Mock Data Generator
// Factories to safely generate mock data for Phase 1 (Demo First architecture).
// ============================================================================

const MOCK_TX_HASHES = [
  '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  '0xdeadbeef1234567890abcdef1234567890abcdef',
  '0x0987654321fedcba0987654321fedcba09876543',
];

const MOCK_TARGETS = [
  'Uniswap V3 Router',
  'Aave V3 Pool',
  'Curve 3Pool',
  'Lido Staking',
  'WETH Gateway',
];

// Seedable PRNG for consistent mock generation in tests
let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function randomInt(min: number, max: number) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/**
 * Generate a randomized mock Alert
 */
export function generateMockAlert(override?: Partial<Alert>): Alert {
  const severities: Alert['severity'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  const types = ['flash_loan', 'liquidity_drain', 'bridge_volume_spike', 'whale_alert'];

  return {
    id: `alert-${Date.now()}-${randomInt(1000, 9999)}`,
    chain_id: randomItem(['1', '56', '42161', '137']),
    type: randomItem(types),
    severity: randomItem(severities),
    timestamp: new Date().toISOString(),
    tx_hash: randomItem(MOCK_TX_HASHES),
    target_contract: randomItem(MOCK_TARGETS),
    value_usd: random() * 1_000_000,
    latency_ms: randomInt(50, 1500),
    liquify_advantage_ms: randomInt(100, 500),
    description: `Detected anomalous behavior matching ${randomItem(types)} signature.`,
    status: randomItem(['UNRESOLVED', 'MITIGATED', 'IGNORED']),
    ...override,
  };
}

/**
 * Generate a list of recent alerts
 */
export function generateMockAlerts(count: number): Alert[] {
  return Array.from({ length: count }, () => generateMockAlert());
}

/**
 * Generate a randomized mock Benchmark sample
 */
export function generateMockBenchmark(timestamp: string, override?: Partial<Benchmark>): Benchmark {
  const standard_latency = randomInt(100, 800);
  // Liquify is consistently faster in the demo
  const liquify_latency = standard_latency * (0.2 + random() * 0.4); 

  return {
    timestamp,
    chain_id: '1',
    liquify_latency_ms: liquify_latency,
    standard_latency_ms: standard_latency,
    difference_ms: standard_latency - liquify_latency,
    speed_factor: standard_latency / liquify_latency,
    ...override,
  };
}

/**
 * Generate historical benchmark data for a chart
 */
export function generateMockBenchmarkHistory(points: number = MAX_BENCHMARK_HISTORY): Benchmark[] {
  const history: Benchmark[] = [];
  const now = Date.now();
  
  for (let i = points; i >= 0; i--) {
    // 500ms intervals
    const ts = new Date(now - i * 500).toISOString();
    history.push(generateMockBenchmark(ts));
  }
  
  return history;
}

/**
 * Generate mock chain statuses
 */
export function generateMockChains(): Chain[] {
  return [
    {
      id: '1',
      name: 'Ethereum',
      status: 'HEALTHY',
      latest_block: 19430123 + randomInt(1, 10),
      tps: randomInt(10, 20),
      last_updated: new Date().toISOString()
    },
    {
      id: '56',
      name: 'BNB Chain',
      status: 'HEALTHY',
      latest_block: 36712345 + randomInt(1, 10),
      tps: randomInt(100, 300),
      last_updated: new Date().toISOString()
    },
    {
      id: '42161',
      name: 'Arbitrum',
      status: 'DEGRADED',
      latest_block: 182345678 + randomInt(1, 10),
      tps: randomInt(50, 150),
      last_updated: new Date().toISOString()
    },
    {
      id: '137',
      name: 'Polygon',
      status: 'HEALTHY',
      latest_block: 54321098 + randomInt(1, 10),
      tps: randomInt(30, 80),
      last_updated: new Date().toISOString()
    }
  ];
}
