import React from 'react';
import { Chain } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { formatBlockNumber, formatThroughput } from '@/lib/format';
import { Activity } from 'lucide-react';

interface ChainStatusProps {
  chain: Chain;
}

export function ChainStatusIndicator({ chain }: ChainStatusProps) {
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
    <Card className="bg-slate-900/60 border-slate-800 hover:border-slate-700 transition-colors overflow-hidden group">
      <CardContent className="p-0 flex flex-col">
        {/* Header Segment */}
        <div className="flex items-center justify-between p-3.5 border-b border-slate-800/60 bg-slate-900/80 group-hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-slate-950 flex items-center justify-center border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
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
  );
}
