"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cleanUsername } from "@/lib/api";

type Props = { tone?: "dark" | "light"; id?: string };

export default function UsernameForm({ tone = "dark", id = "username" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = cleanUsername(value);
    if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(name)) {
      setError("Enter a GitHub username, like torvalds, or paste your profile link.");
      return;
    }
    router.push(`/check/${name}`);
  }

  const dark = tone === "dark";

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-xl">
      <label htmlFor={id} className={`mb-2 block text-sm ${dark ? "text-white/70" : "text-graphite"}`}>
        Your GitHub username or profile link
      </label>
      <div
        className={`flex flex-col gap-2 rounded-2xl p-2 sm:flex-row ${
          dark ? "bg-white/8 ring-1 ring-white/15" : "bg-white ring-1 ring-rule"
        }`}
      >
        <div className="flex flex-1 items-center gap-1 px-3">
          <span className={`${dark ? "text-white/40" : "text-graphite/60"} select-none`}>github.com/</span>
          <input
            id={id}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="your-username"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`min-w-0 flex-1 bg-transparent py-3 text-lg outline-none ${
              dark ? "text-white placeholder:text-white/30" : "text-ink placeholder:text-graphite/40"
            }`}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-marigold px-6 py-3 font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Check my repos
        </button>
      </div>
      <p
        id={`${id}-error`}
        role="alert"
        className={`mt-2 min-h-6 text-sm ${dark ? "text-marigold" : "text-carbon"}`}
      >
        {error}
      </p>
    </form>
  );
}
