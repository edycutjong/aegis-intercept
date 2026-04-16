"use client";

import { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  format?: (n: number) => string;
}

/**
 * Animated number counter that smoothly counts up to the target value.
 * Uses requestAnimationFrame for 60fps smoothness.
 * Renders the target value immediately on first mount for SSR/test compatibility.
 */
export function AnimatedCounter({
  value,
  duration = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  format,
}: AnimatedCounterProps) {
  // Start at the target value immediately (avoids showing 0 on mount)
  const [display, setDisplay] = useState(value);
  const startRef = useRef<number | null>(null);
  const prevValueRef = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render — value is already set to target
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = value;
    
    if (startValue === endValue) return;

    let animId: number;

    function animate(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplay(current);

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = endValue;
      }
    }

    startRef.current = null;
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  const formatted = format
    ? format(display)
    : display.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
