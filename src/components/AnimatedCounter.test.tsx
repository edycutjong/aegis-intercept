import { render, act } from '@testing-library/react';
import { AnimatedCounter } from './AnimatedCounter';

describe('AnimatedCounter Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial value', () => {
    const { getByText } = render(<AnimatedCounter value={100} duration={1000} />);
    expect(getByText('100')).toBeInTheDocument();
  });

  it('animates to new value using requestAnimationFrame', () => {
    const { getByText, rerender } = render(<AnimatedCounter value={100} duration={100} />);
    expect(getByText('100')).toBeInTheDocument();

    // Rerender with a new value
    rerender(<AnimatedCounter value={200} duration={100} />);
    
    // Advance time to pass the duration
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(getByText('200')).toBeInTheDocument();
  });

  it('applies formatting function correctly', () => {
    const formatter = (n: number) => `$${n.toFixed(1)}`;
    const { getByText } = render(<AnimatedCounter value={50} format={formatter} />);
    expect(getByText('$50.0')).toBeInTheDocument();
  });
});
