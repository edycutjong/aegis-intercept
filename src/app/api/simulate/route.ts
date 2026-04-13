import { NextResponse } from 'next/server';

export async function POST() {
  // Triggers a critical attack alert internally by calling the alerts API
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  try {
    await fetch(`${baseUrl}/api/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        severity: 'CRITICAL',
        type: 'flash_loan',
        description: '[SIMULATED] 50M USDC flash loan detected on Aave V3 targeting susceptible Curve pool.',
        value_usd: 50000000,
        status: 'UNRESOLVED',
        liquify_advantage_ms: 385, // Showcasing the exact speed advantage
      }),
    });
    
    return NextResponse.json({ success: true, message: 'Simulation triggered' });
  } catch {
    return NextResponse.json({ error: 'Failed to simulate attack' }, { status: 500 });
  }
}
