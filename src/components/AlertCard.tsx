import React from 'react';
import { Alert } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  formatLatency, 
  formatUsd, 
  formatTxHash, 
  formatRelativeTime, 
  formatSeverityEmoji,
  formatAlertType
} from '@/lib/format';
import { Clock, ShieldAlert } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  const getSeverityVariant = () => {
    switch (alert.severity) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      case 'LOW': return 'low';
      default: return 'default';
    }
  };

  const isUnresolved = alert.status === 'UNRESOLVED';

  return (
    <Card className={`relative overflow-hidden transition-all ${
      isUnresolved ? 'border-red-500/30 bg-red-950/10' : 'border-slate-800 opacity-60'
    }`}>
      {/* Decorative left accent edge */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        alert.severity === 'CRITICAL' ? 'bg-red-500' :
        alert.severity === 'HIGH' ? 'bg-orange-500' :
        alert.severity === 'MEDIUM' ? 'bg-yellow-500' : 'bg-slate-500'
      }`} />

      <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getSeverityVariant()} className="gap-1.5 px-2 py-0.5">
              <span>{formatSeverityEmoji(alert.severity)}</span>
              {alert.severity}
            </Badge>
            <span className="text-sm font-medium text-slate-100">
              {formatAlertType(alert.type || alert.alertType || 'unknown')}
            </span>
          </div>
          
          <div className="flex items-center text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {formatRelativeTime(alert.timestamp)}
          </div>
        </div>

        {/* Body */}
        <div>
          <p className="text-sm text-slate-300 leading-snug">
            {alert.description}
          </p>
          
          {alert.target_contract && (
            <div className="mt-2 text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1.5 rounded inline-flex items-center border border-slate-800">
              <ShieldAlert className="w-3 h-3 mr-1.5 text-slate-500" />
              Target: {alert.target_contract}
            </div>
          )}
        </div>

        {/* Footer Metrics */}
        <div className="grid grid-cols-2 mt-2 pt-3 border-t border-slate-800/60 gap-y-2">
          {alert.value_usd !== undefined && (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Value at Risk</span>
              <span className="text-sm font-semibold text-red-400">{formatUsd(alert.value_usd)}</span>
            </div>
          )}
          
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tx Hash</span>
            <span className="text-xs font-mono text-slate-300 mt-0.5">{formatTxHash(alert.tx_hash || alert.txHash || '')}</span>
          </div>
          
          {alert.liquify_advantage_ms && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 col-span-2 mt-2 pt-2 border-t border-cyan-900/20">
              <Badge variant="liquify" className="text-[9px] uppercase px-2 py-0.5 whitespace-nowrap shrink-0 w-fit">Liquify Fast-Track</Badge>
              <span className="text-[11px] text-cyan-400 leading-tight">Captured {formatLatency(alert.liquify_advantage_ms)} earlier than Standard RPC</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
