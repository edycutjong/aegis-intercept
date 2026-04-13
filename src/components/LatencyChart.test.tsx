import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { LatencyChart, CustomTooltip } from './LatencyChart';
import { Benchmark } from '@/lib/types';

// Mock Recharts since it's hard to test in JSDOM
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
    AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
    Area: () => <div data-testid="area" />,
    XAxis: () => <div data-testid="xaxis" />,
    YAxis: () => <div data-testid="yaxis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    ReferenceLine: () => <div data-testid="reference-line" />,
  };
});

jest.useFakeTimers();

describe('LatencyChart', () => {
  const mockData: Benchmark[] = [
    { timestamp: '1', standard_latency_ms: 100, liquify_latency_ms: 50 },
    { timestamp: '2', standard_latency_ms: 200, liquify_latency_ms: 150 },
  ];

  it('renders initializing state first', () => {
    render(<LatencyChart data={mockData} />);
    expect(screen.getByText('Initializing Telemetry...')).toBeInTheDocument();
  });

  it('renders chart after delay', async () => {
    render(<LatencyChart data={mockData} />);
    
    // Advance time to trigger isReady state
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    expect(screen.queryByText('Initializing Telemetry...')).not.toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('uses custom height', () => {
    render(<LatencyChart data={mockData} height={500} />);
    act(() => {
      jest.advanceTimersByTime(50);
    });
    
    const container = screen.getByTestId('responsive-container').parentElement;
    expect(container).toHaveStyle('height: 500px');
  });

  describe('CustomTooltip', () => {
    it('returns null if not active', () => {
      const { container } = render(<CustomTooltip active={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders with payload correctly', () => {
      const mockPayload = [
        { name: 'liquify', value: 50, color: 'cyan', payload: { timestamp: '2026-04-12T04:50:00Z' } },
        { name: 'standard', value: 200, color: 'blue', payload: { timestamp: '2026-04-12T04:50:00Z' } }
      ];
      render(<CustomTooltip active={true} payload={mockPayload} />);
      
      expect(screen.getByText('Liquify Indexer:')).toBeInTheDocument();
      expect(screen.getByText('Standard RPC:')).toBeInTheDocument();
      expect(screen.getAllByText(/ms/).length).toBeGreaterThan(0);
      
      // Check difference text
      expect(screen.getByText('Difference:')).toBeInTheDocument();
      expect(screen.getByText('150ms')).toBeInTheDocument();
    });
  });
});
