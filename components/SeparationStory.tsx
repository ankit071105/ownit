"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import Fingerprint from "./Fingerprint";

const STAGES = [
  {
    title: "Right now, your project and the tutorial share one fingerprint.",
    body: "Same idea, same starter files, same README. A recruiter who has seen forty Netflix clones this month can't tell yours apart.",
  },
  {
    title: "We read the name and the idea.",
    body: "OwnIt checks your repo against 40+ project ideas that every course teaches, from to-do apps to Zomato clones.",
  },
  {
    title: "We read the README and the files.",
    body: "If the README is still the default Create React App or Vite text, or most files are untouched starter files, we catch it.",
  },
  {
    title: "We read how it was built.",
    body: "Three commits on one evening looks like a copy. Work spread over weeks looks like yours. We show you exactly which one your repo is.",
  },
  {
    title: "Then we help the two prints drift apart.",
    body: "For each weak repo you get three features that solve a real problem, a new README opening and a pitch for your interview.",
  },
];

export default function SeparationStory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [stage, setStage] = useState(0);
  const [overlap, setOverlap] = useState(94);

  const spread = useTransform(scrollYProgress, [0.05, 0.92], [0, 1]);
  const leftX = useTransform(spread, (v) => `${-v * 34}%`);
  const rightX = useTransform(spread, (v) => `${v * 34}%`);
  const rightRotate = useTransform(spread, [0, 1], [0, 9]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStage(Math.min(STAGES.length - 1, Math.floor(v * STAGES.length)));
    const s = Math.min(1, Math.max(0, (v - 0.05) / 0.87));
    setOverlap(Math.round(94 - s * 82));
  });

  if (reduce) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-24 sm:px-8">
        {STAGES.map((s) => (
          <div key={s.title} className="mb-12 measure">
            <h3 className="font-display text-3xl font-semibold">{s.title}</h3>
            <p className="mt-3 text-graphite">{s.body}</p>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[360vh]" aria-label="How OwnIt reads your repos">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center gap-6 overflow-hidden px-4 sm:px-8 lg:flex-row lg:gap-16">
        {/* the two prints */}
        <div className="relative flex w-full max-w-md shrink-0 items-center justify-center lg:max-w-lg">
          <div className="relative aspect-[200/220] w-[46vw] max-w-[300px] sm:w-[36vw]">
            <motion.div style={{ x: leftX }} className="absolute inset-0 mix-blend-multiply">
              <Fingerprint seed={11} color="var(--color-carbon)" className="h-full w-full" />
            </motion.div>
            <motion.div style={{ x: rightX, rotate: rightRotate }} className="absolute inset-0 mix-blend-multiply">
              <Fingerprint seed={11} color="var(--color-marigold)" className="h-full w-full" />
            </motion.div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center lg:-bottom-14">
            <p className="font-display tabular text-4xl font-semibold sm:text-5xl">{overlap}%</p>
            <p className="text-sm text-graphite">overlap with the tutorial</p>
          </div>
        </div>

        {/* the words */}
        <div className="mt-14 w-full max-w-md lg:mt-0">
          <div className="mb-6 flex gap-1.5" aria-hidden="true">
            {STAGES.map((_, i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded-full transition-colors duration-300"
                style={{ background: i <= stage ? "var(--color-ink)" : "var(--color-rule)" }}
              />
            ))}
          </div>
          <div className="relative min-h-[15rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">{STAGES[stage].title}</h3>
                <p className="mt-4 text-lg text-graphite">{STAGES[stage].body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex gap-5 text-sm text-graphite">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-carbon" /> The tutorial
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-marigold" /> Your work
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
