#!/usr/bin/env python3
"""
Dev server for artifact-format pages.

The .html files here are artifact fragments: <title> on line 1, no doctype/html/head/body
(the artifact wrapper adds those at publish time). This server adds the same wrapper on
every request, so you edit the file, hit refresh, and see the change. No build step.

    ./dev.py            -> http://localhost:4173
    ./dev.py 8080       -> different port
"""
import http.server, socketserver, sys, os, pathlib

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
ROOT = pathlib.Path(__file__).parent.resolve()

SHELL_HEAD = (
    "<!doctype html>\n<html><head><meta charset='utf-8'>"
    "<meta name='viewport' content='width=device-width, initial-scale=1'>"
    "<style>body{margin:0}</style></head><body>\n"
)
SHELL_FOOT = "\n</body></html>"

PAGES = {
    "/": "index.html",
    "/index.html": "index.html",
    "/legend": "figure-legend.html",
    "/figure-legend.html": "figure-legend.html",
    "/position": "POSITION.html",
    "/POSITION.html": "POSITION.html",
}

INDEX_PAGE = """<!doctype html><html><head><meta charset='utf-8'>
<style>body{background:#0b0c0e;color:#e9e6de;font:16px/1.7 Georgia,serif;padding:60px 40px}
a{color:#e3c567;display:block;padding:10px 0;font-family:ui-monospace,Menlo,monospace;font-size:14px}
h1{font-weight:400;font-size:22px;margin:0 0 20px}</style></head><body>
<h1>paramvaswani-site &mdash; dev</h1>
<a href="/">/ &mdash; the site (index.html)</a>
<a href="/legend">/legend &mdash; Reading the Figures</a>
<a href="/position">/position &mdash; What You Study</a>
</body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?")[0].split("#")[0]

        if path == "/_pages":
            return self._send(INDEX_PAGE.encode("utf-8"), "text/html")

        if path in PAGES:
            f = ROOT / PAGES[path]
            if not f.exists():
                return self.send_error(404, PAGES[path] + " not found")
            body = SHELL_HEAD + f.read_text(encoding="utf-8") + SHELL_FOOT
            return self._send(body.encode("utf-8"), "text/html")

        return super().do_GET()

    def _send(self, data, ctype):
        self.send_response(200)
        self.send_header("Content-Type", ctype + "; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        pass


os.chdir(ROOT)
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    print("  site     http://localhost:%d/" % PORT)
    print("  legend   http://localhost:%d/legend" % PORT)
    print("  position http://localhost:%d/position" % PORT)
    print("  all      http://localhost:%d/_pages" % PORT)
    print("\n  edit the .html files directly - just refresh. ctrl-c to stop.\n")
    httpd.serve_forever()
