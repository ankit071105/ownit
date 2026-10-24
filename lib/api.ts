export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export type Verdict = "yours" | "partly" | "tutorial";

export type Signal = { id: string; label: string; impact: number; detail: string };
export type Polish = { id: string; label: string; ok: boolean };

export type Repo = {
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
  pushed_at: string | null;
  fork: boolean;
  score: number;
  verdict: Verdict;
  signals: Signal[];
  polish: Polish[];
  tutorial_match: string | null;
  stats: { commits: number; commit_days: number; files: number; readme_words: number };
};

export type ScanResult = {
  user: { login: string; name: string; avatar: string; url: string; public_repos: number };
  summary: { average: number; scanned: number; yours: number; partly: number; tutorial: number };
  repos: Repo[];
};

export type Plan = {
  diagnosis: string;
  features: { title: string; why: string; how: string; effort: string }[];
  new_name: string;
  description: string;
  topics: string[];
  readme_intro: string;
  interview_pitch: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    });
  } catch {
    throw new Error(
      "Can't reach the OwnIt server. If it was asleep it takes about 40 seconds to wake up, so try again shortly.",
    );
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.detail || `Request failed (${res.status}).`);
  return body as T;
}

export const scanUser = (username: string) => request<ScanResult>(`/api/scan/${encodeURIComponent(username)}`);

export const getPlan = (username: string, repo: string) =>
  request<Plan>("/api/plan", { method: "POST", body: JSON.stringify({ username, repo }) });

export const VERDICT_COPY: Record<Verdict, { label: string; tone: string; soft: string; text: string }> = {
  yours: { label: "Reads as yours", tone: "var(--color-marigold)", soft: "var(--color-marigold-soft)", text: "#7a5100" },
  partly: { label: "Partly yours", tone: "var(--color-dusk)", soft: "var(--color-dusk-soft)", text: "#4b418f" },
  tutorial: { label: "Reads like a tutorial", tone: "var(--color-carbon)", soft: "var(--color-carbon-soft)", text: "#2433a8" },
};

/** Accepts "ankit", "@ankit" or "https://github.com/ankit/" */
export function cleanUsername(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, "");
  const fromUrl = trimmed.match(/github\.com\/([^/?#]+)/i);
  return (fromUrl ? fromUrl[1] : trimmed).replace(/^@/, "");
}
