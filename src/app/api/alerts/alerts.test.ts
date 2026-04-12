/**
 * @jest-environment node
 */
import { GET, POST } from './route';
import { NextResponse } from 'next/server';

describe('/api/alerts route', () => {
  it('GET returns a list of alerts', async () => {
    const response = await GET();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST adds a new alert', async () => {
    const mockPayload = { description: 'Simulated alert' };
    const request = new Request('http://localhost/api/alerts', {
      method: 'POST',
      body: JSON.stringify(mockPayload),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(201);
    expect(data.description).toContain('Simulated alert');
  });

  it('POST handles invalid payload', async () => {
    const request = new Request('http://localhost/api/alerts', {
      method: 'POST',
      body: 'invalid-json',
    });
    
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
