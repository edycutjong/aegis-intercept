"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { formatUsd } from '@/lib/format';
import { Shield, Zap, Activity, Cpu } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

interface StatsPanelProps {
  totalSecured: number;
  activeThreats: number;
  averageLatencyAdvantage: number;
  uptime: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

interface StatCardConfig {
  icon: React.ElementType;
  label: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  accentClass: string;
  glowColor: string;
}

const STAT_CONFIGS: StatCardConfig[] = [
  {
    icon: Shield,
    label: 'Value Secured',
    iconBg: 'bg-blue-500/10',
    iconBorder: 'border-blue-500/20',
    iconColor: 'text-blue-400',
    accentClass: 'aegis-gradient-text',
    glowColor: 'rgba(59, 130, 246, 0.1)',
  },
  {
    icon: Activity,
    label: 'Active Threats',
    iconBg: 'bg-red-500/10',
    iconBorder: 'border-red-500/20',
    iconColor: 'text-red-400',
    accentClass: 'aegis-threat-text',
    glowColor: 'rgba(239, 68, 68, 0.1)',
  },
  {
    icon: Zap,
    label: 'Avg Advantage',
    iconBg: 'bg-cyan-500/10',
    iconBorder: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    accentClass: 'aegis-gradient-text aegis-data-glow',
    glowColor: 'rgba(6, 182, 212, 0.1)',
  },
  {
    icon: Cpu,
    label: 'System Uptime',
    iconBg: 'bg-green-500/10',
    iconBorder: 'border-green-500/20',
    iconColor: 'text-green-400',
    accentClass: '',
    glowColor: 'rgba(34, 197, 94, 0.1)',
  },
];

export function StatsPanel({ totalSecured, activeThreats, averageLatencyAdvantage, uptime }: StatsPanelProps) {
  const values = [
    {
      render: () => (
        <AnimatedCounter
          value={totalSecured}
          format={(n) => formatUsd(n)}
          className="text-2xl font-bold"
          duration={2000}
        />
      ),
    },
    {
      render: () => (
        <AnimatedCounter
          value={activeThreats}
          className="text-2xl font-bold"
          duration={800}
        />
      ),
    },
    {
      render: () => (
        <span className="text-2xl font-bold">
          <AnimatedCounter
            value={Math.round(averageLatencyAdvantage)}
            className=""
            duration={1000}
          />
          <span className="text-cyan-500 text-lg">ms</span>
        </span>
      ),
    },
    {
      render: () => (
        <span className="text-2xl font-bold text-slate-100">
          {uptime}%
        </span>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {STAT_CONFIGS.map((config, i) => {
        const Icon = config.icon;
        return (
          <motion.div
            key={config.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="bg-slate-900/80 border-slate-800 aegis-card-hover aegis-brackets relative overflow-hidden group">
              {/* Ambient glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: config.glowColor }}
              />

              <CardContent className="p-5 flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-full ${config.iconBg} border ${config.iconBorder} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    {config.label}
                  </p>
                  <div className={config.accentClass}>
                    {values[i].render()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
