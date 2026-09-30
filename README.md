# paramv.com

The personal site. One file, no framework, no dependencies, no build tooling beyond a Python
script that wraps seven HTML fragments into documents.

Live at **[paramv.com](https://paramv.com)**.

```bash
./dev.py     # localhost:4173 — edit, save, refresh
```

## What it is

The personal site: essays, a register of builds, principles, a ledger, a running log, and the
pages below. The six figures, "Reading the Figures" and "What You Study" moved to the Center on 2026-09-30: postphenom.com/figures, /figures/legend and /position, served as static HTML from `~/work/capp/site/site/public/`.

Seven pages, seven files:

| File                 | Page                                            |
| -------------------- | ----------------------------------------------- |
| `index.html`         | the site, drawn as a Venn                       |
| `taste.html`         | Media Taste — eleven forms, kept by hand        |
| `curriculum.html`    | Learning Curriculum — the current syllabus      |
| `about.html`         | About — now, before, credentials                |
| `work.html`          | Work                                            |
| `cognitive-scaffolding.html` | generated: /systems/cognitive-scaffolding |

`/principles`, `/ontology` and `/systems` (with `/systems/how-i-work` and
`/systems/environment`) were removed on 2026-09-30; their sources are in git history (`git show
3809feb:principles.html`). `/taste` was removed the same day and restored on Param's word. `/systems/cognitive-scaffolding` stays, with no page above it.

## How it is built

The seven files are **artifact fragments** — `<title>` on line one, no doctype, no `<html>`,
no `<head>`, no `<body>`. `build.py` wraps each in a real document with meta, Open Graph and
JSON-LD, copies the fonts, and writes `public/`. `dev.py` applies the same wrapper live so
what you see locally is what ships.

`public/` is generated. Never edit it.

## Constraints it keeps

Fonts are self-hosted `.woff2` — Newsreader for prose, IBM Plex Mono for instrument readings.
No CDN, no Google Fonts, no analytics, no third-party scripts. Security headers and
`interest-cohort=()` are set in `vercel.json`. A site arguing that attention is worth
defending does not leak its readers' to anyone.

## More

`EDITING.md` for the file map and content rules. `AGENTS.md` for the agent contract.
`docs/` for architecture, design pins and the feature queue.
