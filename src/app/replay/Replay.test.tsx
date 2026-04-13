import { render, screen, fireEvent, act } from '@testing-library/react';
import ReplayDashboard from './page';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ReplayDashboard Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders title and navigation', () => {
    render(<ReplayDashboard />);
    expect(screen.getByText('Mempool Entry')).toBeInTheDocument();
    expect(screen.getByText('Back to Command Center')).toBeInTheDocument();
  });

  it('navigates back on button click', () => {
    render(<ReplayDashboard />);
    fireEvent.click(screen.getByText('Back to Command Center'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('changes active step when player interacting and covers all step types', () => {
    let rafCallback: FrameRequestCallback | null = null;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb;
      return 1;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    render(<ReplayDashboard />);
    
    // Step 0 -> Neutral (already rendered)
    expect(screen.getByText('Execution State: Mempool Entry')).toBeInTheDocument();

    const playButton = screen.getByRole('button', { name: /play/i });
    // Click play to start automation
    fireEvent.click(playButton);

    // Initial tick to set lastTime
    if (rafCallback) {
      act(() => rafCallback!(1000));
    }

    // Array of times to trigger the state changes
    const timeSteps = [
      { t: 1020, expectedTitle: 'Flash Loan Initiated' }, // step 1 (15ms) -> Warning
      { t: 1050, expectedTitle: 'DEX Manipulation' }, // step 2 (45ms) -> Critical
      { t: 1090, expectedTitle: 'Oracle Desync' }, // step 3 (80ms) -> Warning
      { t: 1130, expectedTitle: 'Liquidity Drain' }, // step 4 (120ms) -> Critical
      { t: 1190, expectedTitle: 'Debt Repayment' }, // step 5 (180ms) -> Neutral
      { t: 1260, expectedTitle: 'Attacker Profit' }, // step 6 (250ms) -> Success
    ];

    timeSteps.forEach(({ t, expectedTitle }) => {
      if (rafCallback) {
        act(() => rafCallback!(t));
      }
      expect(screen.getByText(`Execution State: ${expectedTitle}`)).toBeInTheDocument();
    });

    (window.requestAnimationFrame as jest.Mock).mockRestore();
    (window.cancelAnimationFrame as jest.Mock).mockRestore();
  });
});
