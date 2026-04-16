"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, PlayCircle, Radio } from 'lucide-react';
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
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ThreatRadar } from '@/components/ThreatRadar';
import { ChainStatusIndicator } from '@/components/ChainStatusIndicator';
import { SplitScreenBenchmark } from '@/components/SplitScreenBenchmark';
import { StatsPanel } from '@/components/StatsPanel';
import { AlertCard } from '@/components/AlertCard';
import { ThreatResponsePanel } from '@/components/ThreatResponsePanel';
import { Button } from '@/components/ui/button';

// Stagger container for sections
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

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
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
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
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 aegis-scanline aegis-noise aegis-grid-bg">
      {/* Animated network topology background */}
      <AnimatedBackground />

      {/* Top Navigation — glassmorphism */}
      <header className="sticky top-0 z-50 aegis-header-glass">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between relative">
          {/* Gradient line at bottom of header */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

          <div className="flex items-center gap-3">
            {/* Logo with glow */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 relative">
              <ShieldAlert className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 blur-md opacity-40" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-100 flex items-baseline gap-2">
              Aegis <span className="text-slate-500 font-medium">Intercept</span>
            </h1>
            
            {/* Threat radar in header */}
            <div className="ml-3 hidden sm:block">
              <ThreatRadar activeThreats={activeThreats} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/replay">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/50 transition-all">
                <PlayCircle className="w-4 h-4 mr-2" />
                Exploit Replay
              </Button>
            </Link>

            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleSimulateAttack}
              className="text-xs bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 hover:shadow-red-500/50 transition-all"
            >
              <ShieldAlert className="w-3 h-3 mr-1.5" />
              Simulate Exploit
            </Button>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 rounded-full border border-slate-800 text-xs font-mono backdrop-blur-sm">
              <Radio className={`w-3 h-3 ${isDemoActive ? 'text-green-400' : 'text-slate-500'}`} />
              <span className={`w-2 h-2 rounded-full ${isDemoActive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
              <span className={isDemoActive ? 'text-green-400' : 'text-slate-400'}>
                {isDemoActive ? 'LIVE TELEMETRY' : 'SYSTEM PAUSED'}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDemoActive(!isDemoActive)}
              className="text-xs border-slate-700 hover:border-slate-600"
            >
              <RefreshCw className={`w-3 h-3 mr-2 ${isDemoActive ? 'animate-spin opacity-50' : ''}`} />
              {isDemoActive ? 'Pause' : 'Resume'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20 relative z-10"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        
        {/* Top-Level KPIs */}
        <motion.section variants={fadeInUp}>
          <StatsPanel 
            totalSecured={totalValueAtRisk * 15} // Mock extrapolation
            activeThreats={activeThreats}
            averageLatencyAdvantage={criticalAlert?.liquify_advantage_ms || benchmarks[benchmarks.length - 1]?.difference_ms || 0}
            uptime={99.99}
          />
        </motion.section>

        {/* Core Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Charts & Triage) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <motion.section variants={fadeInUp}>
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4 px-1 aegis-section-line">
                Network Discovery Horizon
              </h3>
              <SplitScreenBenchmark benchmarks={benchmarks} />
            </motion.section>
            
            <motion.section variants={fadeInUp}>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-red-500 flex items-center gap-2 aegis-section-line">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Active Threat Vectors
                </h3>
                <span className="text-[10px] font-mono text-slate-600">
                  {alerts.filter(a => a.status === 'UNRESOLVED').length} UNRESOLVED
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alerts.slice(0, 4).map((alert, i) => (
                  <AlertCard key={alert.id} alert={alert} index={i} />
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column (Controls & Chains) */}
          <div className="flex flex-col gap-8">
            <motion.section variants={fadeInUp}>
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4 px-1 aegis-section-line">Response Protocol</h3>
              <ThreatResponsePanel 
                criticalAlert={criticalAlert} 
                onMigrate={handleMigrate}
                onPause={handlePause}
              />
            </motion.section>
            
            <motion.section variants={fadeInUp} className="pt-4 sm:pt-6">
              <h3 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-4 px-1 aegis-section-line">Chain Status Matrix</h3>
              <div className="grid grid-cols-1 gap-3">
                {chains.map((chain, i) => (
                  <ChainStatusIndicator key={chain.id} chain={chain} index={i} />
                ))}
              </div>
            </motion.section>
          </div>

        </div>
      </motion.main>

      {/* Bottom status bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between text-[10px] font-mono text-slate-600">
          <div className="flex items-center gap-4">
            <span>AEGIS v1.0.0</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
              LIQUIFY API CONNECTED
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>{chains.length} CHAINS MONITORED</span>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-600">DORAHACKS 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
