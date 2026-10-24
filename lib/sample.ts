import type { Plan, Repo } from "./api";

// Example shown on the landing page so people see the result before scanning.
export const SAMPLE_REPO: Repo = {
  name: "netflix-clone",
  url: "",
  description: "",
  language: "JavaScript",
  stars: 0,
  pushed_at: null,
  fork: false,
  score: 23,
  verdict: "tutorial",
  tutorial_match: "Netflix clone",
  stats: { commits: 2, commit_days: 1, files: 19, readme_words: 212 },
  signals: [
    { id: "tutorial-name", label: "Named like a classic Netflix clone", impact: -30, detail: "Recruiters see a 'Netflix clone' on most fresher profiles. The name alone says 'tutorial'." },
    { id: "starter-readme", label: "README is the default Create React App text", impact: -20, detail: "About 91% of the README matches the Create React App template." },
    { id: "starter-files", label: "Mostly untouched Create React App files", impact: -15, detail: "68% of files are the starter template's own files." },
    { id: "bulk-upload", label: "Only 2 commits", impact: -15, detail: "The whole project landed in one go, which is how copied code usually arrives." },
  ],
  polish: [
    { id: "description", label: "Has a one-line description", ok: false },
    { id: "topics", label: "Has topics/tags", ok: false },
    { id: "homepage", label: "Has a live demo link", ok: true },
    { id: "license", label: "Has a license", ok: false },
    { id: "readme", label: "README longer than 150 words", ok: true },
  ],
};

export const SAMPLE_PLAN: Plan = {
  diagnosis:
    "The name, README and file layout are all straight from the popular React Netflix tutorial, and the code arrived in two commits. Nothing yet shows a decision you made yourself.",
  features: [
    {
      title: "Watch-party sync for hostel rooms",
      why: "Friends on slow hostel Wi-Fi can't stream together without lag.",
      how: "Add a Socket.IO room that syncs play, pause and seek events. Store room state in Redis and show who is buffering.",
      effort: "4-5 days",
    },
    {
      title: "Regional-language rows",
      why: "Most Indian viewers browse Hindi, Tamil and Bengali titles first.",
      how: "Use TMDB's original_language filter to build rows per language, and remember the viewer's choice in localStorage.",
      effort: "2 days",
    },
    {
      title: "Low-data mode",
      why: "Mobile users on 1.5 GB/day plans avoid auto-playing trailers.",
      how: "Detect the Network Information API's saveData flag, swap trailers for posters and lazy-load images below the fold.",
      effort: "2 days",
    },
  ],
  new_name: "hostel-flix",
  description: "Watch-party streaming UI for low-bandwidth hostels, with regional rows and a data saver mode.",
  topics: ["react", "socket-io", "watch-party", "tmdb-api", "low-bandwidth", "india"],
  readme_intro:
    "# HostelFlix\n\nWatching a movie together in a hostel usually means six people crowding one laptop, because streaming on our Wi-Fi lags for everyone else.\n\nHostelFlix lets friends watch in sync from their own phones. Play, pause and seek are shared through a room, and a data-saver mode keeps it usable on [your network speed].\n\n## What I built myself\n- Real-time room sync with Socket.IO and Redis\n- Regional-language browsing rows\n- Low-data mode using the Network Information API",
  interview_pitch:
    "I started from a Netflix UI tutorial, then rebuilt it around a problem in my hostel: watching together on slow Wi-Fi. I added real-time room sync with Socket.IO and Redis, and a data saver mode. The hardest part was handling clients that buffer at different speeds, which I solved by [your approach].",
};
