"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronDown, Circle, ExternalLink, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { getPlan, VERDICT_COPY, type Plan, type Repo } from "@/lib/api";
import PlanPanel from "./PlanPanel";
import ScoreDial from "./ScoreDial";

type Props = { repo: Repo; username: string; demoPlan?: Plan; defaultOpen?: boolean };

export default function RepoRow({ repo, username, demoPlan, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [plan, setPlan] = useState<Plan | null>(demoPlan ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const v = VERDICT_COPY[repo.verdict];
  const panelId = `plan-${repo.name}`;

  function togglePlan() {
    const next = !open;
    setOpen(next);
    if (next && !plan && !loading) loadPlan();
  }

  async function loadPlan() {
    setLoading(true);
    setError("");
    try {
      setPlan(await getPlan(username, repo.name));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't make a plan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="border-b border-rule py-6 last:border-b-0">
      <div className="flex gap-4 sm:gap-6">
        <ScoreDial score={repo.score} verdict={repo.verdict} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="font-display truncate text-2xl font-semibold">{repo.name}</h3>
            <span className="rounded-full px-2.5 py-0.5 text-sm font-medium" style={{ background: v.soft, color: v.text }}>
              {v.label}
            </span>
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-graphite">
            {repo.language && <span>{repo.language}</span>}
            <span className="tabular">
              {repo.stats.commits} commits over {repo.stats.commit_days} day{repo.stats.commit_days === 1 ? "" : "s"}
            </span>
            {repo.stars > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star size={13} aria-hidden /> {repo.stars}
              </span>
            )}
            {repo.url && (
              <a href={repo.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
                View on GitHub <ExternalLink size={13} aria-hidden />
              </a>
            )}
          </p>

          {repo.signals.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {repo.signals.map((s) => (
                <li key={s.id} className="flex gap-3">
                  <span
                    className="tabular mt-0.5 w-10 shrink-0 text-right text-sm font-semibold"
                    style={{ color: s.impact < 0 ? "var(--color-carbon)" : "#a46d00" }}
                  >
                    {s.impact > 0 ? `+${s.impact}` : s.impact}
                  </span>
                  <span className="text-[0.97rem]">
                    <span className="font-medium">{s.label}.</span> <span className="text-graphite">{s.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-graphite">Nothing here looks copied. Nice.</p>
          )}

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm" aria-label="Profile polish checklist">
            {repo.polish.map((p) => (
              <li key={p.id} className={`inline-flex items-center gap-1.5 ${p.ok ? "text-ink" : "text-graphite"}`}>
                {p.ok ? (
                  <CheckCircle2 size={15} className="text-[#a46d00]" aria-label="Done" />
                ) : (
                  <Circle size={15} className="text-graphite/50" aria-label="Missing" />
                )}
                {p.label}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={togglePlan}
            aria-expanded={open}
            aria-controls={panelId}
            className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition-colors ${
              repo.verdict === "yours"
                ? "text-ink ring-1 ring-rule hover:bg-white"
                : "bg-ink text-white hover:bg-ink-soft"
            }`}
          >
            {loading && <Loader2 size={16} className="animate-spin" aria-hidden />}
            {open ? "Hide the plan" : repo.verdict === "yours" ? "Make it even stronger" : "Make it mine"}
            <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-rule sm:ml-[96px] sm:p-7">
              {loading && (
                <p className="flex items-center gap-2 text-graphite" aria-live="polite">
                  <Loader2 size={18} className="animate-spin" aria-hidden /> Reading {repo.name} and writing your plan. This
                  takes about 10 seconds.
                </p>
              )}
              {error && (
                <div role="alert">
                  <p className="text-carbon">{error}</p>
                  <button
                    type="button"
                    onClick={loadPlan}
                    className="mt-3 rounded-lg px-3 py-1.5 text-sm ring-1 ring-rule"
                  >
                    Try again
                  </button>
                </div>
              )}
              {plan && <PlanPanel plan={plan} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
