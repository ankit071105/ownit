"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Fingerprint from "./Fingerprint";

const STEPS = [
  "Finding your public repos",
  "Reading each README",
  "Comparing files with starter templates",
  "Checking commit history",
  "Scoring originality",
];

export default function ScanLoader({ username }: { username: string }) {
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center py-24 text-center" aria-live="polite">
      <div className="relative h-56 w-52 overflow-hidden">
        <Fingerprint seed={11} color="var(--color-carbon)" className="h-full w-full opacity-30" />
        {!reduce && (
          <motion.div
            className="absolute inset-x-0 h-0.5 bg-marigold shadow-[0_0_18px_4px_rgba(244,163,0,0.45)]"
            initial={{ top: "6%" }}
            animate={{ top: ["6%", "92%", "6%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
      <p className="font-display mt-8 text-2xl font-semibold">Reading @{username}&apos;s repos</p>
      <p className="mt-2 text-graphite">{STEPS[step]}…</p>
      <p className="mt-6 max-w-sm text-sm text-graphite/80">
        The first scan can take up to a minute if the server was asleep.
      </p>
    </div>
  );
}
