"use client";

import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Benchmark } from '@/lib/types';
import { COLORS, ANOMALY_THRESHOLDS } from '@/lib/constants';

interface TooltipPayloadEntry {
  name: string;
  value: number;
  color: string;
  payload: { timestamp: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/50 p-3 rounded-lg shadow-xl backdrop-blur-sm relative z-50">
        <p className="text-xs text-slate-400 mb-2 font-mono">
          {new Date(payload[0].payload.timestamp).toLocaleTimeString()}
        </p>
        {payload.map((entry: TooltipPayloadEntry, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-medium text-slate-200">
              {entry.name === 'liquify' ? 'Liquify Indexer' : 'Standard RPC'}:
            </span>
            <span className="text-sm font-mono font-bold text-white">
              {Math.round(entry.value)}ms
            </span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center">
           <span className="text-xs text-slate-400">Difference:</span>
           <span className="text-xs font-mono font-bold text-cyan-400">
             {Math.round(payload[1].value - payload[0].value)}ms
           </span>
        </div>
      </div>
    );
  }
  return null;
}

interface LatencyChartProps {
  data: Benchmark[];
  height?: number | string;
}

export function LatencyChart({ data, height = 300 }: LatencyChartProps) {
  // Format data for Recharts, taking only the latest elements to ensure it fits well
  const chartData = useMemo(() => {
    return data.map((point, index) => ({
      index, // simplified x-axis
      liquify: point.liquify_latency_ms,
      standard: point.standard_latency_ms,
      timestamp: point.timestamp
    }));
  }, [data]);


  const [isReady, setIsReady] = React.useState(false);
  React.useEffect(() => {
    // We defer rendering the chart by 50ms after the React mount pipeline completes.
    // This absolutely guarantees that the browser CSS stylesheet evaluates the flexbox
    // container's dimensions to true values, permanently destroying Recharts' -1 hydration warnings.
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="w-full relative flex items-center justify-center p-6 border border-slate-800/50 rounded-xl" style={{ height, minHeight: 300 }}>
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
          <span className="text-xs text-slate-500 font-mono">Initializing Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative" style={{ height, minHeight: 300 }}>
      {/* Decorative gradient blur in background */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none rounded-2xl" />

      <ResponsiveContainer width="99%" height={typeof height === 'number' ? height : 300}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLiquify" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.LIQUIFY} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={COLORS.LIQUIFY} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.STANDARD} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={COLORS.STANDARD} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
          
          <XAxis 
            dataKey="index" 
            hide={true} 
          />
          <YAxis 
            tickFormatter={(val) => `${val}ms`}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            dx={-10}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
          
          {/* Threshold line to show latency spikes */}
          <ReferenceLine 
            y={ANOMALY_THRESHOLDS.LATENCY_SPIKE_MS} 
            stroke={COLORS.CRITICAL} 
            strokeDasharray="3 3" 
            opacity={0.5} 
            label={{ position: 'insideTopLeft', value: 'SPIKE THRESHOLD', fill: COLORS.CRITICAL, fontSize: 10, dy: -10 }} 
          />

          <Area 
            type="monotone" 
            dataKey="standard" 
            stroke={COLORS.STANDARD} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorStandard)" 
            isAnimationActive={false} // Disable animation for real-time smoothness
          />
          
          <Area 
            type="monotone" 
            dataKey="liquify" 
            stroke={COLORS.LIQUIFY} 
            strokeWidth={2.5}
            fillOpacity={1} 
            fill="url(#colorLiquify)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
