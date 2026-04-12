import { render, screen, fireEvent } from '@testing-library/react';
import { ThreatResponsePanel } from './ThreatResponsePanel';
import { Alert } from '@/lib/types';

describe('ThreatResponsePanel', () => {
  const mockAlert: Alert = {
    id: '123',
    chainId: 'ethereum',
    type: 'liquidity_drain',
    severity: 'CRITICAL',
    timestamp: new Date().toISOString(),
    latency_ms: 120,
    status: 'UNRESOLVED',
    description: 'Flash loan attack pattern detected',
    value_usd: 48200000,
    target_contract: '0xDeadBeef1234567890',
    liquify_advantage_ms: 300,
  };

  it('renders waiting state when no critical alert is active', () => {
    render(<ThreatResponsePanel criticalAlert={null} onPause={jest.fn()} onMigrate={jest.fn()} />);
    expect(screen.getByText('No active threats require manual intervention.')).toBeInTheDocument();
  });

  it('renders critical alert details correctly', () => {
    render(<ThreatResponsePanel criticalAlert={mockAlert} onPause={jest.fn()} onMigrate={jest.fn()} />);

    expect(screen.getByText('Threat Block Detected')).toBeInTheDocument();
    expect(screen.getByText('Intervention Required')).toBeInTheDocument();
  });

  it('triggers action callbacks when buttons are clicked', () => {
    const handlePause = jest.fn();
    const handleMigrate = jest.fn();

    render(
      <ThreatResponsePanel
        criticalAlert={mockAlert}
        onPause={handlePause}
        onMigrate={handleMigrate}
      />
    );

    // Match actual button text from the component
    const pauseButton = screen.getByRole('button', { name: /front-run & pause contract/i });
    const migrateButton = screen.getByRole('button', { name: /migrate capital safely/i });

    fireEvent.click(pauseButton);
    expect(handlePause).toHaveBeenCalledWith('123');

    fireEvent.click(migrateButton);
    expect(handleMigrate).toHaveBeenCalledWith('123');
  });
});
