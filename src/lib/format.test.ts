/* jest globals: describe, it, expect, jest */
import { 
  formatLatency, 
  formatUsd, 
  formatBlockNumber, 
  formatTxHash, 
  formatSpeedAdvantage,
  formatRelativeTime,
  formatThroughput,
  formatUptime,
  formatSeverityEmoji,
  formatAlertType
} from './format';

describe('format utilities', () => {
  describe('formatLatency', () => {
    it('formats less than 1000ms', () => {
      expect(formatLatency(150)).toBe('150ms');
    });

    it('formats 1000ms to < 60000ms as seconds', () => {
      expect(formatLatency(1500)).toBe('1.5s');
      expect(formatLatency(59900)).toBe('59.9s');
    });

    it('formats >= 60000ms as minutes', () => {
      expect(formatLatency(60000)).toBe('1.0m');
      expect(formatLatency(150000)).toBe('2.5m');
    });

    it('handles negative values', () => {
      expect(formatLatency(-10)).toBe('0ms');
    });
  });

  describe('formatUsd', () => {
    it('formats < 1000', () => {
      expect(formatUsd(500)).toBe('$500');
    });

    it('formats thousands', () => {
      expect(formatUsd(1500)).toBe('$1.5K');
      expect(formatUsd(999900)).toBe('$999.9K');
    });

    it('formats millions', () => {
      expect(formatUsd(1500000)).toBe('$1.5M');
      expect(formatUsd(999000000)).toBe('$999.0M');
    });

    it('formats billions', () => {
      expect(formatUsd(1500000000)).toBe('$1.5B');
    });

    it('handles negative values', () => {
      expect(formatUsd(-500)).toBe('-$500');
    });
  });

  describe('formatBlockNumber', () => {
    it('formats with commas', () => {
      expect(formatBlockNumber(1000000)).toBe('1,000,000');
    });
  });

  describe('formatTxHash', () => {
    it('truncates long hashes', () => {
      expect(formatTxHash('0x1234567890abcdef1234567890abcdef')).toBe('0x1234...cdef');
    });

    it('returns short hashes as is', () => {
      expect(formatTxHash('0x1234567890')).toBe('0x1234567890');
    });
  });

  describe('formatSpeedAdvantage', () => {
    it('formats speed advantage > 1', () => {
      expect(formatSpeedAdvantage(1.5)).toBe('2x FASTER');
      expect(formatSpeedAdvantage(3.4)).toBe('3x FASTER');
    });

    it('handles 1x or less', () => {
      expect(formatSpeedAdvantage(1)).toBe('1x');
      expect(formatSpeedAdvantage(0.5)).toBe('1x');
    });
  });

  describe('formatRelativeTime', () => {
    const NOW = new Date('2023-01-01T12:00:00Z');

    it('formats "just now"', () => {
      expect(formatRelativeTime('2023-01-01T12:00:01Z', NOW)).toBe('just now');
    });

    it('formats seconds', () => {
      expect(formatRelativeTime('2023-01-01T11:59:30Z', NOW)).toBe('30s ago');
    });

    it('formats minutes', () => {
      expect(formatRelativeTime('2023-01-01T11:55:00Z', NOW)).toBe('5m ago');
    });

    it('formats hours', () => {
      expect(formatRelativeTime('2023-01-01T09:00:00Z', NOW)).toBe('3h ago');
    });

    it('formats days', () => {
      expect(formatRelativeTime('2022-12-30T12:00:00Z', NOW)).toBe('2d ago');
    });
    
    it('uses current Date when now is omitted', () => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2023-01-01T12:00:00Z'));
        expect(formatRelativeTime('2023-01-01T11:55:00Z')).toBe('5m ago');
        jest.useRealTimers();
    });
  });

  describe('formatThroughput', () => {
    it('formats throughput', () => {
      expect(formatThroughput(15.5)).toBe('16 txn/s');
    });
  });

  describe('formatUptime', () => {
    it('formats uptime', () => {
      expect(formatUptime(3600 + 120 + 5)).toBe('1h 2m 5s');
      expect(formatUptime(125)).toBe('2m 5s');
      expect(formatUptime(5)).toBe('5s');
      expect(formatUptime(-5)).toBe('0s');
    });
  });

  describe('formatSeverityEmoji', () => {
    it('returns appropriate emojis', () => {
      expect(formatSeverityEmoji('CRITICAL')).toBe('🔴');
      expect(formatSeverityEmoji('HIGH')).toBe('🟠');
      expect(formatSeverityEmoji('MEDIUM')).toBe('🟡');
      expect(formatSeverityEmoji('LOW')).toBe('⚪');
      expect(formatSeverityEmoji('UNKNOWN')).toBe('❓');
    });
  });

  describe('formatAlertType', () => {
    it('formats alert types', () => {
      expect(formatAlertType('flash_loan')).toBe('Flash Loan');
      expect(formatAlertType('liquidity_drain')).toBe('Liquidity Drain');
      expect(formatAlertType('bridge_volume_spike')).toBe('Bridge Volume Spike');
      expect(formatAlertType('whale_alert')).toBe('Whale Alert');
      expect(formatAlertType('unknown_type')).toBe('unknown_type');
    });
  });
});
