---
title: Pin the Figma sources for every screen
status: draft
created: 2026-09-19
---

> **Blocked on Param: the Figma URLs exist only in his account, nowhere on disk. An agent
cannot do this one. Promote to `next` once the pins are pasted in.**

# 001 — Pin the Figma sources for every screen

## Why

Design for this site happens in Figma. Nothing in the repo records which Figma file or node a
given screen came from — a search across both site repos returns zero Figma URLs. The
consequence is that any agent asked to implement or adjust a screen has to guess at spacing,
scale and hierarchy that a pinned frame already answers exactly, and guessing produces the
generic result the whole design stance exists to avoid.

The fix is thirty minutes of pasting links, and it converts every future UI task from
"interpret this description" into "match this frame".

## What changes

- Before: `docs/DESIGN.md` has an empty pin table and `reference-figma/` holds an exploration
  that the site was not built from.
- After: every screen and significant component names the Figma file and node it comes from,
  and `reference-figma/` is labelled as history so nobody implements from it by mistake.

## Where

| File                        | Change                                                       |
| --------------------------- | ------------------------------------------------------------ |
| `docs/DESIGN.md`            | fill the pin table — file URL + node id per screen           |
| `reference-figma/README.md` | new. one paragraph: this is the 2026 exploration, not a spec |

## Out of scope

No redesign. No token changes. No exporting assets from Figma into the repo — pins are links,
and the tokens already live in `index.html`.

Do not wire the Figma MCP into the build. Agents read the pin and the token table; pulling
live design context on every task costs tokens and breaks without auth.

## Acceptance checks

- [ ] Every row in the `docs/DESIGN.md` pin table has a real Figma URL or is deleted
- [ ] Each URL opens to the specific node, not just the file
- [ ] `reference-figma/` carries a README saying it is history
- [ ] A node whose design no longer matches the live site is marked as such rather than pinned
      silently

## Notes

Only Param can do this one — the URLs are in his Figma account and exist nowhere on disk.
It stays `next` until he pastes them.
