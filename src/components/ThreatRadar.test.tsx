import { render } from '@testing-library/react';
import { ThreatRadar } from './ThreatRadar';

describe('ThreatRadar Component', () => {
  it('renders correctly with 0 threats (cyan)', () => {
    const { container } = render(<ThreatRadar activeThreats={0} />);
    const dot = container.querySelector('.rounded-full.z-10');
    expect(dot).toHaveStyle({ backgroundColor: '#06b6d4' });
  });

  it('renders correctly with 2 threats (amber)', () => {
    const { container } = render(<ThreatRadar activeThreats={2} />);
    const dot = container.querySelector('.rounded-full.z-10');
    expect(dot).toHaveStyle({ backgroundColor: '#f59e0b' });
  });

  it('renders correctly with 4 threats (red)', () => {
    const { container } = render(<ThreatRadar activeThreats={4} />);
    const dot = container.querySelector('.rounded-full.z-10');
    expect(dot).toHaveStyle({ backgroundColor: '#ef4444' });
  });
});
