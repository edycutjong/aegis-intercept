import { render, screen, fireEvent } from '@testing-library/react';
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
    render(<ReplayDashboard />);
    
    // Find the next button in the player
    const forwardButton = screen.getByRole('button', { name: /skip forward/i });
    
    // Click 6 times to go through step 1 to 6
    for (let i = 0; i < 6; i++) {
        fireEvent.click(forwardButton);
    }
    
    // Check that we reached the end (step-6 is success type, valueChangeUsd > 0)
    expect(screen.getByText('Attacker Profit')).toBeInTheDocument();
    
    // Go back once
    const backwardButton = screen.getByRole('button', { name: /skip back/i });
    fireEvent.click(backwardButton);
    
    expect(screen.getByText('Debt Repayment')).toBeInTheDocument();
  });
});
