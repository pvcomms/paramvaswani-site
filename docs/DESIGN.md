# Design

Grammar and bans: `~/Code/cfap/docs/DESIGN-SYSTEM.md`. Machine-readable values:
`~/Code/cfap/docs/tokens.json` under `surfaces.paramv`. This file is what is specific to
this site.

## Tokens

Defined in the `:root` block at the top of `index.html`, which is the source of truth. The
cfap mirror exists for agents and must be updated alongside any change here.

| Token                   | Value                 | Use                               |
| ----------------------- | --------------------- | --------------------------------- |
| `--ink`                 | `#0b0c0e`             | the ground                        |
| `--paper`               | `#e9e6de`             | body text                         |
| `--dim`                 | `#96917f`             | secondary text                    |
| `--faint` / `--faint-t` | `#807c6c` / `#8c8777` | tertiary, captions                |
| `--hair`                | `#26272a`             | hairline rules                    |
| `--hair-2`              | `#66635a`             | emphasised rules                  |
| `--edge`                | `#3a3b3e`             | borders on interactive elements   |
| `--panel-bar`           | `#101216`             | figure chrome                     |
| `--serif`               | Newsreader            | prose                             |
| `--mono`                | IBM Plex Mono         | instrument readings, labels, meta |

Dark only. There is no light theme and adding one is not a small change — the figures are
tuned against this ground.

## The six modes

The wheel the figures are keyed to. These are **semantic**, not a decorative palette. Do not
reuse them for chrome, and do not add a seventh without deciding what it means.

| Mode     | Token          | Hex       |
| -------- | -------------- | --------- |
| Create   | `--c-create`   | `#7fb069` |
| Consume  | `--c-consume`  | `#b48ede` |
| Curate   | `--c-curate`   | `#6fa8dc` |
| Cohere   | `--c-cohere`   | `#e3c567` |
| Me       | `--c-me`       | `#e07a6b` |
| Creation | `--c-creation` | `#d98aa8` |

## Type

Newsreader for everything read as a sentence. IBM Plex Mono for anything that should read as
an instrument reading rather than prose — figure labels, axis ticks, eyebrows, metadata —
small, letter-spaced, in `--dim` or `--faint`, never in `--paper`.

Both self-hosted as `.woff2` in `fonts/`, copied into `public/fonts/` by the build and cached
immutable. No CDN, ever.

## Figma pins

> **Empty on purpose.** There are no Figma URLs anywhere in this repo, so nothing is recorded
> here rather than something invented. Design happens in Figma; paste the file and node links
> as each screen is designed, and an agent implementing it reads the pin plus the tokens above
> instead of guessing.

| Screen / component  | Figma node | Notes |
| ------------------- | ---------- | ----- |
| Home — hero         | —          |       |
| Home — figure frame | —          |       |
| Reading the Figures | —          |       |
| What You Study      | —          |       |

`reference-figma/` holds the original design exploration — `App.tsx`, `content.md`,
`figma-plan.md`. It is history, not a spec: the site was not built from it and it does not
describe the current design.

## Motion

One curve, `cubic-bezier(0.16, 1, 0.3, 1)`. The figures animate continuously by their own
logic; page chrome does not. Nothing autoplays that asks for attention it was not given.

Honour `prefers-reduced-motion`: figures should reach a readable resting state rather than
animating, since the resting state is what the legend describes.
