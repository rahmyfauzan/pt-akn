'use client';

import React, { useState, useEffect } from 'react';

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

export default function Counter({ target, duration = 2000, suffix = '' }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // ease out quad
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}
