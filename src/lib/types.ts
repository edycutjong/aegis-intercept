// ============================================================================
// Aegis Intercept — Core Type Definitions
// All interfaces from the ARCHITECTURE.md specification
// ============================================================================

// ---------------------------------------------------------------------------
// Enums / Union Types
// ---------------------------------------------------------------------------

export const CHAIN_IDS = ['ethereum', 'arbitrum', 'base', 'bnb'] as const;
export type ChainId = (typeof CHAIN_IDS)[number];

export const CHAIN_STATUSES = ['connected', 'connecting', 'disconnected', 'HEALTHY', 'DEGRADED', 'OFFLINE'] as const;
export type ChainStatus = (typeof CHAIN_STATUSES)[number] | string;

export const ALERT_TYPES = ['flash_loan', 'liquidity_drain', 'bridge_volume_spike', 'whale_alert'] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const SEVERITY_LEVELS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
export type Severity = (typeof SEVERITY_LEVELS)[number];

export const RESPONSE_ACTION_TYPES = [
  'bridge_pause',
  'address_flag',
  'notification_sent',
  'emergency_multisig',
] as const;
export type ResponseActionType = (typeof RESPONSE_ACTION_TYPES)[number];

export const RESPONSE_STATUSES = ['sent', 'confirmed', 'failed'] as const;
export type ResponseStatus = (typeof RESPONSE_STATUSES)[number];

export const SAMPLE_TYPES = ['live', 'simulation'] as const;
export type SampleType = (typeof SAMPLE_TYPES)[number];

// ---------------------------------------------------------------------------
// Core Interfaces
// ---------------------------------------------------------------------------

export interface Chain {
  id?: ChainId | string;
  name: string;
  chainId?: number;
  status: ChainStatus;
  latestBlock?: number;
  latest_block?: number;
  txnsPerSecond?: number;
  txns_per_second?: number;
  tps?: number;
  last_updated?: string;
}

export interface ResponseAction {
  type: ResponseActionType;
  status: ResponseStatus;
  target: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  chain_id?: string;
  chainId?: ChainId | string;
  alertType?: AlertType;
  type?: string;
  severity: Severity;
  valueUsd?: number;
  value_usd?: number;
  txHash?: string;
  tx_hash?: string;
  blockNumber?: number;
  detectionLatencyMs?: number;
  latency_ms?: number;
  liquify_advantage_ms?: number;
  description?: string;
  target_contract?: string;
  status?: 'UNRESOLVED' | 'MITIGATED' | 'IGNORED';
  rpcLatencyMs?: number | null;
  speedAdvantageX?: number;
  responseActions?: ResponseAction[];
  isSimulation?: boolean;
  createdAt?: string;
  timestamp: string;
}

export interface Benchmark {
  id?: string;
  chain_id?: string;
  chainId?: ChainId | string;
  liquifyLatencyMs?: number;
  liquify_latency_ms?: number;
  rpcLatencyMs?: number;
  standard_latency_ms?: number;
  difference_ms?: number;
  speedAdvantageX?: number;
  speed_factor?: number;
  blockNumber?: number;
  sampleType?: SampleType;
  createdAt?: string;
  timestamp: string;
}

export interface AggregateStats {
  totalAlertsDetected: number;
  criticalAlerts: number;
  avgDetectionLatencyMs: number;
  fastestDetectionMs: number;
  avgSpeedAdvantage: number;
  totalValueProtected: number;
  chainsMonitored: number;
  uptimeSeconds: number;
}

export interface Exploit {
  id: string;
  name: string;
  description: string;
  chainOrigin: ChainId;
  chainDestination: ChainId | null;
  valueStolenUsd: number;
  dateOriginal: string;
  aegisDetectionEstimateMs: number;
}

// ---------------------------------------------------------------------------
// Type Guards
// ---------------------------------------------------------------------------

export function isChainId(value: unknown): value is ChainId {
  return typeof value === 'string' && (CHAIN_IDS as readonly string[]).includes(value);
}

export function isChainStatus(value: unknown): value is ChainStatus {
  return typeof value === 'string' && (CHAIN_STATUSES as readonly string[]).includes(value);
}

export function isAlertType(value: unknown): value is AlertType {
  return typeof value === 'string' && (ALERT_TYPES as readonly string[]).includes(value);
}

export function isSeverity(value: unknown): value is Severity {
  return typeof value === 'string' && (SEVERITY_LEVELS as readonly string[]).includes(value);
}

export function isResponseActionType(value: unknown): value is ResponseActionType {
  return typeof value === 'string' && (RESPONSE_ACTION_TYPES as readonly string[]).includes(value);
}

export function isResponseStatus(value: unknown): value is ResponseStatus {
  return typeof value === 'string' && (RESPONSE_STATUSES as readonly string[]).includes(value);
}

export function isSampleType(value: unknown): value is SampleType {
  return typeof value === 'string' && (SAMPLE_TYPES as readonly string[]).includes(value);
}

export function isChain(value: unknown): value is Chain {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isChainId(obj.id) &&
    typeof obj.name === 'string' &&
    typeof obj.chainId === 'number' &&
    isChainStatus(obj.status) &&
    typeof obj.latestBlock === 'number' &&
    typeof obj.txnsPerSecond === 'number'
  );
}

export function isAlert(value: unknown): value is Alert {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    isChainId(obj.chainId) &&
    isAlertType(obj.alertType) &&
    isSeverity(obj.severity) &&
    typeof obj.valueUsd === 'number' &&
    typeof obj.txHash === 'string' &&
    typeof obj.blockNumber === 'number' &&
    typeof obj.detectionLatencyMs === 'number' &&
    typeof obj.isSimulation === 'boolean'
  );
}

export function isBenchmark(value: unknown): value is Benchmark {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    isChainId(obj.chainId) &&
    typeof obj.liquifyLatencyMs === 'number' &&
    typeof obj.rpcLatencyMs === 'number' &&
    typeof obj.speedAdvantageX === 'number' &&
    typeof obj.blockNumber === 'number'
  );
}
