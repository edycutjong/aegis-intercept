/**
 * @jest-environment node
 */
import { POST } from './route';

// Mock fetch globally
global.fetch = jest.fn();


describe('/api/simulate route', () => {
  it('POST triggers simulation and returns 200', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });
    
    // We don't even need a request body for this specific POST handler
    const response = await POST();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.message).toContain('Simulation');
  });

  it('POST handles errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    const response = await POST();
    expect(response.status).toBe(500);
  });
});
