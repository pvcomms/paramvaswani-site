# paramvaswani-site

Single-file personal site. Vanilla JS, no framework, no build step, no dependencies.

**Start here:** `EDITING.md` (file map, anchors, rules) · `HANDOFF.md` (settled decisions,
ship-gates, gotchas).

**Run:** `./dev.py` → http://localhost:4173 — edit any `.html`, save, refresh. No build.

**Critical format rule:** `index.html`, `figure-legend.html`, and `POSITION.html` are artifact
fragments — `<title>` on line 1, and deliberately **no** `<!doctype>`, `<html>`, `<head>`, or
`<body>` tags. The publish wrapper adds them. Never add them manually.

**Do not deploy publicly.** The domain is unregistered and fonts aren't self-hosted; ship-gates
are in `HANDOFF.md`. Private commits are fine.

Full rules for AI agents: `.cursor/rules/site.mdc`.
