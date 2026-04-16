"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RefreshCw, PlayCircle } from 'lucide-react';
import { Chain, Alert, Benchmark } from '@/lib/types';
import { MAX_BENCHMARK_HISTORY } from '@/lib/constants';

// Data
import { 
  generateMockChains, 
  generateMockAlerts, 
  generateMockBenchmarkHistory,
  generateMockBenchmark
} from '@/lib/mock-data';
import { calculateValueAtRisk } from '@/lib/anomaly';

// Components
import { ChainStatusIndicator } from '@/components/ChainStatusIndicator';
import { SplitScreenBenchmark } from '@/components/SplitScreenBenchmark';
import { StatsPanel } from '@/components/StatsPanel';
import { AlertCard } from '@/components/AlertCard';
import { ThreatResponsePanel } from '@/components/ThreatResponsePanel';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [isDemoActive, setIsDemoActive] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Data State — initialize directly with demo data (avoids setState-in-effect cascade)
  const [chains] = useState<Chain[]>(() => generateMockChains());
  const [alerts, setAlerts] = useState<Alert[]>(() => generateMockAlerts(5));
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>(() => generateMockBenchmarkHistory(MAX_BENCHMARK_HISTORY));

  // Derived State
  const criticalAlert = alerts.find(a => a.severity === 'CRITICAL' && a.status === 'UNRESOLVED') || null;
  const activeThreats = alerts.filter(a => a.status === 'UNRESOLVED').length;
  const totalValueAtRisk = calculateValueAtRisk(alerts);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tick generator for demo simulation
  useEffect(() => {
    if (!isDemoActive) return;

    const interval = setInterval(() => {
      const now = new Date().toISOString();
      const newBenchmark = generateMockBenchmark(now);
      
      setBenchmarks(prev => {
        const next = [...prev, newBenchmark];
        if (next.length > MAX_BENCHMARK_HISTORY) return next.slice(1);
        return next;
      });

    }, 500);

    return () => clearInterval(interval);
  }, [isDemoActive]);

  // Handlers
  const handleMigrate = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'MITIGATED' } : a));
  };

  const handlePause = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'MITIGATED' } : a));
  };

  const handleSimulateAttack = () => {
    const criticalAttack: Alert = {
      id: `sim-atk-${Date.now()}`,
      chainId: 'ethereum',
      chain_id: 'eth-mainnet',
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      type: 'flash_loan',
      status: 'UNRESOLVED',
      description: '[SIMULATED] 50M USDC flash loan detected on Aave V3 targeting susceptible Curve pool.',
      value_usd: 50000000,
      tx_hash: '0x9d2a1...',
      target_contract: '0xTargetCurvePoolVault...',
      liquify_advantage_ms: 385,
    };
    setAlerts(prev => [criticalAttack, ...prev].slice(0, 10));
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30"></div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-baseline gap-2">
              Aegis <span className="text-slate-500 font-medium">Intercept</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/replay">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50">
                <PlayCircle className="w-4 h-4 mr-2" />
                Exploit Replay
              </Button>
            </Link>

            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleSimulateAttack}
              className="text-xs bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30"
            >
              <ShieldAlert className="w-3 h-3 mr-1.5" />
              Simulate Exploit
            </Button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isDemoActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className={isDemoActive ? 'text-green-400' : 'text-slate-400'}>
                {isDemoActive ? 'LIVE TELEMETRY' : 'SYSTEM PAUSED'}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDemoActive(!isDemoActive)}
              className="text-xs"
            >
              <RefreshCw className={`w-3 h-3 mr-2 ${isDemoActive ? 'animate-spin opacity-50' : ''}`} />
              {isDemoActive ? 'Pause Demo' : 'Resume Demo'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
        
        {/* Top-Level KPIs */}
        <section>
          <StatsPanel 
            totalSecured={totalValueAtRisk * 15} // Mock extrapolation
            activeThreats={activeThreats}
            averageLatencyAdvantage={criticalAlert?.liquify_advantage_ms || benchmarks[benchmarks.length - 1]?.difference_ms || 0}
            uptime={99.99}
          />
        </section>

        {/* Core Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Charts & Triage) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <section>
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4 px-1">Network Discovery Horizon</h3>
              <SplitScreenBenchmark benchmarks={benchmarks} />
            </section>
            
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-red-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Active Threat Vectors
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alerts.slice(0, 4).map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Controls & Chains) */}
          <div className="flex flex-col gap-8">
            <section>
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4 px-1">Response Protocol</h3>
              <ThreatResponsePanel 
                criticalAlert={criticalAlert} 
                onMigrate={handleMigrate}
                onPause={handlePause}
              />
            </section>
            
            <section className="pt-4 sm:pt-6">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4 px-1">Chain Status Matrix</h3>
              <div className="grid grid-cols-1 gap-3">
                {chains.map(chain => (
                  <ChainStatusIndicator key={chain.id} chain={chain} />
                ))}
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
