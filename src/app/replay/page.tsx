"use client";

import React, { useState } from 'react';
import { ExploitReplayPlayer, ReplayEvent } from '@/components/ExploitReplayPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Zap, Target, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatUsd } from '@/lib/format';

export default function ReplayDashboard() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  // Mocked highly detailed trace of a flash loan exploit
  const CRITICAL_EXPLOIT_TRACE: ReplayEvent[] = [
    {
      id: 'step-0',
      timeOffsetMs: 0,
      title: 'Mempool Entry',
      description: 'Transaction broadcasted to mempool. Liquify Indexer detects pending state immediately.',
      contract: '0x1A2B...3C4D (Attacker Wallet)',
      type: 'neutral'
    },
    {
      id: 'step-1',
      timeOffsetMs: 15,
      title: 'Flash Loan Initiated',
      description: 'Attacker requests a highly uncollateralized loan of 10M USDC from Aave V3 Pool.',
      contract: 'Aave V3 Reserve Pool',
      valueChangeUsd: 10000000,
      type: 'warning'
    },
    {
      id: 'step-2',
      timeOffsetMs: 45,
      title: 'DEX Manipulation',
      description: 'Massive single-sided AMM dump on targeted Curve pool to forcefully unbalance peg equations.',
      contract: 'Curve 3Pool Adapter',
      type: 'critical'
    },
    {
      id: 'step-3',
      timeOffsetMs: 80,
      title: 'Oracle Desync',
      description: 'Secondary protocol reads manipulated spot price oracle. Undercollateralized liquidation threshold triggered.',
      contract: 'Chainlink Price Feed (Lagging)',
      type: 'warning'
    },
    {
      id: 'step-4',
      timeOffsetMs: 120,
      title: 'Liquidity Drain',
      description: 'Attacker leverages broken oracle logic to siphon collateral tokens from vulnerable vault wrapper.',
      contract: 'Vulnerable Target Vault',
      valueChangeUsd: -4500000,
      type: 'critical'
    },
    {
      id: 'step-5',
      timeOffsetMs: 180,
      title: 'Debt Repayment',
      description: '10M USDC flash loan repaid along with 0.05% fee within the same block state change.',
      contract: 'Aave V3 Reserve Pool',
      valueChangeUsd: -10005000,
      type: 'neutral'
    },
    {
      id: 'step-6',
      timeOffsetMs: 250,
      title: 'Attacker Profit',
      description: 'Exploiter walks away with net stolen liquidity, bridging funds through multiple hops.',
      contract: '0x1A2B...3C4D (Attacker Wallet)',
      valueChangeUsd: 4495000,
      type: 'success'
    }
  ];

  const currentEvent = CRITICAL_EXPLOIT_TRACE[activeStep];
  const isAegisInterventionWindow = activeStep > 0 && activeStep <= 3; // Best window to pause

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 sm:p-8">
      
      {/* Top Nav */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <Button variant="ghost" className="text-slate-400 hover:text-white pl-0" onClick={() => router.push('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Command Center
        </Button>
        <Badge variant="outline" className="text-cyan-400 border-cyan-500/30 bg-cyan-950/20 px-3 py-1.5 uppercase tracking-widest text-[10px]">
          Post-Mortem Analysis Engine
        </Badge>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
        
        {/* Left Side: Exploit Player */}
        <div className="lg:col-span-1 h-full">
          <ExploitReplayPlayer 
            events={CRITICAL_EXPLOIT_TRACE} 
            title="Shattered Peg Flash Loan (Tx Trace)"
            onStepChange={setActiveStep}
          />
        </div>

        {/* Right Side: Analysis Display */}
        <div className="lg:col-span-2 flex flex-col gap-8 h-full overflow-y-auto pr-2">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Dynamic Execution Frame</h1>
            <p className="text-slate-400">Step-by-step transaction unravelling to showcase sub-block mechanics and intervention opportunities.</p>
          </div>

          {/* Intervention Window Alert */}
          {isAegisInterventionWindow && (
            <div className="p-4 rounded-xl border border-cyan-500/50 bg-cyan-950/30 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex shrink-0 items-center justify-center border border-cyan-500/50">
                 <Zap className="w-5 h-5 text-cyan-400" />
               </div>
               <div>
                 <h4 className="text-sm font-semibold text-cyan-100 flex items-center gap-2">
                   Optimal Intervention Window Detected
                   <Badge variant="liquify" className="text-[9px] py-0">Liquify Lead Time</Badge>
                 </h4>
                 <p className="text-sm text-cyan-400/80 mt-1">
                   With Liquify&apos;s ~350ms pre-indexing advantage, Aegis Engine has enough buffer to execute an automated `pause()` or fast-gas front-run response here.
                 </p>
               </div>
            </div>
          )}

          {/* Current Frame deep dive */}
          <Card className="bg-slate-900 flex-1 flex border-slate-800">
            <CardContent className="p-8 w-full flex flex-col relative text-center items-center justify-center">
              
              <div className="absolute top-8 left-8 right-8 flex justify-between items-start opacity-30">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Clock className="w-4 h-4" /> T+{currentEvent.timeOffsetMs}ms
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-right">
                  ID: {currentEvent.id} <Target className="w-4 h-4 ml-2" />
                </div>
              </div>

              <Badge variant={
                currentEvent.type === 'critical' ? 'critical' : 
                currentEvent.type === 'warning' ? 'high' : 
                currentEvent.type === 'success' ? 'healthy' : 'outline'
              } className="text-xs px-3 py-1 uppercase tracking-widest mb-6">
                Execution State: {currentEvent.title}
              </Badge>
              
              <h2 className="text-2xl font-semibold text-white mb-4 max-w-lg">
                {currentEvent.description}
              </h2>
              
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800/80 mt-4 min-w-[300px]">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Impacted Contract
                </span>
                <span className="text-lg font-mono text-slate-300">
                  {currentEvent.contract}
                </span>

                {currentEvent.valueChangeUsd !== undefined && (
                   <div className="mt-6 text-center">
                     <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-bold">Capital Delta</p>
                     <p className={`text-3xl font-mono font-bold ${currentEvent.valueChangeUsd > 0 ? (currentEvent.type === 'success' ? 'text-green-400' : 'text-slate-100') : 'text-red-400'}`}>
                       {currentEvent.valueChangeUsd > 0 ? '+' : ''}{formatUsd(currentEvent.valueChangeUsd)}
                     </p>
                   </div>
                )}
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
