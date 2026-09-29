# SkillMap: Grade 6–8 math readiness MVP

SkillMap finds what a student already knows, where the gaps are, and what to learn next.

## Run it

Open `index.html` in any modern browser. It needs no build step, server or install.
Progress is saved in the browser's local storage, so it stays on that device and in that browser.

To host it, upload the whole folder to any static host (GitHub Pages, Netlify, Vercel, S3).

## How the code is organized

Scripts load in this order from `index.html`. Each file is one component.

| File | What it does |
|---|---|
| `js/knowledge-graph.js` | `KG`: the 20 skills, their prerequisites, grade and short "what to learn" text. Also graph helpers: `ancestors`, `dependents`, `depth`. |
| `js/curriculum-tree.js` | `Tree`: the subject → unit → topic → concept hierarchy. `Tree.score` averages each node's children. `grad()` is the coral → amber → green color scale. |
| `js/question-bank.js` | `QB`: 6 questions per skill (120 total). `GOALS`: the readiness-check goals. |
| `js/assessment.js` | `Assessment`: builds quizzes, draws questions at random and records right or wrong answers. A miss in a readiness check triggers one follow-up question. |
| `js/mastery.js` | `Mastery`: turns answers into a score for each skill (smoothed accuracy) and a status (mastered, developing, gap). |
| `js/store.js` | `Store`: saves and merges mastery in `localStorage`. |
| `js/planner.js` | `Planner`: `build()` makes the ordered learning path after a check. `recommend()` picks the "Recommended for you" topics. |
| `js/ui.js` | `UI`: all screens (home, goals, quiz, results, topic result) and the knowledge-tree drawing. |
| `css/styles.css` | Styles, including light and dark themes. |

## Common changes

- **Add a question:** add a row to a skill in `QB`, written as
  `["question", "correct answer", "wrong 1", "wrong 2", "wrong 3"]`.
  Options are shuffled when shown.
- **Add a skill:** add a row to `KG`, add its questions to `QB`, and place its id under a topic in `Tree.ROOT`.
- **Change what counts as mastered:** edit `Mastery.T` (default: 0.6 = mastered, 0.4 = developing).
- **Change the topic-quiz length:** edit `Assessment.TOPIC_LEN` (default 4).

`skillmap.html` holds the same app in a single file, handy for sharing or quick demos.
