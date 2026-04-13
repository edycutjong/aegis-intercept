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

  it('renders HIGH severity alerts', () => {
    render(<AlertCard alert={{ ...sampleAlert, severity: 'HIGH' }} />);
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('handles unknown alert types and missing hashes', () => {
    const incompleteAlert: Alert = {
      id: 'a2',
      severity: 'LOW',
      status: 'UNRESOLVED',
      timestamp: new Date().toISOString(),
      description: 'Test',
      // missing type/alertType, value_usd, target_contract, txHash/tx_hash
    };
    render(<AlertCard alert={incompleteAlert} />);
    expect(screen.getByText('unknown')).toBeInTheDocument();
    // Empty hash simply returns ''
  });

  it('renders correctly for resolved alerts', () => {
    const { container } = render(<AlertCard alert={{ ...sampleAlert, status: 'MITIGATED' }} />);
    // Check for opacity/class change
    expect(screen.getByText('Whale Alert')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('opacity-60');
  });

  it('renders medium severity', () => {
    render(<AlertCard alert={{...sampleAlert, severity: 'MEDIUM'}} />);
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  it('renders low severity', () => {
    render(<AlertCard alert={{...sampleAlert, severity: 'LOW'}} />);
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('renders unknown severity fallback', () => {
    // Cast to bypass type checking for testing the default switch case
    render(<AlertCard alert={{...sampleAlert, severity: 'UNKNOWN' as unknown as Alert['severity']}} />);
    expect(screen.getByText('UNKNOWN')).toBeInTheDocument();
  });
});
