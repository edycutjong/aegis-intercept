import { render, act } from '@testing-library/react';
import { AnimatedBackground } from './AnimatedBackground';

describe('AnimatedBackground Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing and runs requestAnimationFrame', () => {
    const { container } = render(<AnimatedBackground />);
    
    // Check if canvas is rendered
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Advance time to allow the requestAnimationFrame to draw
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // We can't strictly assert canvas drawn contents in jsdom easily,
    // but running through the timers covers the particle array and map lines.
    expect(canvas).toHaveStyle({ opacity: '0.6' });
  });
});
