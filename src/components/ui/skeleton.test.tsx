import { render, screen } from '@testing-library/react';
import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders with appropriate default classes', () => {
    const { container } = render(<Skeleton data-testid="skel" />);
    const div = screen.getByTestId('skel');
    // The core skeleton class
    expect(div).toHaveClass('animate-pulse', 'rounded-md', 'bg-slate-800');
  });

  it('applies custom classNames', () => {
    render(<Skeleton data-testid="custom" className="w-10 h-10" />);
    const div = screen.getByTestId('custom');
    expect(div).toHaveClass('w-10', 'h-10', 'bg-slate-800');
  });
});
