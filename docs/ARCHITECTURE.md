# Architecture

> The map. `EDITING.md` is the detailed file map and content rules — this is the shape.

## In one paragraph

Three hand-written HTML fragments, one Python build script, one output directory. No
framework, no dependencies, no bundler, no JavaScript toolchain at all. `build.py` wraps each
fragment in a real document with meta, Open Graph and JSON-LD, copies self-hosted fonts, and
writes `public/`, which is what Vercel serves. `dev.py` applies the identical wrapper on the
fly so local and production render the same thing.

## The tree

```
paramvaswani-site/
  index.html           the site. CSS top, markup middle, vanilla JS bottom. ~3,940 lines
  figure-legend.html   "Reading the Figures" — how each instrument works
  POSITION.html        "What You Study" — the positioning statement
  build.py             fragments → public/. wrapper, meta, OG, JSON-LD, fonts
  dev.py               localhost:4173, same wrapper, no build
  vercel.json          cleanUrls, security headers, immutable font caching
  fonts/               Newsreader + IBM Plex Mono, .woff2, self-hosted
  public/              GENERATED. never edit
  reference-figma/     the original design exploration. reference only, not built from
  EDITING.md           file map, anchors, content rules, sanity checks
  HANDOFF.md           long-form history and settled decisions
```

## Build flow

```
index.html          ┐
figure-legend.html  ├──▶ build.py ──▶ public/{index,legend,position}.html
POSITION.html       ┘        │              + llms.txt, robots.txt, sitemap.xml
                             └──▶ public/fonts/   (copied)
                                       │
                                  vercel --prod
```

The fragment format is the load-bearing detail: `<title>` on line 1, and no `<!doctype>`,
`<html>`, `<head>` or `<body>`. The wrapper supplies those. `grep -c '<body' index.html` must
return 0.

## The figures

The interactive instruments in `index.html` are the argument, not illustration. Each is
vanilla JS driving a canvas or SVG, keyed to the six-mode colour wheel in `docs/DESIGN.md`.
They are documented for readers in `figure-legend.html`, which is the thing to update when a
figure's behaviour changes.

Animation frames are suspended by embedded preview panes. Check them in a real browser.

## Invariants

`public/` is generated. Fonts self-hosted, no CDN, no analytics, no third-party scripts. The
fragment format is never "fixed". `./build.py` runs before every deploy.

## Known sharp edges

**`~/Code/paramvaswani` is a different repo** — a broadsheet Next.js experiment that serves
nothing. This one is paramv.com. The names are one character apart and the mistake is easy.

`public/` is gitignored per `HANDOFF.md` but present on disk; it is a build artefact either
way and its contents are never the source of truth.

DNS is at Wix, not the registrar you would guess, on the legacy Vercel apex IP.
