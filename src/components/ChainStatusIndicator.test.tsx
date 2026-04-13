import { render, screen } from '@testing-library/react';
import { ChainStatusIndicator } from './ChainStatusIndicator';
import { Chain } from '@/lib/types';

describe('ChainStatusIndicator', () => {
  const mockChain: Chain = {
    id: 'ethereum',
    name: 'Ethereum',
    chainId: 1,
    status: 'connected',
    latest_block: 15000000,
    txns_per_second: 12.5,
  };

  it('renders standard chain information', () => {
    render(<ChainStatusIndicator chain={mockChain} />);
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('ID:ethereum')).toBeInTheDocument();
    expect(screen.getByText('15,000,000')).toBeInTheDocument();
    expect(screen.getByText('13 txn/s')).toBeInTheDocument();
    expect(screen.getByText('connected')).toBeInTheDocument(); // default badge
  });

  it('renders HEALTHY badge', () => {
    render(<ChainStatusIndicator chain={{ ...mockChain, status: 'HEALTHY' as unknown as Chain['status'] }} />);
    expect(screen.getByText('HEALTHY')).toBeInTheDocument();
  });

  it('renders DEGRADED badge', () => {
    render(<ChainStatusIndicator chain={{ ...mockChain, status: 'DEGRADED' as unknown as Chain['status'] }} />);
    expect(screen.getByText('DEGRADED')).toBeInTheDocument();
  });

  it('renders DOWN badge', () => {
    render(<ChainStatusIndicator chain={{ ...mockChain, status: 'DOWN' as unknown as Chain['status'] }} />);
    expect(screen.getByText('DOWN')).toBeInTheDocument();
  });
  
  it('uses fallback variables if explicit variables are not defined', () => {
    const fallbackChain: Chain = {
      id: 'bnb',
      name: 'BNB',
      chainId: 56,
      status: 'connected',
      latestBlock: 12345,
      txnsPerSecond: 10,
    };
    render(<ChainStatusIndicator chain={fallbackChain} />);
    expect(screen.getByText('12,345')).toBeInTheDocument();
    expect(screen.getByText('10 txn/s')).toBeInTheDocument();
  });

  it('handles missing values with fallback to 0', () => {
    const emptyChain: Chain = { id: 'test', name: 'Test', chainId: 99, status: 'disconnected' };
    render(<ChainStatusIndicator chain={emptyChain} />);
    expect(screen.getByText('0')).toBeInTheDocument(); // latest block
    expect(screen.getByText('0 txn/s')).toBeInTheDocument();
  });
});
