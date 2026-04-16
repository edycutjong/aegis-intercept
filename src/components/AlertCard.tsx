"use client";

import React from 'react';
import { motion } from 'framer-motion';
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
  index?: number;
}

const severityGlow: Record<string, string> = {
  CRITICAL: '0 0 20px rgba(239, 68, 68, 0.15)',
  HIGH: '0 0 15px rgba(249, 115, 22, 0.1)',
  MEDIUM: '0 0 10px rgba(234, 179, 8, 0.08)',
  LOW: 'none',
};

const severityBorderColor: Record<string, string> = {
  CRITICAL: 'border-red-500/40',
  HIGH: 'border-orange-500/30',
  MEDIUM: 'border-yellow-500/20',
  LOW: 'border-slate-800',
};

export function AlertCard({ alert, index = 0 }: AlertCardProps) {
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
  const isCritical = alert.severity === 'CRITICAL' && isUnresolved;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card
        className={`relative overflow-hidden transition-all aegis-card-hover ${
          isUnresolved
            ? `${severityBorderColor[alert.severity] || 'border-red-500/30'} bg-red-950/10`
            : 'border-slate-800 opacity-60'
        } ${isCritical ? 'aegis-threat-flash' : ''}`}
        style={{
          boxShadow: isUnresolved ? severityGlow[alert.severity] : 'none',
        }}
      >
        {/* Decorative left accent edge — now with gradient */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
          alert.severity === 'CRITICAL' ? 'bg-gradient-to-b from-red-500 via-red-400 to-red-600' :
          alert.severity === 'HIGH' ? 'bg-gradient-to-b from-orange-500 via-orange-400 to-orange-600' :
          alert.severity === 'MEDIUM' ? 'bg-gradient-to-b from-yellow-500 via-yellow-400 to-yellow-600' : 'bg-slate-500'
        }`} />

        {/* Critical shimmer overlay */}
        {isCritical && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 animate-pulse pointer-events-none" />
        )}

        <CardContent className="p-4 sm:p-5 flex flex-col gap-3 relative z-10">
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
    </motion.div>
  );
}
