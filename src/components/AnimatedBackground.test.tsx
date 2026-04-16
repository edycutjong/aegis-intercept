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

    // Advance time greatly to allow the particles to hit the boundaries and wrap around
    act(() => {
      jest.advanceTimersByTime(100000); // long enough for vx/vy to cross canvas
    });

    // We can't strictly assert canvas drawn contents in jsdom easily,
    // but running through the timers covers the particle array and map lines.
    expect(canvas).toHaveStyle({ opacity: '0.6' });
  });
});
