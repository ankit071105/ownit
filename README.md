# OWNIT

**Find the GitHub repos a recruiter will skip, and fix them.**

  Live app: [ownit-xi.vercel.app](https://ownit-xi.vercel.app) 

· API: [ownit-api-jomw.onrender.com/docs](https://ownit-api-jomw.onrender.com/docs) 

· Frontend repo: [ownit-frontend](https://github.com/ankit071105/ownit-frontend)

## The problem

Most fresher GitHub profiles look the same: a Netflix clone, a to-do app, a weather app, all with the default Create React App README and pushed in one or two commits. Recruiters skim pinned repos in seconds, so a project the student actually understands still gets dismissed as "just a tutorial".

The tools I found either give a general profile score or generate interview questions. None of them answer the specific question a fresher has before applying: **which of my repos read as copied, why, and what should I change?**

## What it does

1. Takes a GitHub username and reads up to 12 recent public repos.
2. Scores each repo's **originality from 0 to 100** using explainable rules. No AI is involved in the score.
3. Shows every rule that fired, with the exact points, so the score can be checked line by line.
4. On request, sends one repo's evidence to Groq and returns a **"make it yours" plan**: three features that solve a real problem, a better name, description, topics, a README opening and a short interview answer.

## What I built and why

| Part | Decision | Why |
|---|---|---|
| `scoring.py` | Rule-based scoring, not an LLM | Deterministic, free, and every point can be explained to the user |
| `minhash.py` | MinHash written from scratch | Detects starter-template READMEs (CRA, Vite, Next.js, Flutter, Angular, Vue) without embeddings or a model |
| `catalog.py` | Hand-built list of 40+ tutorial project ideas and starter file sets | The heart of detection, and easy to extend |
| `llm.py` | Plain HTTP call to Groq with JSON output | Only used for the plan, so the core works even when the AI is down |
| `main.py` | Async GitHub calls, 4 at a time, with a TTL cache | Stays under GitHub's rate limit and keeps repeat scans fast |

Repos are sorted weakest first, because that is where a student needs help.

## How the score works

Every repo starts at 100.

| Signal | Points |
|---|---|
| Repo is a fork | −45 |
| Named exactly like a tutorial project (e.g. `netflix-clone`) | −30 |
| README matches a starter template (MinHash ≥ 0.35) | −20 |
| No README | −15 |
| 60%+ of files are untouched starter files | −15 |
| 3 commits or fewer | −15 |
| Close to a tutorial idea, but with more in the name | −12 |
| README credits a tutorial or course | −10 |
| All commits on a single day | −8 |
| README under 40 words | −8 |
| Commits spread over 10+ days | +10 |
| README explains the problem and decisions (120+ words) | +10 |
| 40+ files | +5 |

**70+** reads as yours · **40–69** partly yours · **under 40** reads like a tutorial

## API

| Method | Route | Returns |
|---|---|---|
| `GET` | `/api/health` | Server status and whether keys are set |
| `GET` | `/api/scan/{username}` | Summary and scored repos |
| `POST` | `/api/plan` | `{"username": "...", "repo": "..."}` → AI plan for that repo |

## Run locally

Needs Python 3.11.

```bash
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add GITHUB_TOKEN and GROQ_API_KEY
python -m uvicorn app.main:app --reload --port 8000 --env-file .env
pytest
```

The GitHub token needs no permissions, it only reads public repos. Get a Groq key at console.groq.com/keys.

## Known limitations

- Name matching can flag a genuine project that happens to share a common name, like a serious weather-data pipeline called `weather`. The README and commit signals usually balance it out.
- Starter README fingerprints are short paraphrases, not the full templates.
- Only the owner's own commits are counted, and only the latest 100.
- The cache lives in memory, so it resets when the free Render instance restarts.

## Next steps

- [ ] Compare code against real tutorial repos (top "netflix clone" repos on GitHub), not only names and READMEs
- [ ] GitHub OAuth and a one-click pull request that adds the new README
- [ ] Store scans in Postgres to show progress over time
