# Editing the site

`index.html` is one self-contained file (~3,940 lines): CSS at the top, markup in the
middle, JavaScript at the bottom. No build step, no dependencies, no framework.

**It is in artifact format** — `<title>` on line 1, then `<link>`, `<style>`, markup, `<script>`.
There is deliberately **no `<!doctype>`, `<html>`, `<head>`, or `<body>` tag**; the artifact
wrapper adds those at publish time, and `dev.py` adds the same wrapper locally. Keep it that way
or publishing breaks.

## Run it

```bash
cd ~/Code/paramvaswani-site && ./dev.py
```

- site → http://localhost:4173/
- legend → http://localhost:4173/legend
- positioning → http://localhost:4173/position

Edit any `.html`, save, hit refresh. That's the whole loop. **Use a real browser** — the
in-app browser pane suspends animation frames, so the Galton machine, the drift balls, and
the breakout will all look frozen there (see Gotchas in HANDOFF.md).

## Where things live in index.html

Line numbers drift as you edit — grep the anchor text instead. Anchors are stable.

### Content you'll actually want to change

| what                           | grep for                          | ~line |
| ------------------------------ | --------------------------------- | ----- |
| Name in masthead               | `class="brand"`                   | 1266  |
| Nav links                      | `<nav>`                           | 1267  |
| Intro / bio paragraphs         | `class="intro reveal"`            | 1369  |
| Essay list                     | `<div class="sub reveal">essays`  | 1590  |
| Projects list                  | `<div class="sub reveal">systems` | 1652  |
| Reading / watching / listening | `============ CONSUME`            | 1723  |
| Curate list (people you rate)  | `============ CURATE`             | 1810  |
| Standing contradictions        | `class="pairs reveal"`            | 1994  |
| The ledger (credences)         | `table class="ledger`             | 2008  |
| Principles                     | `ol class="principles"`           | 2068  |
| Currently                      | `ul class="current"`              | 2124  |
| thoughts.log entries           | `============ THOUGHTS.LOG`       | 2204  |
| Ticker tape                    | `============ THE TAPE`           | 2287  |
| Footer / contact / colophon    | `<footer id="contact"`            | 2312  |

### Figure content (text lives in JS objects, not markup)

| what                             | grep for            | ~line |
| -------------------------------- | ------------------- | ----- |
| Venn domain descriptions         | `var SET_COPY = {`  | 2374  |
| Venn intersection names + lines  | `var PAIRS = {`     | 2386  |
| Influence graph nodes + notes    | `var NODES = [`     | 3093  |
| Precedence tree leaf notes       | `var leafNotes = {` | 3307  |
| Precedence chip routes + rulings | `var ROUTES = {`    | 3348  |
| Breakout brick labels (good)     | `var SIGNAL = [`    | 3500  |
| Breakout brick labels (bad)      | `var NOISE = [`     | 3509  |

### Structure blocks

Markup: FIG 1 VENN 1276 · INTRO 1368 · FIG 2 GALTON 1384 · FOUR ROOMS 1482 · CREATE 1582 ·
CONSUME 1723 · FIG 3 GRAPH 1761 · CURATE 1810 · COHERE 1866 · FIG 5 BREAKOUT 2143 ·
THOUGHTS.LOG 2204 · TAPE 2287

JavaScript: PANELS 2345 · FIG 1 VENN 2363 · FIG 2 GALTON 2583 · FIG 3 GRAPH 3088 ·
FIG 4 GOVERNOR 3267 · HERO DRIFT 3419 · FIG 5 BREAKOUT 3483 · LEDGER 3893 · TAPE 3918 ·
REVEALS 3922

## Rules that will bite you if you break them

1. **Venn geometry and the JS `sets` array must match.** Circle positions exist twice — as SVG
   attributes (`cx/cy/r` on `.tint`, `.halo`, `.set`, and the `clipPath` defs) and in the JS
   `sets` array used for hit-testing. Change one, change all. Then re-run the region scan
   (below) before adding or moving any intersection label.

2. **Only label intersections that geometrically exist.** Five circles cannot show all 31
   combinations. Before naming a region, verify it has real area:

   ```bash
   cd ~/Code/paramvaswani-site && python3 - <<'PY'
   D=[{'id':'M','cx':300,'cy':255,'r':178},{'id':'T','cx':560,'cy':255,'r':178},
      {'id':'P','cx':430,'cy':445,'r':152},{'id':'S','cx':190,'cy':420,'r':115},
      {'id':'C','cx':665,'cy':430,'r':112}]
   b={}
   for x in range(18,882,2):
     for y in range(16,622,2):
       m=''.join(sorted(c['id'] for c in D if (x-c['cx'])**2+(y-c['cy'])**2<=c['r']**2))
       if m: b.setdefault(m,[0,0,0]); b[m][0]+=1; b[m][1]+=x; b[m][2]+=y
   for k,v in sorted(b.items(), key=lambda kv:-kv[1][0]):
     print(f"{k:6} area {v[0]*4:7d}  centroid {v[1]//v[0]},{v[2]//v[0]}")
   PY
   ```

3. **All animation goes through the hybrid clocks** (`fixedLoop` / `frameLoop`, between the
   `clocks:begin` / `clocks:end` markers). They render on `requestAnimationFrame` in real
   browsers (vsync-smooth) but keep a `setInterval` watchdog so documents where rAF never
   fires (the in-app pane) still tick — same behavior the old pure-`setInterval` engines had.
   Physics still steps at a fixed 30 ms cadence (`fixedLoop`), so the Node sims stay valid;
   canvases interpolate between steps at render time. Never call rAF directly outside the
   clocks block; if you add animation, drive it with one of these two.

4. **Keep `prefers-reduced-motion` paths.** Every animated figure has a static fallback that
   still communicates its claim. Don't add motion without one.

5. **Privacy rules are hard limits.** No health, family, diagnoses, meds, third parties, or
   anything beyond the abstraction level already in the society card. Contact stays
   `hello@paramvaswani.com` only. Three withholding moves, no fourth.

## Sanity checks after editing

```bash
cd ~/Code/paramvaswani-site
# tag balance
python3 -c "import re;s=open('index.html').read();print('div',len(re.findall(r'<div\b',s)),len(re.findall(r'</div>',s)));print('svg',s.count('<svg'),s.count('</svg>'));print('section',s.count('<section'),s.count('</section>'))"
# artifact format intact
head -1 index.html && grep -c '<body' index.html   # want: <title>... and 0
# no stray rAF outside the hybrid clocks (both numbers must match)
grep -c requestAnimationFrame index.html
sed -n '/clocks:begin/,/clocks:end/p' index.html | grep -c requestAnimationFrame
```

Then load it in a real browser and check the console is clean.

## Publishing

The site is a private artifact. To update it **from a new session**, pass the URL so it updates
in place instead of creating a duplicate:

> Artifact tool → `file_path: ~/Code/paramvaswani-site/index.html`,
> `url: https://claude.ai/code/artifact/ab79be5a-60b8-4126-809b-90f0556f70e5`

Ship-gates before any _public_ URL are in HANDOFF.md — register the domain first.

## Git

Already initialised, one commit on `main`. Commit as you go so you can revert:

```bash
cd ~/Code/paramvaswani-site && git add -A && git commit -m "what changed"
git diff HEAD~1                      # see last change
git checkout -- index.html           # discard uncommitted edits
```
