import { NextResponse } from 'next/server';
import { generateMockAlerts, generateMockAlert } from '@/lib/mock-data';

// Keep track of some in-memory state for the demo
let currentAlerts = generateMockAlerts(5);

export async function GET() {
  return NextResponse.json(currentAlerts);
}

// Allow POST to push a new alert (e.g. from the /api/simulate endpoint)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newAlert = generateMockAlert(data);
    
    currentAlerts = [newAlert, ...currentAlerts].slice(0, 20); // Keep max 20
    
    return NextResponse.json(newAlert, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
