import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from './layout';

describe('RootLayout', () => {
  it('renders children correctly', () => {
    // Suppress console.error "In HTML, <html> cannot be a child of <div>."
    const originalError = console.error;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
      const msg = args[0];
      if (typeof msg === 'string' && msg.includes('cannot be a child of <div>')) return;
      originalError(...args); // fallback
    });

    render(
      <RootLayout>
        <div data-testid="child">Test Child</div>
      </RootLayout>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('exports valid metadata', () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe('Aegis Intercept — Zero-Block Exploit Interceptor');
    expect(metadata.description).toContain('Real-time cross-chain exploit interceptor');
  });
});
