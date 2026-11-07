#!/usr/bin/env python3
"""Copy components/navbar.html into every page's #navbar-placeholder.

Run from the repo root after editing components/navbar.html:
    python3 _internal/scripts/inline-navbar.py
Inlining makes the navbar part of the first HTML response instead of a second
request after page load. Pages without the markers still fall back to the
fetch in components.js.
"""
import os, re, sys
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
nav = open(os.path.join(root, "components", "navbar.html"), encoding="utf8", newline="").read().strip()
block = '<div id="navbar-placeholder"><!-- navbar:start -->' + nav + '<!-- navbar:end --></div>'
pat = re.compile(r'<div id="navbar-placeholder">(?:<!-- navbar:start -->.*?<!-- navbar:end -->)?</div>', re.S)
n = 0
for d, dirs, files in os.walk(root):
    dirs[:] = [x for x in dirs if not x.startswith((".", "_")) and x not in ("components", "node_modules")]
    for f in files:
        if not f.endswith(".html"): continue
        p = os.path.join(d, f)
        t = open(p, encoding="utf8", newline="").read()
        new = pat.sub(lambda m: block, t)
        if new != t:
            open(p, "w", encoding="utf8", newline="").write(new); n += 1
print("updated", n, "pages")
