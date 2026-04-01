"""
Blog Cleanup Script
Scans blog folder and removes orphaned cards from index.html and homepage.

Usage:
    python cleanup.py
"""

import json
import re
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
BLOG_DIR = REPO_ROOT / "blog"
STATE_FILE = SCRIPT_DIR / "state.json"
HOMEPAGE_PATH = REPO_ROOT / "index.html"
BLOG_INDEX_PATH = BLOG_DIR / "index.html"


def load_state():
    """Load the current state."""
    if STATE_FILE.exists():
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"last_topic_index": -1, "published_posts": [], "recent_posts": []}


def save_state(state):
    """Save the current state."""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def get_existing_posts():
    """Get list of existing .html files in blog/ (excluding index.html)."""
    existing = set()
    if BLOG_DIR.exists():
        for f in BLOG_DIR.glob("*.html"):
            if f.name != "index.html":
                existing.add(f.stem)
    return existing


def remove_card_from_index(slug):
    """Remove a card from blog/index.html for a given slug."""
    if not BLOG_INDEX_PATH.exists():
        return False

    with open(BLOG_INDEX_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the card block containing this slug - look for the entire col div
    # Pattern: from "<div class="col-lg-4 col-md-6">" to the closing </div>
    
    # Find all card sections
    pattern = r'<div class="col-lg-4 col-md-6">\s*<div class="blog-card-modern"[^>]*>.*?</div>\s*</div>'
    matches = list(re.finditer(pattern, content, re.DOTALL))
    
    removed = False
    for match in reversed(matches):
        card_html = match.group(0)
        if f'href="{slug}.html"' in card_html:
            start = match.start()
            end = match.end()
            # Include any comment before the card and whitespace after
            # Look for comment before
            comment_match = re.search(r'<!--[^>]*?-->\s*$', content[:start])
            if comment_match:
                start = comment_match.start()
            # Remove trailing whitespace
            while end < len(content) and content[end] in '\n\r\t ':
                end += 1
            content = content[:start] + content[end:]
            removed = True
            break

    if removed:
        # Clean up extra whitespace
        content = re.sub(r'\n{4,}', '\n\n', content)
        
        with open(BLOG_INDEX_PATH, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    
    return False


def update_homepage_featured(recent_posts):
    """Update homepage to show a valid recent post or restore default."""
    if not HOMEPAGE_PATH.exists():
        return False

    with open(HOMEPAGE_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if featured card references a deleted post
    featured_match = re.search(r'<!-- Featured Blog.*?href="blog/([^"]+)"', content, re.DOTALL)
    
    if featured_match:
        featured_slug = featured_match.group(1).replace('.html', '')
        existing = get_existing_posts()
        
        if featured_slug not in existing:
            # Featured post doesn't exist - need to update
            # Find the featured section and restore default or use most recent valid post
            start_marker = '<!-- Featured Blog'
            start_idx = content.find(start_marker)
            
            if start_idx == -1:
                start_marker = '<div class="col-lg-8" data-aos="fade-up">'
                start_idx = content.find(start_marker)
            
            end_marker = '<!-- Secondary Blogs -->'
            end_idx = content.find(end_marker)
            
            if start_idx != -1 and end_idx != -1:
                # Default featured card
                default_featured = '''        <!-- Featured Blog -->
        <div class="col-lg-8" data-aos="fade-up">
          <a href="blog/blink-led.html" style="text-decoration: none; color: inherit;">
            <div class="blog-card-featured w-100 rounded-5 overflow-hidden shadow-lg position-relative d-flex flex-column"
              style="background: linear-gradient(135deg, rgba(13, 110, 253, 0.08) 0%, rgba(111, 66, 193, 0.05) 100%); transition: all 0.4s ease;">
              <div class="position-absolute top-0 start-0 p-4" style="z-index: 2;">
                <span class="badge rounded-pill shadow-sm"
                  style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 10px 24px; font-weight: 700; font-size: 0.75rem; letter-spacing: 1px;">
                  <i class="bi bi-star-fill me-1"></i> FEATURED
                </span>
              </div>
              <div class="blog-bg-image position-absolute top-0 start-0 w-100"
                style="height: 65%; background: url('blog/blogphotos/blink-led.webp') center/cover no-repeat; z-index: 0;">
                <div class="position-absolute bottom-0 start-0 w-100 h-100"
                  style="background: linear-gradient(0deg, #ffffff 15%, rgba(255,255,255,0.85) 35%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%);">
                </div>
              </div>
              <div class="blog-content position-relative p-4 p-md-5 mt-auto" style="z-index: 1;">
                <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                  <span class="badge rounded-pill px-3 py-2 fw-semibold" style="background: linear-gradient(135deg, #0d6efd, #0dcaf0); color: white;">
                    <i class="bi bi-lightbulb me-1"></i> Beginner
                  </span>
                  <span class="text-secondary small fw-medium ms-auto">
                    <i class="bi bi-clock me-1"></i> 5 min read
                  </span>
                </div>
                <h3 class="fw-bold mb-3 text-dark" style="font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.2;">Blink an LED with Arduino</h3>
                <p class="text-muted mb-4 d-none d-md-block">Learn the "Hello World" of hardware - blinking an LED with Arduino. Start your robotics journey here!</p>
                <span class="btn-premium btn-primary-mw w-100 w-md-auto d-inline-block" style="cursor: pointer;">
                  Read Full Article <i class="bi bi-arrow-right ms-2"></i>
                </span>
              </div>
            </div>
          </a>
          <style>
            .blog-card-featured {
              min-height: 500px;
            }
            @media (max-width: 768px) {
              .blog-card-featured {
                min-height: 400px;
              }
            }
          </style>
        </div>'''

                new_content = content[:start_idx] + default_featured + '\n\n        ' + content[end_idx:]
                
                with open(HOMEPAGE_PATH, "w", encoding="utf-8") as f:
                    f.write(new_content)
                return True
    
    return False


def main():
    """Main cleanup function."""
    print("=" * 50)
    print("  Blog Cleanup Script")
    print("=" * 50)
    print()

    # 1. Scan blog folder
    print("[1/4] Scanning blog/ folder...")
    existing = get_existing_posts()
    print(f"      Found {len(existing)} existing posts")
    
    # 2. Load state and find orphaned posts
    print("[2/4] Checking for orphaned posts...")
    state = load_state()
    published = set(state.get("published_posts", []))
    orphaned = published - existing
    
    if not orphaned:
        print("      No orphaned posts found!")
        print()
        print("=" * 50)
        print("  Nothing to clean up!")
        print("=" * 50)
        return
    
    print(f"      Found {len(orphaned)} orphaned posts:")
    for slug in orphaned:
        print(f"        - {slug}")
    
    # 3. Clean blog/index.html
    print("[3/4] Cleaning blog/index.html...")
    cleaned_cards = 0
    for slug in orphaned:
        if remove_card_from_index(slug):
            print(f"      Removed card: {slug}")
            cleaned_cards += 1
    
    # 4. Clean homepage
    print("[4/4] Cleaning homepage...")
    recent_posts = state.get("recent_posts", [])
    if update_homepage_featured(recent_posts):
        print("      Updated homepage featured card")
    
    # 5. Update state.json
    print()
    print("Updating state.json...")
    state["published_posts"] = list(existing & published)
    state["recent_posts"] = [p for p in recent_posts if p["slug"] in existing]
    save_state(state)
    print(f"      Removed {len(orphaned)} posts from state")
    
    print()
    print("=" * 50)
    print(f"  Done! Cleaned {cleaned_cards} orphaned cards.")
    print("=" * 50)


if __name__ == "__main__":
    main()
