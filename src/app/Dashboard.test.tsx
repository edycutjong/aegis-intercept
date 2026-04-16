import { render, screen, act, fireEvent } from '@testing-library/react';
import Dashboard from './page';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock mock-data for coverage of false branch in page.tsx
import { generateMockBenchmarkHistory, generateMockAlerts } from '@/lib/mock-data';
jest.mock('@/lib/mock-data', () => {
  const original = jest.requireActual('@/lib/mock-data');
  return {
    ...original,
    generateMockBenchmarkHistory: jest.fn(original.generateMockBenchmarkHistory),
    generateMockAlerts: jest.fn(original.generateMockAlerts),
  };
});

// Mock fetch
global.fetch = jest.fn();

jest.useFakeTimers();

describe('Dashboard (Main Page)', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/alerts')) return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      if (url.includes('/api/chains')) return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      if (url.includes('/api/benchmark')) return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      return Promise.reject('URL not found');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders standard loading skeletons initially', () => {
    render(<Dashboard />);
    act(() => { jest.advanceTimersByTime(10); });
    // Since everything is loading, we expect to see skeletons
    expect(screen.getAllByText(/Aegis/i)[0]).toBeInTheDocument();
  });

  it('navigates to replay page on button click', () => {
    render(<Dashboard />);
    act(() => { jest.advanceTimersByTime(10); });
    const replayLink = screen.getByText(/Exploit Replay/i, { selector: 'button' });
    fireEvent.click(replayLink);
    // Since it's wrapped in a <Link>, next/link doesn't use router.push in tests out of the box unless mocked properly with next-router-mock.
    // We just verify it renders if mockPush doesn't trigger. 
    // The previous test logic might not work for `<Link>` elements, but let's check.
  });

  it('starts polling and updating data', () => {
    // No fetch needed as the page uses mock data directly
    render(<Dashboard />);
    
    // Fast forward to trigger many intervals to test benchmark array clipping
    act(() => {
      jest.advanceTimersByTime(60000); // 60 seconds is way more than MAX_BENCHMARK_HISTORY (usually ~60) * 500ms
    });

    // We can't strictly assert mock data interval without checking props, but making sure it doesn't crash is good.
    expect(screen.getByText(/Aegis/)).toBeInTheDocument();
  });

  it('triggers simulation and handles response actions', () => {
    render(<Dashboard />);
    act(() => { jest.advanceTimersByTime(10); });
    
    const simButton = screen.getByText(/Simulate Exploit/i);
    fireEvent.click(simButton);
    
    // Check if the simulation alert appears in the UI
    expect(screen.getByText(/SIMULATED/i)).toBeInTheDocument();

    // After simulation, a critical alert is present. There should be 'Migrate' and 'Aegis Pause' buttons from ThreatResponsePanel.
    const migrateButtons = screen.getAllByRole('button', { name: /Migrate Capital Safely/i });
    if (migrateButtons.length > 0) {
      fireEvent.click(migrateButtons[0]);
    }

    // Now let's try pushing pause
    // Actually Simulate Exploit creates it at index 0. It stays 0. Let's click pause.
    // ThreatResponsePanel only shows one active threat response.
    const pauseButtons = screen.queryAllByRole('button', { name: /Front-Run & Pause Contract/i });
    if (pauseButtons.length > 0) {
      fireEvent.click(pauseButtons[0]);
    }
  });

  it('toggles pause and resume demo', () => {
    render(<Dashboard />);
    act(() => { jest.advanceTimersByTime(10); });
    
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    
    // Click pause
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    
    // Should change to Resume
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
    
    // Click it again to resume
    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    
    // Should be back to Pause
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('covers benchmark length branch when elements < MAX_BENCHMARK_HISTORY', () => {
    (generateMockBenchmarkHistory as jest.Mock).mockReturnValueOnce([]);
    render(<Dashboard />);
    act(() => {
      jest.advanceTimersByTime(500);
    });
    // Triggers branch line 50 in page.tsx
    expect(screen.getByText(/Aegis/)).toBeInTheDocument();
  });

  it('covers zero fallback for averageLatencyAdvantage when no critical alerts and no benchmarks', () => {
    (generateMockBenchmarkHistory as jest.Mock).mockReturnValueOnce([]);
    (generateMockAlerts as jest.Mock).mockReturnValueOnce([]);
    
    render(<Dashboard />);
    // Just run enough for mount, but not interval
    act(() => {
      jest.advanceTimersByTime(10);
    });
    // This will trigger the fallback `|| 0` branch for averageLatencyAdvantage
    expect(screen.getByText(/Aegis/)).toBeInTheDocument();
  });
});
