import { render, screen } from '@testing-library/react';
import { SplitScreenBenchmark } from './SplitScreenBenchmark';
import { Benchmark } from '@/lib/types';

// Mock the LatencyChart as it uses Recharts which can be tricky in JSDOM
jest.mock('./LatencyChart', () => ({
  LatencyChart: () => <div data-testid="mock-latency-chart" />
}));

describe('SplitScreenBenchmark', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockBenchmarks: Benchmark[] = [
    { timestamp: '1', standard_latency_ms: 100, liquify_latency_ms: 50 },
    { timestamp: '2', standard_latency_ms: 120, liquify_latency_ms: 60 },
  ];

  it('renders awaiting state when no benchmarks are provided', () => {
    render(<SplitScreenBenchmark benchmarks={[]} />);
    expect(screen.getByText('Awaiting Telemetry...')).toBeInTheDocument();
    
    // Average placeholders (calculated as 0 because of empty logic in anomalyLib)
    expect(screen.getAllByText('0ms').length).toBe(2);
  });

  it('renders correctly with benchmark data', () => {
    // Averaging 100+120 = 220/2 = 110 (standard)
    // Averaging 50+60 = 110/2 = 55 (liquify)
    // Advantage = 110 - 55 = 55

    render(<SplitScreenBenchmark benchmarks={mockBenchmarks} />);
    
    expect(screen.getByTestId('mock-latency-chart')).toBeInTheDocument();
    
    // Advantage
    expect(screen.getByText('55')).toBeInTheDocument();
    
    // Avg Standard
    expect(screen.getByText('110ms')).toBeInTheDocument();
    // Avg Liquify
    expect(screen.getByText('55ms')).toBeInTheDocument();
  });
});
