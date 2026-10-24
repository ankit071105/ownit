"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { Plan } from "@/lib/api";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard blocked — ignore */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-graphite ring-1 ring-rule hover:bg-paper"
    >
      {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}

export default function PlanPanel({ plan }: { plan: Plan }) {
  return (
    <div className="space-y-8">
      <p className="measure text-lg">{plan.diagnosis}</p>

      <div>
        <h4 className="font-display text-xl font-semibold">Three features that make it yours</h4>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {plan.features.map((f, i) => (
            <li key={f.title} className="rounded-xl bg-marigold-soft/60 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display tabular text-2xl font-semibold text-marigold">{i + 1}</span>
                <span className="text-xs text-graphite">{f.effort}</span>
              </div>
              <p className="mt-1 font-semibold">{f.title}</p>
              <p className="mt-2 text-[0.95rem]">{f.why}</p>
              <p className="mt-2 text-[0.95rem] text-graphite">{f.how}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="font-display text-xl font-semibold">New name and description</h4>
          <p className="mt-3 font-semibold">{plan.new_name}</p>
          <p className="mt-1 text-graphite">{plan.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {plan.topics.map((t) => (
              <span key={t} className="rounded-full bg-carbon-soft px-2.5 py-0.5 text-sm text-[#2433a8]">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-3">
            <CopyButton text={`${plan.description}\n\nTopics: ${plan.topics.join(", ")}`} label="Copy description" />
          </div>
        </div>
        <div>
          <h4 className="font-display text-xl font-semibold">Your interview answer</h4>
          <p className="mt-3 measure">{plan.interview_pitch}</p>
          <div className="mt-3">
            <CopyButton text={plan.interview_pitch} label="Copy pitch" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-display text-xl font-semibold">New README opening</h4>
          <CopyButton text={plan.readme_intro} label="Copy markdown" />
        </div>
        <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-ink p-4 text-sm leading-relaxed whitespace-pre-wrap text-white/90">
          {plan.readme_intro}
        </pre>
      </div>
    </div>
  );
}
