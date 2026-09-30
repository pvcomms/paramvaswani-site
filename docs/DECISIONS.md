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
`~/work/capp/spine` exists to stop: hand-written claims drifting from the system while still
reading as authoritative.

---

**2026-09-19 — Doc set adopted.**
Repo joined the `CAPP` constellation standard. `EDITING.md` and `HANDOFF.md` are kept — they
are good and specific — with `AGENTS.md` pointing at them.

---

**2026-09-30 — Letterboxd is fetched at build time, never by the reader.**
The film diary on /taste comes from the public RSS feed, pulled by `letterboxd.py` during
`./build.py`, with posters downloaded and served from `/letterboxd/posters/`. A client-side
embed would have been simpler and would have made every reader's browser call Letterboxd,
which breaks the no-third-party-requests rule. The cost is freshness: the diary updates when
the site is built. `diary.json` and `posters/` are committed so an offline build still ships
the last good copy.

---

**2026-09-30 — The figures moved to the Center.**
The six figures, "Reading the Figures" and "What You Study" moved to the Center on 2026-09-30: postphenom.com/figures, /figures/legend and /position, served as static HTML from `~/work/capp/site/site/public/`. Param's call: the instruments belong to the institution, the personal site keeps the
person. They moved as they were (same dark look, same code); fig. 1's two circles that lead to
rooms still on paramv.com (thoughts.log, create) link back here. No redirects from the old
paramv.com URLs, by his choice.

---

**2026-09-30 — The venn came back.**
Hours after the move, Param wanted fig. 1 back on the home page. It was restored from the
pre-move commit (markup, its script module, the hero drift layer, the clock helpers, its CSS)
and stays on postphenom.com too. Two of its circles now lead off-site: technology → fig. 2 and
society → fig. 3 at postphenom.com/figures.

---

**2026-09-30 — The home page is the venn, and the venn is the site.**
Param: only the venn on the home page, everything below it gone, the venn reflecting the
nav. Intro, rooms, create/consume/curate/cohere, ledger, register and log came off (their
script modules and CSS with them); the footer keeps the address, which `contact` points at.
The five sets are now pages — mind/body → curriculum, technology → systems, philosophy →
principles, society → taste, creation → work — with the ids unchanged so geometry and pairs
hold. 𝒰 is the ontology (its label links there); the dashed unlabeled set is contact. The
seven overlaps were renamed for what each pair shares: cognitive scaffolding, influences, the
examined life, ai policy, how i work, discernment, lab of self. Click once to filter, again
to open the page. postphenom.com keeps the original domains version.
