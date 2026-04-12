/**
 * @jest-environment node
 */
import { GET } from './route';

describe('/api/chains route', () => {
  it('GET returns chains status', async () => {
    const response = await GET();
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });
});
