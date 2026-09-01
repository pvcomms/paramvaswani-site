# paramvaswani-site — handoff

**State as of 2026-09-01, session 359ae23d (v9, label `v9-honest-edges`). Not published publicly.**
Continue in Claude Code. This folder is the working copy; the artifact is the live render.

## Everything, in one place

| what                               | where                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **The site**                       | `index.html` — artifact format (`<title>` line 1, NO doctype/html/head/body)                                |
| **Live artifact**                  | https://claude.ai/code/artifact/ab79be5a-60b8-4126-809b-90f0556f70e5                                        |
| **Companion: Reading the Figures** | `figure-legend.html` · https://claude.ai/code/artifact/b57df703-2efe-4d12-96c0-876abdbccd21                 |
| **Companion: What You Study**      | `POSITION.html` · https://claude.ai/code/artifact/4608ef2a-f8c0-4a1f-a427-500a74b7e048                      |
| **How to edit**                    | `EDITING.md` — file map, anchors, rules, sanity checks                                                      |
| **Dev server**                     | `./dev.py` → localhost:4173 (live; edit + refresh, no build)                                                |
| **Figma reference**                | `reference-figma/` — their App.tsx, content, plan                                                           |
| **Version control**                | git, initialised, one commit on `main`                                                                      |
| **Memory**                         | `project_paramvaswani_redesign.md` (v1→v9 decision log) · `project_sensemaking_instruments.md` (the thesis) |

To update the artifact from a new session, pass `url:` with the artifact URL so it updates in
place rather than creating a duplicate.

## START HERE (new session)

```bash
cd ~/Code/paramvaswani-site && ./dev.py
```

Then open **http://localhost:4173/** in a real browser (not the in-app pane — it freezes
animation; see Gotchas). Read `EDITING.md` for the file map and the rules. Edit `index.html`,
refresh, commit.

Paste this to kick off:

> Working on ~/Code/paramvaswani-site. Read HANDOFF.md and EDITING.md first — they have the
> file map, the settled decisions, the privacy rules, and the gotchas. The site is index.html
> (artifact format: no doctype/body tags — keep it that way). Run ./dev.py to preview at
> localhost:4173. Don't publish or deploy unless I say so. Here's what I want to change: ...

**Three open items** (details in Open honesty items below): the fig. 1 geometry disclaimer,
the fig. 4 "always" → "first" decision (yours), and fig. 5's hidden brick types.
**Ship-gates before any public URL** are further down — register the domain first.

## What the page is

One file, vanilla JS, Newsreader + IBM Plex Mono (the ONLY outbound request; see ship-gates).
Single dark theme, deliberately (artifact-design allows committed single-look). All engines run
on the **hybrid clocks** (`fixedLoop`/`frameLoop`, sept 1 polish pass): rAF-smooth rendering in
real browsers, `setInterval` watchdog fallback for rAF-less documents, fixed 30 ms physics
steps with interpolated canvas rendering (see gotchas + EDITING.md rule 3).

| piece        | what it is                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fig. 1 hero  | 5-domain venn (mind/body M, technology T, philosophy P, society S, creation C) + unlabeled off-record set. Click = filter (bloom glow, dashed halo, panel card), click again = deep-link (M→#log, T→#distribution, P→#cohere, S→#influences, C→#create), Esc clears. 7 named intersections + red me-dot at M∩T∩P (430,325). 2 drift balls + breathing me-dot = the 3 moving points. |
| fig. 2       | Panel with two views: **curve** (default; instant SVG normal curve, ±1σ bands w/ hover captions, "the feed's thumb" slider slides μ while the three overcorrection stations stay pinned) and **machine** (Galton board canvas; slider biases every peg; red tracked "me" ball; caps n=600).                                                                                         |
| fig. 3       | Influence graph, me-centered, idle wobble. Captions mark one-way edges as one-way; only feed↔me and (weakly) machines↔me are bidirectional — fixed in v9, do not re-inflate.                                                                                                                                                                                                        |
| four rooms   | 2×2 boxed panels = verb architecture (create/consume/curate/cohere) with enter→ links. Nav bar uses the same verbs.                                                                                                                                                                                                                                                                 |
| fig. 4       | Precedence tree (which value governs when), situation chips, privacy leaf ends early.                                                                                                                                                                                                                                                                                               |
| fig. 5       | Truth-seeker breakout: pass-through bricks bend the ball toward/away from a drifting "truth · approx." marker; paddle = JUDGMENT; score = live angle (gold ≤25°); field repopulates every 20 s.                                                                                                                                                                                     |
| thoughts.log | 4 dated tagged entries. `wiring` entry is at Param-approved abstraction.                                                                                                                                                                                                                                                                                                            |
| the tape     | Credence ticker (ledger quoted like market prices).                                                                                                                                                                                                                                                                                                                                 |

## Decisions that are settled (don't relitigate)

- **Hero = the 5 NOUN domains** (Param's call, 2026-08-31 night: he loves the words cognitive
  architecture / phenomenology / ai alignment / building your way out). The verb venn is retired;
  verbs live on as nav + rooms + sections. Two logic fixes applied to the Figma original:
  **Both/And moved to the 𝒰 frame** (it's the operator, not a region) and the center dot renamed
  **me** (red, breathing); added **power & consent (S∩P)** using Param's own vocabulary.
  Society∩Technology cannot exist with circles in this layout (planarity) — that beat is carried by
  fig. 2's feed-thumb, fig. 3's feed↔me edge, and thoughts.log; do NOT force the geometry.
- Intersections are labeled **only where the pure region geometrically exists** (verified by numeric
  scan — rerun the scan if circles move). Seven exist and are labeled: M∩T cognitive architecture,
  M∩S structural difference, M∩P phenomenology, T∩P ai alignment, T∩C building your way out,
  S∩P power & consent, **P∩C making as thinking** (v7: creation was moved to 665,430 r112 so it
  overlaps philosophy — it had been a tech-only satellite, which was wrong: the essays are creation
  ∩ philosophy). Hovering a pure two-set region now also **shades the actual lens** (clipPath pairs,
  fill-opacity 0.1) so the region being named is visible, not just implied.
- **RLHF dose: exactly two** — "Raised by the algorithm, realigning by hand." (bio) + "overcorrection"
  (fig. 2). The acronym never appears. Don't add more.
- **Society card text** ("Coercive structures leave marks…") is included at Param's explicit
  authorization (his words: text is good, subversive ok). **That sentence is the ceiling** — no
  specifics about people, events, family, or health, ever. Other standing exclusions: no meds, no
  diagnoses, no third parties, contact = hello@paramvaswani.com only.
- Withholding moves stay at three (off-record set, privacy leaf, colophon clause). No redaction
  theatrics. "fleet foxes ∧ yung lean" + "old ghosts" line = the full music-past dose (two nods).
- Cut and staying cut: values ticker-of-virtues (tape quotes the ledger instead), scroll-linked
  traveling dot, westward tree (lives as 2 ledger rows), reader-dot/localStorage gadgets.

## What this is (and isn't) — the north star

It is **not** a truth-seeking tool: only two parts can produce a result the author didn't
already hold (the Galton demo, which is real math, and the ledger, whose credences settle
and can be lost). It is **not** decoration either: decoration can't be wrong, and fig. 3
was wrong and got caught.

It is **an argument presented in the grammar of an instrument panel** — and the form is the
point. Figures, credences, and error bars impose obligations that prose doesn't: a named
intersection can be disputed, a published credence can be lost, a claimed region has to
actually exist in the geometry. A normal personal site ("I value nuance") is unfalsifiable.
This one can be caught.

**The failure mode to guard against, always:** instrument-grammar launders vibes as rigor.
A Venn makes an arbitrary taxonomy look derived; a credence makes a guess look measured.
A site about what mediation does to thinking, which itself uses authoritative-looking tools
without their obligations, becomes an instance of its own critique.

**So the rule for every future change:** does this add an obligation, or only the look of one?
Ship the first kind. The three open items below are all the same move — converting decoration
into commitment.

## Open honesty items (from the audit in the companion doc)

An audit of the figures' claims lives in `figure-legend.html` § "Is it actually grounded?".
One error was found and fixed (fig. 3 claimed every edge was bidirectional — only the feed and,
weakly, the machines actually are; captions now mark one-way edges as one-way). Three remain:

1. **fig. 1 geometry disclaimer** — five circles cannot represent all 31 combinations, so absent
   overlaps (e.g. society ∩ technology) are artifacts, not claims, and circle areas encode
   nothing. Add one line under the figure saying so. Recommended; cheap; converts a hidden
   weakness into a visible standard.
2. **fig. 4 "always"** — kindness always outranking rigor collides with "question everything"
   and "impact over intent". Either own it as a chosen commitment or change the edge to
   **"first"** (kindness gets the first word, not necessarily the last). **Param's call.**
3. **fig. 5 pre-labeled bricks** — green/violet are known before impact, so the game currently
   rewards obeying a known evidence hierarchy rather than discernment. Fix: grey bricks until
   hit, reveal type on impact. Bigger change; strengthens the thesis.

## Ship-gates before ANY public URL

1. **Register paramvaswani.com first** (Spaceship MCP ready; needs Param's explicit go — it's a
   purchase). hello@ is an interception vector until then (RDAP 404 verified 2026-08-31).
2. **Self-host fonts** in the Next.js port (next/font). The prototype colophon owns the single
   Google Fonts request honestly; production should have zero outbound.
3. Port target: Next.js App Router + Tailwind, deploy over paramvaswani.vercel.app
   (team pvbuildsfr), then GEO playbook (llms.txt, robots, JSON-LD), keep content in a
   `content/site.ts`-style file Param can edit.

## Gotchas (hard-won)

- **The in-app browser pane is a permanently-hidden document**: no rAF ever fires, timers clamp to
  ~1 Hz, IntersectionObserver may never call back, screenshots go stale, tabs can degrade to a 0×0
  viewport (`innerWidth === 0`). Hence the hybrid clocks (EDITING.md rule 3): rAF for real
  browsers, `setInterval` watchdog so the pane still ticks at its clamped ~1 Hz, IO +
  `visibilitychange` gating on every engine (drift + wobble included since the sept 1 polish
  pass). **Verify animations in a real browser**; verify logic in the
  pane with synthetic events after monkey-patching
  `svg.getBoundingClientRect = () => ({left:0,top:0,width:900,height:640})`.
- A PostToolUse prettier hook reformats this file on Write/Edit — re-grep before exact-match edits.
- Physics went through headless Node sims (Galton: p=.65 ⇒ mean +53.2px vs 54 theory; breakout:
  ~38 updates/min after fixing a vertical-lock orbit + a stuck endgame via 20 s repopulation).
  If you touch the physics, re-sim the same way.
- prefers-reduced-motion paths exist for everything; keep them when adding motion.

## Reference

`reference-figma/` = the Figma Make export Param provided (App.tsx has their venn glow/panel
implementation and domain copy; figma-plan.md their plan). Ported already: bloom filter, 3-state
opacity (0.72/0.12/1), tint fills, dashed selection halo, staggered 2.4 s draw-on, info-panel
grammar, σ-band hover fills + captions. Their fonts (Inter/DM Serif/JetBrains) were NOT adopted —
site stays Newsreader + Plex Mono.

## Sensible next steps (in order)

1. Open the artifact in a real browser with Param; collect reactions per figure.
2. Next.js port (respect ship-gates; one component per figure; content extracted to data files).
3. Re-run an adversarial review fleet on the port (the v2 review prompts are in the session
   transcript; five lenses: code, taste, voice, privacy, a11y).
4. Domain + email + deploy, only after gate 1.
