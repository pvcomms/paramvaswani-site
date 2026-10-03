#!/usr/bin/env python3
"""
Anki -> the study box on /curriculum.

    ./anki.py                  refresh anki/cards.json from the running Anki (AnkiConnect, 127.0.0.1:8765)
    ./build.py                 calls the same refresh, then renders the cards into curriculum.html

Readers never talk to Anki. The collection is read here, at build time, on the machine Anki runs
on, and shipped as JSON inside the page. If Anki is not running the refresh is skipped and the
committed anki/cards.json stands, so a build anywhere still ships the last good copy.

Every deck goes out except those in EXCLUDE (People holds photos of real people; LessWrong is
the bulk import of the LessWrong wiki, ~3,000 cards, kept off the site). Suspended
cards stay home. Field HTML is cut down to a handful of inline tags; anything else is dropped
to its text. Each card carries Param's own record on it (reps, lapses, interval) so a reader can
see where he is with it.
"""
import html, json, pathlib, re, sys, urllib.request
from datetime import date
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "anki" / "cards.json"
URL = "http://127.0.0.1:8765"
EXCLUDE = ("People", "Default", "LessWrong")
BEGIN, END = "<!-- anki:begin", "<!-- anki:end -->"


def ac(action, **params):
    req = urllib.request.Request(URL, json.dumps({"action": action, "version": 6, "params": params}).encode())
    with urllib.request.urlopen(req, timeout=3) as r:
        out = json.load(r)
    if out.get("error"):
        raise RuntimeError(out["error"])
    return out["result"]


# ---- field html: keep a few inline tags, no attributes, everything else becomes text ----

KEEP = {"b", "i", "em", "strong", "u", "code", "kbd", "sub", "sup"}


class Clean(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out, self.open = [], []

    def handle_starttag(self, tag, attrs):
        if tag in ("br", "div", "p", "li") and self.out:
            self.out.append("<br>")
        elif tag in KEEP:
            self.out.append(f"<{tag}>")
            self.open.append(tag)

    def handle_startendtag(self, tag, attrs):
        if tag == "br":
            self.out.append("<br>")

    def handle_endtag(self, tag):
        if tag in KEEP and tag in self.open:
            self.open.remove(tag)
            self.out.append(f"</{tag}>")

    def handle_data(self, data):
        self.out.append(html.escape(data, quote=False))


def clean(s):
    s = re.sub(r"\[sound:[^\]]*\]", "", s or "")
    p = Clean()
    p.feed(s)
    p.close()
    out = "".join(p.out) + "".join(f"</{t}>" for t in reversed(p.open))
    out = re.sub(r"(<br>\s*)+$", "", re.sub(r"^(\s*<br>)+", "", out))
    return re.sub(r"(<br>\s*){3,}", "<br><br>", out).strip()


# ---- clozes: {{cN::answer::hint}} ----

CLOZE = re.compile(r"\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}", re.S)


def cloze(text, n, reveal):
    def sub(m):
        if int(m.group(1)) != n:
            return m.group(2)
        if reveal:
            return f"<mark>{m.group(2)}</mark>"
        return f"<mark>[{m.group(3) or '…'}]</mark>"
    return CLOZE.sub(sub, text)


def render(card, f):
    """One card -> (kind, front, back, extra, source). Fields are raw; cleaned at the end."""
    model, ord_ = card["modelName"], card["ord"]
    if model in ("Cloze+", "Distinguisher"):
        text = f.get("Text") or f.get("Pair") or ""
        n = ord_ + 1
        # cloze markup survives clean() untouched, so clean first and wrap after
        t = clean(text)
        return ("cloze", cloze(t, n, False), cloze(t, n, True),
                clean(f.get("Extra") or f.get("Why")), clean(f.get("Source")))
    if model == "German":
        extra = "<br>".join(x for x in (clean(f.get("Beispiel")), clean(f.get("Notiz"))) if x)
        de, en, hint = clean(f.get("Deutsch")), clean(f.get("English")), clean(f.get("Hinweis"))
        if ord_ == 0:
            return ("de → en", de, en, extra, "")
        front = en + (f" <small>{hint}</small>" if hint else "")
        return ("en → de", front, de, extra, "")
    if model == "Shortcut":
        app = clean(f.get("App"))
        front = clean(f.get("Action")) + (f" <small>in {app}</small>" if app else "")
        return ("shortcut", front, f"<kbd>{clean(f.get('Keys'))}</kbd>", clean(f.get("Extra")), "")
    if model == "Basic+":
        a, b = clean(f.get("Front")), clean(f.get("Back"))
        if ord_ == 1:
            a, b = b, a
        return ("", a, b, clean(f.get("Extra")), clean(f.get("Source")))
    return None


def sync(verbose=True):
    """Refresh anki/cards.json from AnkiConnect. Never raises: on failure the last copy stands."""
    say = print if verbose else (lambda *a, **k: None)
    try:
        q = " ".join(f'-"deck:{d}" -"deck:{d}::*"' for d in EXCLUDE) + " -is:suspended"
        ids = ac("findCards", query=q)
        cards = ac("cardsInfo", cards=ids)
    except Exception as e:  # anki closed, add-on missing
        say(f"  anki: not reachable ({e.__class__.__name__}); keeping last copy")
        return False
    out = []
    for c in sorted(cards, key=lambda c: (c["deckName"], c["note"], c["ord"])):
        f = {k: v["value"] for k, v in c["fields"].items()}
        r = render(c, f)
        if not r or not r[1] or not r[2]:
            continue
        kind, front, back, extra, source = r
        ivl = c["interval"]
        out.append({"id": str(c["cardId"]), "deck": c["deckName"], "kind": kind,
                    "front": front, "back": back, "extra": extra, "source": source,
                    # param's record: times reviewed, times forgotten, days until he sees it again
                    "me": [c["reps"], c["lapses"], ivl if ivl > 0 else 0]})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"synced": date.today().isoformat(), "cards": out},
                              ensure_ascii=False, indent=0) + "\n", encoding="utf-8")
    say(f"  anki: {len(out)} cards from {len({c['deck'] for c in out})} decks -> anki/cards.json")
    return True


def data():
    try:
        return OUT.read_text(encoding="utf-8")
    except OSError:
        return '{"synced": "", "cards": []}'


def inject(fragment):
    """Put the committed cards between the anki markers as an inert JSON script."""
    i = fragment.find(BEGIN)
    j = fragment.find(END)
    if i < 0 or j < i:
        return fragment
    i = fragment.index("-->", i) + 3
    raw = data()
    body = raw.replace("</", "<\\/")  # nothing in the json can close the script tag
    out = fragment[:i] + f'\n<script type="application/json" id="anki-data">{body}</script>\n' + fragment[j:]
    return out.replace('<span id="ak-date"></span>', f'<span id="ak-date">{when(json.loads(raw).get("synced"))}</span>', 1)


def when(iso):
    """2026-10-02 -> 2 oct 2026, the way the page writes dates."""
    try:
        d = date.fromisoformat(iso)
    except (TypeError, ValueError):
        return ""
    return f"{d.day} {d.strftime('%b').lower()} {d.year}"


if __name__ == "__main__":
    sys.exit(0 if sync() else 1)
