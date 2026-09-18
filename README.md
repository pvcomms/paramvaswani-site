# paramv.com

The personal site. One file, no framework, no dependencies, no build tooling beyond a Python
script that wraps three HTML fragments into documents.

Live at **[paramv.com](https://paramv.com)**.

```bash
./dev.py     # localhost:4173 — edit, save, refresh
```

## What it is

An argument about what machine mediation does to human judgment, made in a form the reader can
operate rather than only read. The figures are the substance: a Galton machine, drift balls,
the six-mode wheel. They are small instruments, and using one is meant to produce the feeling
the surrounding paragraph is claiming.

Three pages, three files:

| File                 | Page                                            |
| -------------------- | ----------------------------------------------- |
| `index.html`         | the site                                        |
| `figure-legend.html` | Reading the Figures — how each instrument works |
| `POSITION.html`      | What You Study — the positioning statement      |

## How it is built

The three files are **artifact fragments** — `<title>` on line one, no doctype, no `<html>`,
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
