/**
 * @jest-environment node
 */
import { GET } from './route';

describe('/api/benchmark route', () => {
  it('GET returns benchmark history', async () => {
    const response = await GET();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
