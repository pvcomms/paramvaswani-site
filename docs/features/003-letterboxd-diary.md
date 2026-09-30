---
title: Show the Letterboxd diary in the film section of /taste
status: shipped
created: 2026-09-30
---

# 003 — Show the Letterboxd diary in the film section of /taste

## Why

The film set on /taste is kept by hand and is empty. The diary already exists on Letterboxd.
Showing what was actually watched, next to the hand-kept set of what is rated, makes the page
honest about the gap between the two without anyone having to retype a log.

## What changes

- Before: film shows `∅ nothing here yet`.
- After: under the hand-kept set, a `diary` block lists the last N films logged on Letterboxd,
  newest first: poster, title, year, stars, liked, rewatch, the review's first lines, the date
  watched. Above it, the ratings across those N as ten half-star bars. Pointing at a bar dims
  every film outside that bin; pressing it holds the filter. Nothing is ranked or recommended.

Favourites (added 2026-09-30): above the diary, the four films pinned on the profile, drawn
poster-first in a row of four like Letterboxd shows them. Letterboxd serves profile pages behind
a bot check, so the build cannot read them; they are typed into `favourites` in
`letterboxd/config.json` as `"Title (Year)"`. Posters come from the diary feed when the film is
in it, otherwise from the film's Wikipedia summary, unless a favourite names its own `poster`
URL. An empty list renders nothing. Current four, set 2026-09-30: Control, Lost in Translation,
Reprise, TÁR. Slugs checked against Wikidata P6127 (Control is `control-2007`).

## Network

The build fetches `https://letterboxd.com/<user>/rss/` and 150×225 posters from
`a.ltrbxd.com`, plus Wikipedia's page-summary API and `upload.wikimedia.org` for favourite
posters not in the diary, or any image URL given as a favourite's `poster` (the current four
use `image.tmdb.org`). Readers fetch nothing from either host: posters are copied into `public/` and
served first-party, so the colophon's "no third-party requests" stays true. Links out to
letterboxd.com are plain links.

## Where

| File                     | Change                                                             |
| ------------------------ | ------------------------------------------------------------------ |
| `letterboxd/config.json` | `user` and `show`. The only thing a human edits                     |
| `letterboxd.py`          | stdlib sync (feed → `diary.json` + `posters/`) and render           |
| `taste.html`             | `letterboxd:begin/end` markers in film, diary CSS, the bin filter   |
| `build.py`, `dev.py`     | sync on build; inject the render into taste in both                 |
| `vercel.json`            | `/letterboxd/*` cached one day                                       |

## Acceptance

```bash
./letterboxd.py                                   # "letterboxd: N diary entries from /<user>, M posters"
./build.py && grep -c 'class="lb"' public/taste.html            # 1
grep -o 'src="https\?://[^"]*"' public/taste.html | wc -l       # 0 — no third-party requests
ls public/letterboxd/posters | wc -l                             # == show (or fewer)
```

With `user` empty, the build prints `no user … skipped` and `public/taste.html` has no `lb`
block. Both paths were run on 2026-09-30, the populated one against a public critic's feed
that was then deleted.

## Blocked

Connected to critiquealmass on 2026-09-30.

## Out of scope

No client-side fetch, no Letterboxd API key, no scheduled refresh. The diary is as fresh as
the last build.
