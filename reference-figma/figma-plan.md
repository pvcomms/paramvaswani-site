# Personal Website — Rationalist Neurophilosopher

## Context

Build a single-page personal website blending:
- **Eileenie.net**: dark canvas, neon-outlined overlapping-circle Venn diagram hero
- **Nabeel S. Qureshi**: structured linear content, clean serif typography, dark theme
- **Harley Claes / old-internet charm**: playful personality without kitsch overload

The site must communicate intellectual depth, rationalist sensibility, and neurophilosophical identity with subtle interactivity.

---

## Aesthetic stance

**Stance**: Swiss-meets-kinetic on a deep dark canvas  
**Ground**: `#090910` near-black with slight violet cast  
**Palette**:
- Background: `#090910`
- Foreground: `#e2ddd6` (warm off-white)
- Muted: `#4a4860` (subdued purple-grey)
- Accent/links: `#7eb8d4` (steel blue)
- Venn circle 1 (outer): `#4ade80` (neon green)
- Venn circle 2: `#c084fc` (violet)
- Venn circle 3: `#38bdf8` (sky blue)
- Venn circle 4 (inner): `#facc15` (yellow)
- Venn circle 5 (innermost): `#f472b6` (pink/magenta)

**Fonts** (Google Fonts via CSS `@import` at top of `src/index.css`):
- Display: `DM Serif Display` — headings, section titles
- Body: `Inter` — prose, nav, descriptions
- Mono: `JetBrains Mono` — labels, timestamps, principle numbers

---

## Structure

All content lives in a single scrollable `App.tsx`. Sections are anchored for nav links.

### 1. Navigation bar
- Fixed top, full width
- Left: name ("Your Name")
- Right: Writing · Projects · Principles · Current Thoughts
- Dark background with thin bottom border, slight blur backdrop

### 2. Hero section
- Full viewport height, dark canvas
- **Animated SVG Venn diagram** (5 nested/overlapping circles, each a different neon stroke color):
  - Outermost: "Mind"
  - Next: "Philosophy"  
  - Next: "Neuroscience"
  - Small overlapping: "Language"
  - Innermost intersection: "You"
- Circles animate in with a slow draw-on stroke-dashoffset effect (CSS animation)
- Name and tagline text overlaid to the left ("Rationalist. Neurophilosopher. Builder.")
- Small intro paragraph beneath

### 3. Writing section
- Section label "WRITING" in mono small-caps
- Linear list of essays: title (teal link), date (muted mono), one-line description
- 5–6 realistic entries covering philosophy, neuroscience, AI, language

### 4. Projects section
- Section label "PROJECTS"
- 2-column asymmetric grid: each card shows project name, tech stack tags (mono), description
- 4 projects: Python/ML focus, plus a language/cognition tool

### 5. Principles section
- Section label "PRINCIPLES"
- Numbered list (mono numbers) with bold principle title + short explanation
- 5 principles on: epistemic humility, calibration, individuality, moral seriousness, anti-sycophancy

### 6. Current Thoughts (blog-like)
- Section label "CURRENT THOUGHTS"
- Stack of thought entries with timestamp, topic tag, and 2–3 sentence reflection
- Subtle left border accent on each entry

### 7. Big Nuance — Create / Consume / Curate / Coherence
- 2×2 grid with each quadrant labeled and described
- Faint grid lines, mono labels

### 8. Footer
- Minimal: links (email, GitHub, Twitter), year

---

## Files to modify

| File | Change |
|---|---|
| `src/index.css` | Add Google Fonts `@import` at top; add Tailwind v4 `@theme` tokens |
| `src/App.tsx` | Full replacement with all sections and SVG Venn diagram |

No new files needed; `App.tsx` self-contains all section components.

---

## Implementation notes

- SVG Venn diagram uses `stroke-dasharray` + `stroke-dashoffset` CSS animation (`@keyframes draw`) for the circle draw-on effect; circles stagger with `animation-delay`
- Nav uses `position: fixed` with `backdrop-filter: blur(12px)` and a dark semi-transparent background
- Hover on essay/project titles: teal underline transition
- All section containers use `max-width: 680px` centered (matching Nabeel's column width)
- Responsive: below 768px, nav collapses to vertical, project grid becomes 1-col
- No router needed — smooth-scroll `href="#section-id"` anchors

---

## Verification

1. Confirm Venn circles animate on load (stroke draw-on)
2. Nav links scroll to correct sections
3. All fonts load (DM Serif Display, Inter, JetBrains Mono)
4. Project grid collapses on narrow viewport
5. No console errors
