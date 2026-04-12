import { 
  isChain, 
  isAlert, 
  isBenchmark 
} from './types';

describe('types', () => {
  describe('isChain', () => {
    it('returns true for a valid chain', () => {
      expect(isChain({
        id: 'ethereum',
        name: 'Ethereum',
        chainId: 1,
        status: 'HEALTHY',
        latestBlock: 100,
        txnsPerSecond: 15,
      })).toBe(true);
    });

    it('returns false for an invalid chain', () => {
      expect(isChain(null)).toBe(false);
      expect(isChain({})).toBe(false);
      // Valid ChainIds are 'ethereum', 'arbitrum', 'base', 'bnb' — '1' is not valid
      expect(isChain({ id: '1', name: 'Ethereum', chainId: 1, status: 'HEALTHY', latestBlock: 100, txnsPerSecond: 15 })).toBe(false);
    });
  });

  describe('isAlert', () => {
    it('returns true for a valid alert', () => {
      expect(isAlert({
        id: 'a1',
        chainId: 'ethereum',
        alertType: 'flash_loan',
        severity: 'HIGH',
        timestamp: '2023-01-01T00:00:00Z',
        txHash: '0x123',
        valueUsd: 100000,
        blockNumber: 19000000,
        detectionLatencyMs: 45,
        isSimulation: false,
        description: 'Test',
        status: 'UNRESOLVED',
      })).toBe(true);
    });

    it('returns false for an invalid alert', () => {
      expect(isAlert(null)).toBe(false);
      expect(isAlert({ id: 'a1', chainId: 'ethereum', alertType: 'flash_loan', severity: 'INVALID' })).toBe(false);
    });
  });

  describe('isBenchmark', () => {
    it('returns true for a valid benchmark', () => {
      expect(isBenchmark({
        id: 'b1',
        chainId: 'ethereum',
        liquifyLatencyMs: 100,
        rpcLatencyMs: 200,
        speedAdvantageX: 2.0,
        blockNumber: 19000000,
        timestamp: '2023-01-01T00:00:00Z',
      })).toBe(true);
    });

    it('returns false for an invalid benchmark', () => {
      expect(isBenchmark(null)).toBe(false);
      expect(isBenchmark({})).toBe(false);
      expect(isBenchmark({
        id: 'b1',
        chainId: '1', // not a valid ChainId
        liquifyLatencyMs: 100,
        rpcLatencyMs: 200,
        speedAdvantageX: 2.0,
        blockNumber: 19000000,
      })).toBe(false);
    });
  });
});
