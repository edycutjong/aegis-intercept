"use client";

import React from 'react';

interface ThreatRadarProps {
  activeThreats: number;
  className?: string;
}

/**
 * Animated radar/sonar visualization that pulses based on threat level.
 * The ring intensity and speed increase with more active threats.
 */
export function ThreatRadar({ activeThreats, className = '' }: ThreatRadarProps) {
  const intensity = Math.min(activeThreats / 5, 1); // Normalize 0-1
  const ringColor = activeThreats > 3
    ? 'rgba(239, 68, 68, 0.4)'  // Red for high threat
    : activeThreats > 1
    ? 'rgba(245, 158, 11, 0.4)' // Amber for medium
    : 'rgba(6, 182, 212, 0.4)'; // Cyan for nominal

  const coreColor = activeThreats > 3
    ? '#ef4444'
    : activeThreats > 1
    ? '#f59e0b'
    : '#06b6d4';

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outermost ping ring */}
      <div
        className="absolute rounded-full aegis-radar-ring"
        style={{
          width: 40,
          height: 40,
          border: `1.5px solid ${ringColor}`,
          animationDuration: `${3 - intensity * 1.5}s`,
        }}
      />
      
      {/* Middle ring */}
      <div
        className="absolute rounded-full aegis-radar-ring"
        style={{
          width: 28,
          height: 28,
          border: `1px solid ${ringColor}`,
          animationDuration: `${3 - intensity * 1.5}s`,
          animationDelay: '0.5s',
        }}
      />

      {/* Core dot */}
      <div
        className="relative w-3 h-3 rounded-full z-10"
        style={{
          backgroundColor: coreColor,
          boxShadow: `0 0 12px ${coreColor}, 0 0 24px ${ringColor}`,
        }}
      />

      {/* Sweep line */}
      <div
        className="absolute aegis-radar-sweep"
        style={{
          width: 20,
          height: 1,
          background: `linear-gradient(90deg, ${coreColor}, transparent)`,
          transformOrigin: 'left center',
          left: '50%',
          top: '50%',
          animationDuration: `${4 - intensity * 2}s`,
        }}
      />
    </div>
  );
}
