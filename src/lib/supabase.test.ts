import { supabase } from './supabase';

describe('supabase client', () => {
  it('exports a valid supersbase instance', () => {
    expect(supabase).toBeDefined();
    // Check for some method that indicates it's a Supabase client
    expect(typeof supabase.from).toBe('function');
  });
});
