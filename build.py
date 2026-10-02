#!/usr/bin/env python3
"""
Build the deployable site into ./public from the artifact-format sources.

index.html here is an artifact fragment (<title> line 1, no doctype/html/head/body).
This wraps it in a real HTML document with meta, OG, JSON-LD, and copies fonts.
Source of truth stays index.html; ./public is generated — never edit it directly.
"""
import re, shutil, pathlib, html
import letterboxd

ROOT = pathlib.Path(__file__).parent
PUB = ROOT / "public"
DOMAIN = "https://paramv.com"

NAME = "Param Vaswani"
TAB = "Param V"  # the short name in page titles; NAME stays the full name in metadata
DESC = ("Param Vaswani studies what machine mediation does to human judgment, and builds "
        "interactive instruments that let people feel those mechanisms — essays, small "
        "systems, and n=1 experiments.")

def wrap(fragment: str, *, title: str, desc: str, path: str, jsonld: str = "") -> str:
    body = re.sub(r'^<title>.*?</title>\s*', '', fragment, count=1, flags=re.S)
    url = DOMAIN + path
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{url}">
<meta name="color-scheme" content="dark light">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0c0e">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f2efe7">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{html.escape(NAME)}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{html.escape(title)}">
<meta name="twitter:description" content="{html.escape(desc)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
{jsonld}<style>body{{margin:0}}</style>
</head>
<body>
{body}
</body>
</html>
"""

PERSON_LD = """<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Person","name":"Param Vaswani",
"url":"https://paramv.com",
"jobTitle":"Writer and builder",
"description":"Studies what machine mediation does to human judgment; builds interactive instruments that let people feel those mechanisms.",
"knowsAbout":["Philosophy of technology","Postphenomenology","4E cognition","Explorable explanations","Attention economy","AI safety"],
"sameAs":["https://www.linkedin.com/in/paramvaswani","https://bsky.app/profile/paramvaswani.bsky.social"]}
</script>
"""

FAVICON = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<rect width="100" height="100" fill="#0b0c0e"/>
<circle cx="38" cy="42" r="26" fill="none" stroke="#b48ede" stroke-width="3"/>
<circle cx="62" cy="42" r="26" fill="none" stroke="#6fa8dc" stroke-width="3"/>
<circle cx="50" cy="63" r="22" fill="none" stroke="#7fb069" stroke-width="3"/>
<circle cx="50" cy="48" r="5" fill="#e07a6b"/>
</svg>
"""

ROBOTS = """User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://paramv.com/sitemap.xml
"""

LLMS = """# Param Vaswani

> Writer and builder. Studies what machine mediation does to human judgment, and builds
> interactive instruments that let people feel those mechanisms rather than be told about them.

## What's here

- [Home](https://paramv.com/): the site drawn as a Venn — five domains inside the universal set,
  contact as the dashed set off the record.
- [Taste](https://paramv.com/taste): what shaped him, by form — films, shows, albums, poetry, books, essays.
- [Learning Curriculum](https://paramv.com/curriculum): the current personal learning curriculum.
- [Dev](https://paramv.com/dev): then, now, and the terms he consults on.
- [Principles](https://paramv.com/principles): the rules he actually runs on, in the order they win.
- [Research](https://paramv.com/research): what he thinks with — research concepts, quotes, aphorisms.
- [Words](https://paramv.com/words): neology & etymology — words he coined, or coined in usage, and
  words he borrowed.
- [Downloads](https://paramv.com/downloads): tools he builds and uses to be more intentional, curate
  his internet, and remove noise: kan, niwa, kiku, cognitive scaffolding, and more.
- [Oblique, DIY](https://paramv.com/oblique): write your own oblique strategies from your creative
  values and draw one when stuck; kept in the browser.
- [Cognitive Scaffolding](https://paramv.com/systems/cognitive-scaffolding): tools for
  structured overthinking. A fenced run that ends in an intervention, a cited toolbox of
  seventeen reasoning tools and six lenses, and a ledger kept in the reader's own browser.

## Fields

Philosophy of technology and postphenomenology (Ihde, Verbeek) · 4E cognition and the extended
mind (Clark & Chalmers) · explorable explanations (Victor, Case, Distill) · media ecology ·
political economy of attention · sociotechnical AI safety.

## Contact

Footer of https://paramv.com. The address sits behind a small proof-of-work to keep scrapers out.
"""

def sitemap(paths):
    urls = "".join(f"  <url><loc>{DOMAIN}{p}</loc></url>\n" for p in paths)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n'

def main():
    if PUB.exists():
        shutil.rmtree(PUB)
    PUB.mkdir()

    pages = [
        ("index.html", "index.html", TAB, DESC, "/", PERSON_LD),
        ("taste.html", "taste.html", "Taste — " + TAB,
         "What shaped Param, by form: films, shows, albums, poetry, books, essays.", "/taste", ""),
        ("curriculum.html", "curriculum.html", "Learning Curriculum — " + TAB,
         "The current personal learning curriculum: what is being learned, in what order, "
         "and in service of what.", "/curriculum", ""),
        ("work.html", "dev.html", "Dev — " + TAB,
         "I research, I develop, I write. Local-only AI specialist. Privacy-first AI "
         "consulting: selective, six months minimum.", "/dev", ""),
        ("principles.html", "principles.html", "Principles — " + TAB,
         "The rules Param actually runs on, in the order they win.", "/principles", ""),
        ("research.html", "research.html", "Research — " + TAB,
         "What Param thinks with: research concepts, quotes, aphorisms.", "/research", ""),
        ("words.html", "words.html", "Words — " + TAB,
         "Neology & etymology: words Param coined, or coined in usage, and words he borrowed.",
         "/words", ""),
        ("downloads.html", "downloads.html", "Downloads — " + TAB,
         "Tools Param builds and uses to be more intentional, curate his internet, and remove noise.",
         "/downloads", ""),
        ("oblique.html", "oblique.html", "Oblique, DIY — " + TAB,
         "Your own oblique strategies, from your creative values: one line per card, drawn at random, kept in your browser.",
         "/oblique", ""),
        # generated by ~/personal/tools/apps/cognitive-scaffolding: ./build.py --site ~/personal/site
        ("cognitive-scaffolding.html", "systems/cognitive-scaffolding.html", "Cognitive Scaffolding — " + TAB,
         "Tools for structured overthinking, so the thinking ends in something done.",
         "/systems/cognitive-scaffolding", ""),
    ]
    letterboxd.sync()
    for src, dst, title, desc, path, ld in pages:
        frag = (ROOT / src).read_text(encoding="utf-8")
        if src == "taste.html":
            frag = letterboxd.inject(frag)
        (PUB / dst).parent.mkdir(parents=True, exist_ok=True)
        (PUB / dst).write_text(wrap(frag, title=title, desc=desc, path=path, jsonld=ld),
                               encoding="utf-8")
        print(f"  {src:<20} -> public/{dst}")

    shutil.copytree(ROOT / "fonts", PUB / "fonts")
    shutil.copytree(ROOT / "vendor", PUB / "vendor")
    shutil.copytree(ROOT / "albums", PUB / "albums")
    shutil.copytree(ROOT / "films", PUB / "films")
    shutil.copytree(ROOT / "telly", PUB / "telly")
    shutil.copytree(ROOT / "books", PUB / "books")
    shutil.copytree(ROOT / "pictures", PUB / "pictures")
    shutil.copytree(ROOT / "audio", PUB / "audio")
    if (ROOT / "letterboxd" / "posters").is_dir():
        shutil.copytree(ROOT / "letterboxd" / "posters", PUB / "letterboxd" / "posters")
    (PUB / "favicon.svg").write_text(FAVICON, encoding="utf-8")
    (PUB / "robots.txt").write_text(ROBOTS, encoding="utf-8")
    (PUB / "llms.txt").write_text(LLMS, encoding="utf-8")
    (PUB / "sitemap.xml").write_text(sitemap(["/", "/taste", "/curriculum",
                                    "/dev", "/principles", "/research", "/words", "/downloads", "/oblique",
                                    "/systems/cognitive-scaffolding"]), encoding="utf-8")
    print(f"  fonts/ vendor/ albums/ films/ telly/ books/ pictures/ audio/ letterboxd/posters/ favicon.svg robots.txt llms.txt sitemap.xml -> public/")

if __name__ == "__main__":
    main()
