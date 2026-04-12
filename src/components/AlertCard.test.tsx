import { render, screen } from '@testing-library/react';
import { AlertCard } from './AlertCard';
import { Alert } from '@/lib/types';

describe('AlertCard', () => {
  const sampleAlert: Alert = {
    id: 'test-1',
    chainId: 'ethereum',
    type: 'whale_alert',
    severity: 'HIGH',
    timestamp: new Date().toISOString(),
    latency_ms: 45,
    status: 'UNRESOLVED',
    description: 'Suspicious token transfer volume',
    tx_hash: '0x1A2B3C4D5E6F1A2B3C4D5E6F',
  };

  it('renders alert information correctly', () => {
    render(<AlertCard alert={sampleAlert} />);

    // Check description is rendered
    expect(screen.getByText('Suspicious token transfer volume')).toBeInTheDocument();
    // Check severity badge
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    // Check alert type is formatted
    expect(screen.getByText('Whale Alert')).toBeInTheDocument();
  });

  it('adjusts visuals for critical threats', () => {
    const criticalAlert: Alert = {
      ...sampleAlert,
      type: 'liquidity_drain',
      severity: 'CRITICAL',
    };
    render(<AlertCard alert={criticalAlert} />);

    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('Liquidity Drain')).toBeInTheDocument();
  });
});
