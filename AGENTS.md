# Agents

Constellation-wide rules: `~/Code/cfap/AGENTS.md`. Read it once, then this.

**This repo is `paramv.com`.** The similarly-named `~/Code/paramvaswani` is a separate
broadsheet experiment that serves nothing — do not confuse them, and do not edit it thinking
you are editing the live site.

## Stack

One self-contained `index.html` (~3,940 lines): CSS at the top, markup in the middle, vanilla
JS at the bottom. No framework, no dependencies, no bundler. `build.py` (Python 3, stdlib)
wraps the fragments into real documents and emits `public/`.

## Commands

```bash
./dev.py                      # localhost:4173, edit any .html and refresh. no build
./build.py                    # → public/. generated, never edited by hand
vercel --prod --yes           # deploys public/. run build.py FIRST or you ship the old one
```

## The format rule — break this and publishing breaks

`index.html`, `figure-legend.html` and `POSITION.html` are **artifact fragments**: `<title>`
on line 1, then `<link>`, `<style>`, markup, `<script>`. There is deliberately **no**
`<!doctype>`, `<html>`, `<head>` or `<body>` tag. `build.py` and `dev.py` add the wrapper.
Never "fix" this by adding them.

```bash
grep -c '<body' index.html    # must be 0
```

## Invariants

**`public/` is generated.** Editing it directly is always wrong, and the edit is lost on the
next build. The sources are the three fragment files.

**Fonts are self-hosted.** Newsreader and IBM Plex Mono as `.woff2` in `fonts/`, copied to
`public/fonts/` by the build, cached immutable by `vercel.json`. Never add a Google Fonts
link or any CDN reference.

**No analytics, no third-party scripts, no trackers.** `vercel.json` sets
`interest-cohort=()` along with the other headers. Keep them.

**The figures are the argument.** They are interactive instruments a reader operates, not
decoration. A change that makes one prettier and less operable is a regression.

## Traps

**Use a real browser to check the figures.** An embedded preview pane suspends animation
frames, so the Galton machine and the drift balls look broken when they are fine.

**`./build.py` before every deploy.** Deploying without it ships the previous `public/`. This
is the single most likely way to publish a stale site.

**paramv.com resolves via `A @ 76.76.21.21`, the legacy Vercel IP,** and DNS is at **Wix**,
not Spaceship or GoDaddy. It works. Vercel's current recommendation is `216.150.1.1` — if the
record is ever rebuilt, read the correct value from the domain's `/config` endpoint rather
than copying either number from memory.

## Where the rest is

`EDITING.md` — file map, anchors, content rules, sanity checks. Read before editing content.
`HANDOFF.md` — long-form history and settled decisions.
`docs/ARCHITECTURE.md` — the map. `docs/DESIGN.md` — Figma pins and tokens.
`.cursor/rules/site.mdc` — the same rules, for Cursor.
