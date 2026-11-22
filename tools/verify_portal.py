#!/usr/bin/env python3
"""Static hygiene & cross-link verifier for PlAIground Lab Portal."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main():
    errors = []
    html = (ROOT / "index.html").read_text(encoding="utf-8")

    # 1. No insecure http:// links on brand domains
    insecure = re.findall(r"http://[A-Za-z0-9.\-]*plaigroundlab\.com[^\s\"']*", html)
    if insecure:
        errors.append(f"Insecure http:// brand links found: {insecure}")

    # 2. All live products linked over HTTPS
    required_urls = [
        "https://computequote.plaigroundlab.com/",
        "https://ideal-type.plaigroundlab.com",
        "https://ideal-type.plaigroundlab.com/pet-card/",
        "https://axiom.plaigroundlab.com/",
        "https://blog.plaigroundlab.com/",
    ]
    for url in required_urls:
        if url not in html:
            errors.append(f"Missing required live product URL: {url}")

    # 3. Every data-zh element must also have data-en
    zh_tags = re.findall(r"<[^>]+data-zh=[^>]+>", html)
    for tag in zh_tags:
        if "data-en=" not in tag:
            errors.append(f"Missing data-en pair on bilingual element: {tag[:80]}")

    # 4. Brand isolation: zero personal github/email/secret patterns in public repo
    for p in ROOT.rglob("*"):
        if not p.is_file() or ".git" in p.parts:
            continue
        txt = p.read_text(encoding="utf-8", errors="replace")
        for pat in (r"ghp_[A-Za-z0-9]{20,}", r"sk_live_[A-Za-z0-9]{16,}", r"whsec_[A-Za-z0-9]{16,}"):
            if re.search(pat, txt):
                errors.append(f"Secret-like token detected in {p.relative_to(ROOT)}")

    if errors:
        for e in errors:
            print(f"[FAIL] {e}", file=sys.stderr)
        sys.exit(1)
    print(f"PORTAL VERIFY PASS: {len(required_urls)} HTTPS live products, {len(zh_tags)} bilingual elements verified.")


if __name__ == "__main__":
    main()
