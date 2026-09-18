---
title: Give every figure a readable resting state under reduced motion
status: draft
created: 2026-09-19
---

# 002 — Give every figure a readable resting state under reduced motion

## Why

The figures animate continuously — the Galton machine drops, the drift balls wander. For a
reader with `prefers-reduced-motion` set, the honest behaviour is not to freeze frame one,
which is usually an empty apparatus, but to present the state the legend describes: the
distribution already formed, the drift already visible.

There is a second reason beyond accessibility. A figure that reads correctly when still is a
figure whose argument does not depend on motion, and that is a better figure. Building the
resting state is a design check, not only a compliance one.

## What changes

- Before: reduced motion either stops the animation at an uninformative moment or is not
  handled.
- After: each figure detects the preference and renders its settled state — the same thing a
  reader would see after watching it run.

## Where

| File                 | Change                                                                 |
| -------------------- | ---------------------------------------------------------------------- |
| `index.html`         | per-figure: branch on `matchMedia("(prefers-reduced-motion: reduce)")` |
| `figure-legend.html` | note the resting state in each figure's description                    |

## Out of scope

No toggle in the UI. The OS preference is the signal; adding a control puts the decision in
front of someone who already made it.

No change to the animated path for readers who have not set the preference.

## Acceptance checks

```bash
./dev.py    # then toggle Reduce Motion in System Settings and reload
```

- [ ] Each figure renders a state a reader can interpret without it moving
- [ ] The resting state matches what `figure-legend.html` says the figure shows
- [ ] With the preference off, behaviour is unchanged
- [ ] Checked in a real browser, not an embedded pane — panes suspend animation frames

## Notes

Audit which figures exist before starting; the list is in `figure-legend.html`.
