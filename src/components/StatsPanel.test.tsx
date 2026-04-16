import { render, screen } from '@testing-library/react';
import { StatsPanel } from './StatsPanel';

describe('StatsPanel', () => {
  it('renders all metrics correctly', () => {
    render(
      <StatsPanel
        totalSecured={1500000}
        activeThreats={3}
        averageLatencyAdvantage={42.5}
        uptime={99.9}
      />
    );

    // Value Secured — formatUsd(1500000) returns "$1.5M"
    expect(screen.getByText('Value Secured')).toBeInTheDocument();
    expect(screen.getByText('$1.5M')).toBeInTheDocument();

    // Active Threats
    expect(screen.getByText('Active Threats')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    // Avg Advantage — Math.round(42.5) = 43
    expect(screen.getByText('Avg Advantage')).toBeInTheDocument();
    expect(screen.getByText('43')).toBeInTheDocument();

    // System Uptime
    expect(screen.getByText('System Uptime')).toBeInTheDocument();
    expect(screen.getByText(/99\.9%/)).toBeInTheDocument();
  });
});
