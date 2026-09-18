# Decisions

Append-only. Newest last. Long-form history is in `HANDOFF.md`; this is the short list of
things that should not be re-argued.

---

**2026-09 — Artifact-fragment format, kept deliberately.**
`index.html`, `figure-legend.html` and `POSITION.html` carry `<title>` on line 1 and no
doctype, `<html>`, `<head>` or `<body>`. The wrapper is supplied by `build.py` and by
`dev.py` identically. It looks like a mistake to every tool and every agent that sees it; it
is the format the source is authored in and "fixing" it breaks publishing.

---

**2026-09 — No framework, no dependencies, no bundler.**
The site is one file of hand-written HTML, CSS and vanilla JS, built by a stdlib Python
script. It loads instantly, has no supply chain, and will still build in five years.

---

**2026-09 — Fonts self-hosted, no analytics, no third-party scripts.**
A site arguing that attention is worth defending does not hand its readers to anyone. Fonts
are `.woff2` in the repo; `vercel.json` sets `interest-cohort=()` alongside the other
security headers.

---

**2026-09 — The figures are the argument.**
They are instruments a reader operates, not illustrations of a point made in prose. A change
that improves how a figure looks while reducing what it lets a reader do is a regression, and
`figure-legend.html` is updated whenever a figure's behaviour changes.

---

**2026-09-17 — v10 shipped; dark-only.**
There is no light theme. The figures are tuned against `--ink`, so adding one is a real
project rather than a token swap.

---

**2026-09-19 — Stale docs corrected.**
`AGENTS.md` said "do not deploy publicly — the domain is unregistered and fonts aren't
self-hosted" while the site was live at paramv.com with self-hosted fonts. `HANDOFF.md` still
led with the resolved `pvbuildsfr` billing block. Both corrected. This is the failure mode
`~/Code/cfap` exists to stop: hand-written claims drifting from the system while still
reading as authoritative.

---

**2026-09-19 — Doc set adopted.**
Repo joined the `cfap` constellation standard. `EDITING.md` and `HANDOFF.md` are kept — they
are good and specific — with `AGENTS.md` pointing at them.
