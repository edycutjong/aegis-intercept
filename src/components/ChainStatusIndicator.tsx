"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Chain } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { formatBlockNumber, formatThroughput } from '@/lib/format';
import { Activity } from 'lucide-react';

interface ChainStatusProps {
  chain: Chain;
  index?: number;
}

const statusGlow: Record<string, string> = {
  HEALTHY: '0 0 8px rgba(34, 197, 94, 0.1)',
  DEGRADED: '0 0 8px rgba(234, 179, 8, 0.1)',
  DOWN: '0 0 12px rgba(239, 68, 68, 0.15)',
};

const statusDotColor: Record<string, string> = {
  HEALTHY: 'bg-green-500',
  DEGRADED: 'bg-yellow-500 animate-pulse',
  DOWN: 'bg-red-500 animate-pulse',
};

export function ChainStatusIndicator({ chain, index = 0 }: ChainStatusProps) {
  const getStatusBadge = () => {
    switch (chain.status) {
      case 'HEALTHY':
        return <Badge variant="healthy">HEALTHY</Badge>;
      case 'DEGRADED':
        return <Badge variant="medium">DEGRADED</Badge>;
      case 'DOWN':
        return <Badge variant="critical">DOWN</Badge>;
      default:
        return <Badge>{chain.status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.4 + index * 0.1,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card
        className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-all overflow-hidden group aegis-card-hover"
        style={{ boxShadow: statusGlow[chain.status as string] || 'none' }}
      >
        <CardContent className="p-0 flex flex-col">
          {/* Header Segment */}
          <div className="flex items-center justify-between p-3.5 border-b border-slate-800/60 bg-slate-900/80 group-hover:bg-slate-800/40 transition-colors relative">
            {/* Live status dot */}
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-slate-950 flex items-center justify-center border border-slate-800 relative">
                <Activity className="w-3.5 h-3.5 text-cyan-500" />
                {/* Tiny status indicator */}
                <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${statusDotColor[chain.status as string] || 'bg-slate-500'} ring-2 ring-slate-900`} />
              </div>
              <div className="flex items-baseline gap-2">
                <h4 className="text-sm font-semibold tracking-tight text-slate-200">{chain.name}</h4>
                <span className="text-[10px] font-mono text-slate-500 border border-slate-800 rounded px-1">ID:{chain.id}</span>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Metrics Segment */}
          <div className="grid grid-cols-2 divide-x divide-slate-800/60 bg-slate-950/30">
            <div className="p-3">
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Latest Block</span>
              <span className="text-xs sm:text-sm font-mono text-slate-300">{formatBlockNumber(chain.latest_block || chain.latestBlock || 0)}</span>
            </div>
            <div className="p-3 pl-4">
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Throughput</span>
              <span className="text-xs sm:text-sm font-mono text-slate-300">{formatThroughput(chain.tps || chain.txns_per_second || chain.txnsPerSecond || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
