#!/usr/bin/env python3
"""
Build the deployable site into ./public from the artifact-format sources.

index.html here is an artifact fragment (<title> line 1, no doctype/html/head/body).
This wraps it in a real HTML document with meta, OG, JSON-LD, and copies fonts.
Source of truth stays index.html; ./public is generated — never edit it directly.
"""
import re, shutil, pathlib, html

ROOT = pathlib.Path(__file__).parent
PUB = ROOT / "public"
DOMAIN = "https://paramv.com"

NAME = "Param Vaswani"
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
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0b0c0e">
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
"url":"https://paramv.com","email":"mailto:hello@paramv.com",
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

- [Home](https://paramv.com/): six interactive figures — a Venn of the domains and their
  intersections, the distribution of taste with the Galton machine that proves it, an influence
  graph, a values-precedence tree, a truth-seeking game, and an arbitration plot that asks where
  the line between your judgment and a machine's should fall. Plus essays, a register of
  forty-six builds, principles, a credence ledger, and a running log.
- [Reading the Figures](https://paramv.com/legend): what each figure claims, what every
  animation means, how they cohere, and an honest audit of which claims are actually grounded.
- [What You Study](https://paramv.com/position): thesis, the fields it maps to, and a manifesto.

## Fields

Philosophy of technology and postphenomenology (Ihde, Verbeek) · 4E cognition and the extended
mind (Clark & Chalmers) · explorable explanations (Victor, Case, Distill) · media ecology ·
political economy of attention · sociotechnical AI safety.

## Contact

hello@paramv.com
"""

def sitemap(paths):
    urls = "".join(f"  <url><loc>{DOMAIN}{p}</loc></url>\n" for p in paths)
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n'

def main():
    if PUB.exists():
        shutil.rmtree(PUB)
    PUB.mkdir()

    pages = [
        ("index.html", "index.html", NAME, DESC, "/", PERSON_LD),
        ("figure-legend.html", "legend.html", "Reading the Figures — " + NAME,
         "What each figure on the site claims, what every animation means, and an honest audit "
         "of which claims are grounded.", "/legend", ""),
        ("POSITION.html", "position.html", "What You Study — " + NAME,
         "The thesis, the fields it maps to, three lengths of answer, a manifesto, and a plan.",
         "/position", ""),
    ]
    for src, dst, title, desc, path, ld in pages:
        frag = (ROOT / src).read_text(encoding="utf-8")
        (PUB / dst).write_text(wrap(frag, title=title, desc=desc, path=path, jsonld=ld),
                               encoding="utf-8")
        print(f"  {src:<20} -> public/{dst}")

    shutil.copytree(ROOT / "fonts", PUB / "fonts")
    (PUB / "favicon.svg").write_text(FAVICON, encoding="utf-8")
    (PUB / "robots.txt").write_text(ROBOTS, encoding="utf-8")
    (PUB / "llms.txt").write_text(LLMS, encoding="utf-8")
    (PUB / "sitemap.xml").write_text(sitemap(["/", "/legend", "/position"]), encoding="utf-8")
    print(f"  fonts/ favicon.svg robots.txt llms.txt sitemap.xml -> public/")

if __name__ == "__main__":
    main()
