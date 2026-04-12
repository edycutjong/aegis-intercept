import { NextResponse } from 'next/server';
import { generateMockBenchmarkHistory, generateMockBenchmark } from '@/lib/mock-data';
import { MAX_BENCHMARK_HISTORY } from '@/lib/constants';

let history = generateMockBenchmarkHistory(MAX_BENCHMARK_HISTORY);

export async function GET() {
  // Rotate the benchmark to simulate a tick requested by the client
  const now = new Date().toISOString();
  const nextPoint = generateMockBenchmark(now);
  
  history = [...history, nextPoint];
  if (history.length > MAX_BENCHMARK_HISTORY) {
    history = history.slice(1);
  }

  return NextResponse.json(history);
}
