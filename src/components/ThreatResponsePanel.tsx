"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert } from '@/lib/types';
import { formatUsd, formatLatency } from '@/lib/format';
import { Shield, PauseCircle, ArrowRightLeft, LockKeyhole } from 'lucide-react';

interface ThreatResponsePanelProps {
  criticalAlert: Alert | null;
  onMigrate: (alertId: string) => void;
  onPause: (alertId: string) => void;
}

export function ThreatResponsePanel({ criticalAlert, onMigrate, onPause }: ThreatResponsePanelProps) {
  if (!criticalAlert) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Card className="bg-slate-900/80 border-slate-800 h-full flex items-center justify-center min-h-[300px] aegis-brackets">
          <div className="flex flex-col items-center text-center opacity-50">
            <div className="relative">
              <Shield className="w-12 h-12 text-slate-500 mb-4" />
              <div className="absolute inset-0 w-12 h-12 rounded-full bg-green-500/10 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
            <p className="text-sm font-medium text-slate-300">No active threats require manual intervention.</p>
            <p className="text-xs text-slate-500 mt-1">Autonomous systems are nominal.</p>
            <div className="mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-50" />
              <span className="text-[10px] text-green-500/60 font-mono ml-1">ALL CLEAR</span>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="bg-slate-900/80 border-red-500/30 h-full relative overflow-hidden flex flex-col aegis-threat-flash">
        {/* Animated top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 via-red-400 to-red-600 animate-pulse" />
        
        {/* Threat glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/5 blur-[40px] rounded-full pointer-events-none" />

        <CardHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <Badge variant="destructive" className="uppercase tracking-widest text-[10px] px-2 py-0 border-none shadow-none">
              Intervention Required
            </Badge>
          </div>
          <CardTitle className="text-xl text-white aegis-threat-text">Threat Block Detected</CardTitle>
          <CardDescription className="text-slate-400">
            Aegis engine captured an exploit transaction in the mempool prior to finality.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-end relative z-10">
          
          <div className="bg-slate-950/50 border border-red-500/10 rounded-lg p-4 mb-6 relative overflow-hidden aegis-brackets">
            {/* Subtle grid pattern inside info box */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[length:1rem_1rem] pointer-events-none" />
            
            <div className="flex justify-between items-end mb-3 relative z-10">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Value at Risk</p>
                <p className="text-2xl font-bold font-mono text-red-400">{formatUsd(criticalAlert.value_usd || 0)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Response Window</p>
                <Badge variant="liquify" className="text-xs font-mono py-1 px-2 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                  {formatLatency(criticalAlert.liquify_advantage_ms || 300)}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800 relative z-10">
              <p className="text-xs text-slate-400 mb-1">Target Contract</p>
              <p className="text-sm font-mono text-slate-300 break-all">{criticalAlert.target_contract}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <Button 
              variant="default" 
              size="lg" 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all border border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              onClick={() => onPause(criticalAlert.id)}
            >
              <PauseCircle className="w-4 h-4 mr-2" />
              Front-Run & Pause Contract
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all hover:shadow-[0_0_15px_rgba(100,116,139,0.2)]"
              onClick={() => onMigrate(criticalAlert.id)}
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Migrate Capital Safely
            </Button>
            
            <p className="text-center text-[10px] text-slate-500 mt-2 flex items-center justify-center gap-1">
              <LockKeyhole className="w-3 h-3" /> Execute via Secure Sandbox Environment
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
