import React from 'react';
import { Card, CardContent } from './ui/card';
import { formatUsd } from '@/lib/format';
import { Shield, Zap, Activity, Cpu } from 'lucide-react';

interface StatsPanelProps {
  totalSecured: number;
  activeThreats: number;
  averageLatencyAdvantage: number;
  uptime: number;
}

export function StatsPanel({ totalSecured, activeThreats, averageLatencyAdvantage, uptime }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Value Secured</p>
            <p className="text-2xl font-bold text-slate-100">{formatUsd(totalSecured)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Active Threats</p>
            <p className="text-2xl font-bold text-slate-100">{activeThreats}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Avg Advantage</p>
            <p className="text-2xl font-bold text-slate-100">{Math.round(averageLatencyAdvantage)}ms</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">System Uptime</p>
            <p className="text-2xl font-bold text-slate-100">{uptime}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
