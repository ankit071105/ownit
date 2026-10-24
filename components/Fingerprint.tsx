"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

/** Small seeded random generator so both server and browser draw the same print. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Builds a whorl-style fingerprint: wobbly, open rings around a core. */
export function fingerprintPaths(seed: number, rings = 20): string[] {
  const rand = rng(seed);
  const paths: string[] = [];
  // one shared wave shape for all rings, so ridges run parallel like a real print
  const f1 = 2 + Math.floor(rand() * 2);
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;

  for (let i = 0; i < rings; i++) {
    const r = 5 + i * 4.4;
    // the core sits a little high, outer ridges drift down: a loop-style print
    const cx = 100 + Math.sin(i * 0.35) * 1.5;
    const cy = 96 + i * 0.9;
    const gapCenter = -Math.PI / 2 + Math.sin(i * 0.9 + p1) * 0.7; // where the ridge breaks
    const gap = 0.25 + rand() * 0.35;
    const start = gapCenter + gap / 2;
    const end = gapCenter + Math.PI * 2 - gap / 2;
    const steps = 80;
    let d = "";
    for (let s = 0; s <= steps; s++) {
      const t = start + ((end - start) * s) / steps;
      const wobble = 1 + 0.035 * Math.sin(f1 * t + p1) + 0.015 * Math.sin(5 * t + p2 + i * 0.2);
      const x = cx + Math.cos(t) * r * 0.76 * wobble;
      // flatten the bottom like a real fingertip
      const y = cy + Math.sin(t) * r * wobble * (Math.sin(t) > 0 ? 0.9 : 1.1);
      d += `${s === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    paths.push(d.trim());
  }
  return paths;
}

type Props = {
  seed: number;
  color: string;
  className?: string;
  strokeWidth?: number;
  draw?: boolean; // animate the ridges being drawn in
  delay?: number;
};

export default function Fingerprint({ seed, color, className, strokeWidth = 2, draw = false, delay = 0 }: Props) {
  const paths = useMemo(() => fingerprintPaths(seed), [seed]);
  const reduce = useReducedMotion();
  const animate = draw && !reduce;

  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true" fill="none">
      {paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
}
