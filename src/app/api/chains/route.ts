import { NextResponse } from 'next/server';
import { generateMockChains } from '@/lib/mock-data';

export async function GET() {
  // Simple mock representing current chain state
  const chains = generateMockChains();
  return NextResponse.json(chains);
}
