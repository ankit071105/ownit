"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import RepoRow from "@/components/RepoRow";
import ScanLoader from "@/components/ScanLoader";
import { scanUser, VERDICT_COPY, type ScanResult, type Verdict } from "@/lib/api";

type Filter = "all" | Verdict;

export default function CheckPage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username);
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(() => {
    setError("");
    setData(null);
    scanUser(username)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Something went wrong."));
  }, [username]);

  useEffect(load, [load]);

  const repos = useMemo(
    () => (data ? data.repos.filter((r) => filter === "all" || r.verdict === filter) : []),
    [data, filter],
  );

  return (
    <main className="min-h-svh">
      <header className="bg-ink text-white">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-8">
          <a href="/" className="font-display flex items-center gap-2 text-xl font-semibold">
            <img src="/icon.svg" alt="" width={28} height={28} />
            OwnIt
          </a>
          <a href="/" className="text-white/70 hover:text-white">
            Check another profile
          </a>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        {!data && !error && <ScanLoader username={username} />}

        {error && (
          <div className="py-24" role="alert">
            <h1 className="font-display text-3xl font-semibold">We couldn&apos;t read @{username}</h1>
            <p className="measure mt-3 text-lg text-graphite">{error}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={load} className="rounded-xl bg-ink px-5 py-2.5 font-semibold text-white">
                Try again
              </button>
              <a href="/" className="rounded-xl px-5 py-2.5 font-semibold ring-1 ring-rule">
                Use a different username
              </a>
            </div>
          </div>
        )}

        {data && <Report data={data} repos={repos} filter={filter} setFilter={setFilter} />}
      </div>
    </main>
  );
}

function Report({
  data,
  repos,
  filter,
  setFilter,
}: {
  data: ScanResult;
  repos: ScanResult["repos"];
  filter: Filter;
  setFilter: (f: Filter) => void;
}) {
  const { user, summary } = data;
  const order: Verdict[] = ["tutorial", "partly", "yours"];

  if (summary.scanned === 0) {
    return (
      <div className="py-24">
        <h1 className="font-display text-3xl font-semibold">@{user.login} has no public repos yet</h1>
        <p className="mt-3 text-lg text-graphite">Push your first project, then come back and check it.</p>
      </div>
    );
  }

  const headline =
    summary.tutorial === 0 && summary.partly === 0
      ? "Every repo we read looks like your own work."
      : `${summary.tutorial + summary.partly} of ${summary.scanned} repos need work before a recruiter sees them.`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="py-12">
      <div className="flex items-center gap-4">
        {user.avatar && <img src={user.avatar} alt="" width={56} height={56} className="rounded-full ring-2 ring-rule" />}
        <div>
          <p className="font-semibold">{user.name}</p>
          <a href={user.url} target="_blank" rel="noreferrer" className="text-graphite hover:underline">
            @{user.login}
          </a>
        </div>
      </div>

      <h1 className="font-display mt-8 max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl">{headline}</h1>
      <p className="mt-3 text-lg text-graphite">
        Average originality <span className="tabular font-semibold text-ink">{summary.average}</span> across the{" "}
        {summary.scanned} most recent repos. Weakest repos are listed first.
      </p>

      {/* composition bar */}
      <div className="mt-8 flex h-3 overflow-hidden rounded-full bg-rule" aria-hidden="true">
        {order.map((v) =>
          summary[v] ? (
            <motion.span
              key={v}
              initial={{ width: 0 }}
              animate={{ width: `${(summary[v] / summary.scanned) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              style={{ background: VERDICT_COPY[v].tone }}
            />
          ) : null,
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter repos">
        {(["all", ...order] as Filter[]).map((f) => {
          const count = f === "all" ? summary.scanned : summary[f];
          const active = filter === f;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-rule hover:bg-paper-deep"
              }`}
            >
              {f === "all" ? "All" : VERDICT_COPY[f].label} <span className="tabular opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {repos.length === 0 ? (
          <p className="py-10 text-graphite">No repos in this group.</p>
        ) : (
          repos.map((r) => <RepoRow key={r.name} repo={r} username={user.login} />)
        )}
      </div>
    </motion.div>
  );
}
