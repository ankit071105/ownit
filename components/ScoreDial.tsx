"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { VERDICT_COPY, type Verdict } from "@/lib/api";

type Props = { score: number; verdict: Verdict; size?: number };

/** Ring that fills with the originality score. */
export default function ScoreDial({ score, verdict, size = 72 }: Props) {
  const reduce = useReducedMotion();
  const value = useMotionValue(reduce ? score : 0);
  const [shown, setShown] = useState(reduce ? score : 0);
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = useTransform(value, (v) => c - (v / 100) * c);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(value, score, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [score, reduce, value]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Originality ${score} out of 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-rule)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={VERDICT_COPY[verdict].tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <span className="font-display tabular absolute inset-0 flex items-center justify-center text-xl font-semibold">
        {shown}
      </span>
    </div>
  );
}
