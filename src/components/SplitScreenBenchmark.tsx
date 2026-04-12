"use client";

import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { LatencyChart } from './LatencyChart';
import { Benchmark } from '@/lib/types';
import { calculateAverageLatency } from '@/lib/anomaly';
import { Zap, Activity } from 'lucide-react';

interface SplitScreenBenchmarkProps {
  benchmarks: Benchmark[];
}

export function SplitScreenBenchmark({ benchmarks }: SplitScreenBenchmarkProps) {
  // Calculate rolling averages based on current data slice
  const liquifyAvg = calculateAverageLatency(benchmarks, 'liquify');
  const standardAvg = calculateAverageLatency(benchmarks, 'standard');
  const diffAvg = standardAvg - liquifyAvg;

  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl relative">
      {/* Glossy top reflection */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
          
          {/* Main Chart Area */}
          <div className="md:col-span-2 p-6 flex flex-col relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Live Event Horizon
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Real-time mempool discovery latency benchmark.
                </p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2 animate-pulse" />
                  Liquify Indexer
                </Badge>
                <Badge className="bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-800">
                  <span className="w-2 h-2 rounded-full bg-slate-400 mr-2" />
                  Standard RPC
                </Badge>
              </div>
            </div>

            <div className="flex-1 mt-4">
              {benchmarks.length > 0 ? (
                <LatencyChart data={benchmarks} height={400} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  <Activity className="w-6 h-6 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Awaiting Telemetry...</span>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Metrics Sidebar */}
          <div className="p-6 bg-slate-900/50 flex flex-col justify-center gap-8 relative overflow-hidden">
            {/* Soft backdrop glow for the metrics */}
            <div className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-blue-500/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500 mb-2">Liquify Advantage</span>
              <div className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-cyan-400" />
                <span className="text-5xl font-mono font-bold text-white shadow-cyan-500/20 drop-shadow-lg">
                  {Math.round(diffAvg)}<span className="text-xl text-cyan-500">ms</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3 max-w-[200px] leading-relaxed relative">
                Average lead time captured prior to standard network propagation.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-slate-800/80 pt-6">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Avg Standard</span>
                 <span className="text-lg font-mono text-slate-300 mt-1">{Math.round(standardAvg)}ms</span>
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-500">Avg Liquify</span>
                 <span className="text-lg font-mono text-cyan-400 mt-1">{Math.round(liquifyAvg)}ms</span>
               </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}
