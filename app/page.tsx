import Fingerprint from "@/components/Fingerprint";
import RepoRow from "@/components/RepoRow";
import SeparationStory from "@/components/SeparationStory";
import UsernameForm from "@/components/UsernameForm";
import { SAMPLE_PLAN, SAMPLE_REPO } from "@/lib/sample";

const RULES: { signal: string; points: string; why: string }[] = [
  { signal: "It's a fork", points: "−45", why: "The code belongs to someone else first." },
  { signal: "Named after a classic tutorial project", points: "−30", why: "Netflix clone, to-do app, weather app and 40 more." },
  { signal: "README is a starter template's default text", points: "−20", why: "Matched with MinHash against Create React App, Vite, Next.js, Flutter and others." },
  { signal: "Most files are untouched starter files", points: "−15", why: "Compares your file list with what the starter generates." },
  { signal: "Three commits or fewer", points: "−15", why: "The whole project was uploaded at once." },
  { signal: "No README", points: "−15", why: "Nobody can tell what you built." },
  { signal: "README credits a course or tutorial", points: "−10", why: "Honest, but then show what you added." },
  { signal: "Close to a common tutorial idea", points: "−12", why: "The idea overlaps, but there's more in the name." },
  { signal: "Worked on across 10+ days", points: "+10", why: "Real, iterative history." },
  { signal: "README explains the problem and decisions", points: "+10", why: "Reads as your own thinking." },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
          <a href="/" className="font-display flex items-center gap-2 text-xl font-semibold">
            <img src="/icon.svg" alt="" width={28} height={28} />
            OwnIt
          </a>
          <a href="#how" className="text-white/70 hover:text-white">
            How it works
          </a>
        </nav>

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-24 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:pt-16 lg:pb-32">
          <div>
            <h1 className="font-display text-[2.75rem] leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
              Is it your project, or the tutorial&apos;s?
            </h1>
            <p className="measure mt-6 text-lg text-white/75 sm:text-xl">
              OwnIt reads your GitHub the way a recruiter does, finds the repos that look copied, and shows you how to make each
              one clearly yours.
            </p>
            <div className="mt-10">
              <UsernameForm tone="dark" id="hero-username" />
              <p className="text-sm text-white/50">Reads public repos only. No sign-in needed.</p>
            </div>
          </div>

          <div className="relative mx-auto aspect-[200/220] w-64 sm:w-80 lg:w-full lg:max-w-[420px]">
            <div className="absolute inset-0 translate-x-[-7%]">
              <Fingerprint seed={11} color="var(--color-carbon)" strokeWidth={2.2} className="h-full w-full" />
            </div>
            <div className="absolute inset-0 translate-x-[7%] rotate-[4deg]">
              <Fingerprint seed={11} color="var(--color-marigold)" strokeWidth={2.2} draw delay={0.3} className="h-full w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Scroll story */}
      <div id="how">
        <SeparationStory />
      </div>

      {/* Sample result */}
      <section className="bg-paper-deep py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">What you get for every repo</h2>
          <p className="measure mt-4 text-lg text-graphite">
            A score you can check line by line, and a plan written for that repo. This is a real-style example for a typical
            Netflix clone.
          </p>
          <div className="mt-10 rounded-3xl bg-paper px-5 ring-1 ring-rule sm:px-8">
            <RepoRow repo={SAMPLE_REPO} username="demo" demoPlan={SAMPLE_PLAN} />
          </div>
        </div>
      </section>

      {/* Scoring rules */}
      <section className="py-24">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-8 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="font-display text-4xl font-semibold">No black box</h2>
            <p className="mt-4 text-lg text-graphite">
              Every repo starts at 100. These are all the rules. A score of 70 or more reads as yours, 40 to 69 as partly yours,
              and under 40 like a tutorial.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <thead>
                <tr className="border-b-2 border-ink text-sm">
                  <th className="py-3 pr-4 font-semibold">Signal</th>
                  <th className="py-3 pr-4 text-right font-semibold">Points</th>
                  <th className="py-3 font-semibold">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {RULES.map((r) => (
                  <tr key={r.signal} className="border-b border-rule align-top">
                    <td className="py-3 pr-4 font-medium">{r.signal}</td>
                    <td
                      className="tabular py-3 pr-4 text-right font-semibold"
                      style={{ color: r.points.startsWith("+") ? "#a46d00" : "var(--color-carbon)" }}
                    >
                      {r.points}
                    </td>
                    <td className="py-3 text-graphite">{r.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Final call */}
      <section className="bg-ink py-24 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 px-4 sm:px-8">
          <h2 className="font-display max-w-3xl text-4xl leading-tight font-semibold sm:text-5xl">
            Find out which of your repos a recruiter will skip.
          </h2>
          <UsernameForm tone="dark" id="footer-username" />
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-graphite sm:flex-row sm:justify-between sm:px-8">
        <p>OwnIt only reads public GitHub data. Nothing is stored beyond a short cache.</p>
        <p>Made for freshers who built it themselves, or are about to.</p>
      </footer>
    </main>
  );
}
