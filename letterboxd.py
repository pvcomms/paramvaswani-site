#!/usr/bin/env python3
"""
Letterboxd -> the film section of /taste.

    ./letterboxd.py            refresh letterboxd/diary.json and letterboxd/posters/ from the RSS feed
    ./build.py                 calls the same refresh, then renders the diary into taste.html

Readers never talk to Letterboxd. The feed and the posters are fetched here, at build time, and
shipped as first-party files, so /taste keeps its "no third-party requests" promise.

letterboxd/config.json is the only thing to edit:

    {"user": "<letterboxd username>", "show": 24,
     "favourites": ["Good Time (2017)", "Saltburn (2023)", ...]}

favourites are the four pinned on the profile. Letterboxd serves profile pages behind a bot
check, so they cannot be read automatically; they are typed here in the order they are pinned.
A favourite can also be {"title": ..., "year": ..., "slug": ...} when the letterboxd url slug
is not simply the title. Posters come from the diary when the film is in it, else Wikipedia.
An empty user means the section renders nothing and the page looks exactly as it did before.
diary.json and posters/ are written by this script and committed, so a build with no network
still ships the last good copy.
"""
import html, json, pathlib, re, sys, urllib.parse, urllib.request
import xml.etree.ElementTree as ET

ROOT = pathlib.Path(__file__).parent
DIR = ROOT / "letterboxd"
CONFIG = DIR / "config.json"
DIARY = DIR / "diary.json"
POSTERS = DIR / "posters"
UA = "paramv.com build (+https://paramv.com)"
NS = {"lb": "https://letterboxd.com", "tmdb": "https://themoviedb.org"}
BEGIN, END = "<!-- letterboxd:begin", "<!-- letterboxd:end -->"


def config():
    try:
        c = json.loads(CONFIG.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        c = {}
    favs = []
    for f in c.get("favourites") or []:
        if isinstance(f, str):
            m = re.match(r"^(.*?)\s*\((\d{4})\)\s*$", f)
            f = {"title": m.group(1), "year": m.group(2)} if m else {"title": f.strip()}
        if isinstance(f, dict) and f.get("title"):
            favs.append({"title": str(f["title"]).strip(), "year": str(f.get("year") or ""),
                         "slug": str(f.get("slug") or "") or slugify(f["title"])})
    return {"user": str(c.get("user") or "").strip().strip("/"), "show": int(c.get("show") or 24),
            "favourites": favs[:4]}


def slugify(title):
    t = re.sub(r"['\u2019.]", "", str(title).lower())
    return re.sub(r"[^a-z0-9]+", "-", t).strip("-")


def get(url, timeout=12):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def text(el, path):
    x = el.find(path, NS)
    return (x.text or "").strip() if x is not None and x.text else ""


def review_of(desc):
    """The member's own words from the item description, or '' when there are none."""
    if "This review may contain spoilers" in desc:
        return ""
    paras = re.findall(r"<p>(.*?)</p>", desc, flags=re.S)
    words = []
    for p in paras:
        if "<img" in p:
            continue
        t = html.unescape(re.sub(r"<[^>]+>", "", p)).strip()
        if not t or re.match(r"^(Watched|Rewatched) on ", t):
            continue
        words.append(t)
    return " ".join(words)


def parse(xml_bytes):
    root = ET.fromstring(xml_bytes)
    out = []
    for it in root.iter("item"):
        title = text(it, "lb:filmTitle")
        if not title:  # lists and other non-diary items
            continue
        link = text(it, "link")
        m = re.search(r"/film/([^/]+)/", link)
        desc = text(it, "description")
        img = re.search(r'<img src="([^"]+)"', desc)
        rating = text(it, "lb:memberRating")
        out.append({
            "id": text(it, "guid"),
            "title": title,
            "year": text(it, "lb:filmYear"),
            "rating": float(rating) if rating else None,
            "liked": text(it, "lb:memberLike") == "Yes",
            "rewatch": text(it, "lb:rewatch") == "Yes",
            "watched": text(it, "lb:watchedDate"),
            "link": link,
            "slug": m.group(1) if m else "",
            "poster_src": img.group(1) if img else "",
            "review": review_of(desc),
        })
    out.sort(key=lambda e: e["watched"], reverse=True)
    return out


def small(poster_url, w=150, h=225):
    # the feed hands out 600x900; diary rows draw them at 46px wide, favourites at ~160
    return re.sub(r"-0-\d+-0-\d+-crop", f"-0-{w}-0-{h}-crop", poster_url)


def wiki_poster(title, year):
    """A film's poster from its Wikipedia summary, or '' when no page for the film is found."""
    tries = ([f"{title} ({year} film)"] if year else []) + [f"{title} (film)", title]
    for t in tries:
        url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(t.replace(" ", "_"))
        try:
            d = json.loads(get(url))
        except Exception:
            continue
        if "film" not in (d.get("description") or "").lower():
            continue
        img = (d.get("thumbnail") or {}).get("source") or (d.get("originalimage") or {}).get("source")
        if img:
            return img
    return ""


def sync(verbose=True):
    """Refresh diary.json + posters from the feed. Never raises: on failure the last copy stands."""
    c = config()
    say = print if verbose else (lambda *a, **k: None)
    if not c["user"]:
        say("  letterboxd: no user in letterboxd/config.json, skipped")
        return False
    try:
        entries = parse(get(f"https://letterboxd.com/{c['user']}/rss/"))
    except Exception as e:  # network, 404, bad xml
        say(f"  letterboxd: feed fetch failed ({e.__class__.__name__}: {e}); keeping last copy")
        return False
    POSTERS.mkdir(parents=True, exist_ok=True)
    keep = set()
    for n, e in enumerate(entries):
        e["poster"] = ""
        if n >= c["show"] or not (e["poster_src"] and e["slug"]):
            continue
        name = re.sub(r"[^a-z0-9-]", "", e["slug"].lower()) + ".jpg"
        f = POSTERS / name
        if not f.exists():
            try:
                f.write_bytes(get(small(e["poster_src"])))
            except Exception:
                continue
        e["poster"] = name
        keep.add(name)
    favs = []
    for fav in c["favourites"]:
        fav = dict(fav, poster="")
        stem = "fav-" + re.sub(r"[^a-z0-9-]", "", fav["slug"])
        f = next(iter(sorted(POSTERS.glob(stem + ".*"))), None)
        if f is None:
            src = next((small(e["poster_src"], 300, 450) for e in entries
                        if e["poster_src"] and (e["slug"] == fav["slug"] or
                        (e["title"].lower() == fav["title"].lower() and
                         (not fav["year"] or e["year"] == fav["year"])))), "")
            src = src or wiki_poster(fav["title"], fav["year"])
            ext = ".png" if urllib.parse.urlsplit(src).path.lower().endswith(".png") else ".jpg"
            try:
                if src:
                    (POSTERS / (stem + ext)).write_bytes(get(src))
                    f = POSTERS / (stem + ext)
            except Exception:
                f = None
        if f is not None and f.exists():
            fav["poster"] = f.name
            keep.add(f.name)
        favs.append(fav)
    for f in POSTERS.glob("*.*"):
        if f.name not in keep:
            f.unlink()
    DIARY.write_text(json.dumps({"user": c["user"], "favourites": favs, "entries": entries},
                                indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    say(f"  letterboxd: {len(entries)} diary entries from /{c['user']}, {len(favs)} favourites, "
        f"{len(keep)} posters")
    return True


# ---------------------------------------------------------------- render

def stars(r):
    if r is None:
        return ""
    return "★" * int(r) + ("½" if r % 1 else "")


def when(d):
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", d or "")
    if not m:
        return ""
    mon = "jan feb mar apr may jun jul aug sep oct nov dec".split()[int(m.group(2)) - 1]
    return f"{int(m.group(3))} {mon} {m.group(1)}"


def render():
    """The diary block for taste.html's film section, or '' when there is nothing to show."""
    c = config()
    try:
        data = json.loads(DIARY.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return ""
    if not c["user"] or data.get("user") != c["user"]:
        return ""
    shown = data.get("entries", [])[: c["show"]]
    favs = data.get("favourites", [])
    if not shown and not favs:
        return ""
    esc = html.escape
    user = esc(c["user"])

    fav_html = ""
    if favs:
        cells = []
        for i, f in enumerate(favs):
            img = (f'<img src="/letterboxd/posters/{esc(f["poster"])}" alt="" width="150" height="225" '
                   f'loading="lazy" decoding="async">' if f.get("poster") else "")
            cells.append(
                f'<li class="reveal" style="--i:{i}"><a class="lb-fav-link" '
                f'href="https://letterboxd.com/film/{esc(f["slug"])}/" rel="noopener">'
                f'<span class="lb-fav-poster" aria-hidden="true">{img}</span>'
                f'<span class="t">{esc(f["title"])}</span>'
                f'<span class="lb-year">{esc(f.get("year", ""))}</span></a></li>'
            )
        fav_html = f"""
      <div class="lb-favs">
        <div class="lb-head reveal">
          <span class="lb-label">favourites</span>
          <span class="lb-src">the four pinned on
            <a href="https://letterboxd.com/{user}/" rel="noopener">letterboxd/{user}</a></span>
        </div>
        <ol class="lb-fav-row">{"".join(cells)}</ol>
      </div>"""
    if not shown:
        return f'\n    <div class="lb" id="lb">{fav_html}\n    </div>\n    '

    # ratings across what is shown, half-star bins ½ .. 5
    bins = [0] * 10
    for e in shown:
        if e.get("rating"):
            bins[int(round(e["rating"] * 2)) - 1] += 1
    peak = max(bins) or 1
    rated = sum(bins)
    bars = []
    for i, n in enumerate(bins):
        r = (i + 1) / 2
        label = f"{stars(r)}: {n} film{'' if n == 1 else 's'}"
        bars.append(
            f'<button type="button" class="lb-bar" data-r="{r:g}" aria-pressed="false" '
            f'aria-label="{esc(label)}" title="{esc(label)}"{" disabled" if not n else ""}>'
            f'<i style="--h:{n / peak:.3f}"></i><span>{n or ""}</span></button>'
        )

    rows = []
    for e in shown:
        r = e.get("rating")
        marks = []
        if e.get("liked"):
            marks.append('<span class="lb-like" title="liked">♥︎</span>')
        if e.get("rewatch"):
            marks.append('<span class="lb-re" title="rewatch">re</span>')
        poster = (f'<img src="/letterboxd/posters/{esc(e["poster"])}" alt="" width="46" height="69" '
                  f'loading="lazy" decoding="async">' if e.get("poster") else "")
        dek = e.get("review", "")
        if len(dek) > 180:
            dek = dek[:180].rsplit(" ", 1)[0] + "…"
        rows.append(
            f'<li class="reveal lb-row" data-r="{format(r, "g") if r else ""}">'
            f'<a class="lb-link" href="{esc(e["link"])}" rel="noopener">'
            f'<span class="lb-poster" aria-hidden="true">{poster}</span>'
            f'<span class="lb-body"><span class="t">{esc(e["title"])}'
            f' <span class="lb-year">{esc(e.get("year", ""))}</span></span>'
            f'<span class="lb-meta"><span class="lb-stars">{stars(r)}</span>{"".join(marks)}</span>'
            + (f'<span class="dek">{esc(dek)}</span>' if dek else "")
            + f'</span><span class="when">{when(e.get("watched"))}</span></a></li>'
        )

    return f"""
    <div class="lb" id="lb">{fav_html}
      <div class="lb-head reveal">
        <span class="lb-label">diary</span>
        <span class="lb-src">the last {len(shown)} logged on
          <a href="https://letterboxd.com/{user}/" rel="noopener">letterboxd/{user}</a></span>
      </div>
      <div class="lb-dist reveal" role="group" aria-label="ratings across these {len(shown)}, press a bar to hold it">
        <div class="lb-bars">{"".join(bars)}</div>
        <div class="lb-axis" aria-hidden="true"><span>½</span><span>★★★★★</span></div>
        <p class="lb-read" id="lbRead" aria-live="polite">{rated} rated · point at a bar to find them</p>
      </div>
      <ul class="entries lb-list" id="lbList">{"".join(rows)}
      </ul>
    </div>
    """


def inject(fragment):
    """Replace whatever sits between the letterboxd markers with the current render."""
    i = fragment.find(BEGIN)
    j = fragment.find(END)
    if i < 0 or j < i:
        return fragment
    i = fragment.index("-->", i) + 3
    return fragment[:i] + render() + fragment[j:]


if __name__ == "__main__":
    sys.exit(0 if sync() else 1)
