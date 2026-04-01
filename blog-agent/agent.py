"""
MakerWorks Blog Agent
Automatically generates robotics blog posts and publishes to GitHub Pages.
"""

import os
import re
import sys
import json
import hashlib
from datetime import datetime
from pathlib import Path

import requests
import google.generativeai as genai
from jinja2 import Environment, FileSystemLoader

from config import GEMINI_API_KEY, PEXELS_API_KEY, TOPICS, GENERATION_CONFIG, BLOG_URL, AUTHOR, WORDS_MIN, WORDS_MAX

# Paths
SCRIPT_DIR = Path(__file__).parent
TEMPLATES_DIR = SCRIPT_DIR / "templates"
REPO_ROOT = SCRIPT_DIR.parent
BLOG_DIR = REPO_ROOT / "blog"
STATE_FILE = SCRIPT_DIR / "state.json"


def load_state():
    """Load the current state (last topic index, published posts)."""
    if STATE_FILE.exists():
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"last_topic_index": -1, "published_posts": [], "recent_posts": []}


def save_state(state):
    """Save the current state."""
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def get_next_topic(state):
    """Get the next topic from the rotation."""
    last_index = state.get("last_topic_index", -1)
    next_index = (last_index + 1) % len(TOPICS)
    state["last_topic_index"] = next_index
    return TOPICS[next_index]


def generate_slug(title):
    """Convert title to URL-friendly slug."""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug[:60]


def estimate_read_time(content):
    """Estimate read time in minutes based on word count."""
    text = re.sub(r'<[^>]+>', '', content)
    word_count = len(text.split())
    return max(3, round(word_count / 200))


def fetch_blog_image(topic, slug):
    """Fetch a relevant image from Pexels API based on topic keywords."""
    # Create blogphotos directory if it doesn't exist
    photos_dir = BLOG_DIR / "blogphotos"
    photos_dir.mkdir(parents=True, exist_ok=True)
    
    # Build search query from topic keywords
    keywords = topic['keywords'].split(',')[0].strip()  # Use first keyword
    search_query = f"{keywords} robot"
    
    print(f"      Searching Pexels for: {search_query}")
    
    headers = {"Authorization": PEXELS_API_KEY}
    url = f"https://api.pexels.com/v1/search?query={search_query}&per_page=1&orientation=landscape"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get('photos') and len(data['photos']) > 0:
                photo = data['photos'][0]
                img_url = photo['src']['large']
                
                # Download the image
                img_response = requests.get(img_url, timeout=10)
                
                if img_response.status_code == 200:
                    # Save as .webp format (smaller file size)
                    img_path = photos_dir / f"{slug}.jpg"
                    with open(img_path, "wb") as f:
                        f.write(img_response.content)
                    
                    print(f"      Image saved: {img_path}")
                    
                    return {
                        "path": img_path,
                        "filename": f"{slug}.jpg",
                        "photographer": photo.get('photographer', 'Unknown'),
                        "photographer_url": photo.get('photographer_url', ''),
                        "pexels_url": photo.get('url', ''),
                        "avg_color": photo.get('avg_color', '#6c757d')
                    }
                else:
                    print(f"      Warning: Failed to download image")
            else:
                print(f"      Warning: No photos found for query: {search_query}")
        else:
            print(f"      Warning: Pexels API error: {response.status_code}")
    
    except requests.exceptions.RequestException as e:
        print(f"      Warning: Image fetch failed: {e}")
    
    # Return None if image fetch fails
    return None


def configure_gemini():
    """Configure the Gemini API client."""
    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-2.5-flash")


def generate_blog_content(model, topic):
    """Generate blog content using Gemini API."""
    prompt = f"""Write a detailed blog post for a robotics and STEM education website called MakerWorks (makerworkslab.in).
The target audience is students, educators, and robotics enthusiasts in India.

Topic: {topic['name']}
Keywords: {topic['keywords']}
Length: {WORDS_MIN}-{WORDS_MAX} words
Style: Educational, engaging, informative

Requirements:
1. Start with a compelling introduction paragraph (use <p class="lead">...</p> for the intro)
2. Use <h2> tags for main section headings
3. Use <h3> tags for sub-section headings if needed
4. Use <ul> or <ol> lists where appropriate
5. Include at least one code example in a <pre><code> block if relevant
6. Use <blockquote> for important quotes or key insights
7. End with a conclusion and call-to-action
8. Write in HTML format (NOT Markdown)
9. Do NOT include the title, meta tags, or page structure - just the article body content
10. Make it engaging and educational for young learners (ages 10-17)

Return ONLY the HTML content of the article body (starting from the first <p> tag).
Do not include any <html>, <head>, <body>, or <div> wrapper tags.

Also provide a JSON object at the VERY END of your response with:
- "title": A catchy blog title (max 70 chars)
- "meta_description": SEO meta description (max 155 chars)
- "short_description": Brief card description (max 120 chars)

Format the JSON like this at the very end:
<!--META{{"title": "...", "meta_description": "...", "short_description": "..."}}-->"""

    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(**GENERATION_CONFIG)
    )
    return response.text


def parse_response(response_text):
    """Parse the Gemini response to extract content and metadata."""
    meta_match = re.search(r'<!--META(.*?)-->', response_text, re.DOTALL)

    content = response_text
    meta = {
        "title": "Untitled Post",
        "meta_description": "",
        "short_description": ""
    }

    if meta_match:
        try:
            meta = json.loads(meta_match.group(1).strip())
        except json.JSONDecodeError:
            pass
        content = response_text[:meta_match.start()].strip()

    return content, meta


def render_blog_post(template_env, content, meta, topic, slug, image_info=None):
    """Render the blog post HTML using Jinja2 template."""
    template = template_env.get_template("blog_post.html")

    now = datetime.now()

    html = template.render(
        title=meta["title"],
        meta_description=meta["meta_description"],
        keywords=topic["keywords"],
        slug=slug,
        date=now.strftime("%B %d, %Y"),
        date_iso=now.strftime("%Y-%m-%dT%H:%M:%S+05:30"),
        author=AUTHOR,
        badge=topic["badge"],
        badge_color=topic["badge_color"],
        topic_icon="bi-cpu",
        content=content,
        image_info=image_info,
    )

    return html


def render_index_card(template_env, meta, topic, slug, image_info=None):
    """Render the blog index card HTML."""
    template = template_env.get_template("blog_index_card.html")

    card_html = template.render(
        title=meta["title"],
        short_description=meta["short_description"],
        slug=slug,
        badge=topic["badge"],
        badge_color=topic["badge_color"],
        topic_icon="bi-cpu",
        read_time=estimate_read_time(""),
        image_filename=image_info["filename"] if image_info else None,
    )

    return card_html


def inject_card_into_index(index_path, card_html):
    """Inject a new card into the blog index.html at the top of the card grid."""
    if not index_path.exists():
        print(f"Warning: Blog index not found at {index_path}")
        return False

    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()

    marker = '<div class="row g-4">'
    if marker not in content:
        print("Warning: Could not find card grid marker in blog index")
        return False

    new_content = content.replace(
        marker,
        f'{marker}\n                {card_html}\n',
        1
    )

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True


def update_homepage(homepage_path, meta, topic, slug, image_info=None, recent_posts=None):
    """Update the homepage Engineering Logs section with the new blog post as featured."""
    if not homepage_path.exists():
        print(f"Warning: Homepage not found at {homepage_path}")
        return False

    with open(homepage_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Build background style - use image if available, otherwise gradient
    if image_info:
        bg_style = f"background: url('blog/blogphotos/{image_info['filename']}') center/cover no-repeat;"
        overlay = '''<div class="position-absolute bottom-0 start-0 w-100 h-100"
                  style="background: linear-gradient(0deg, #ffffff 15%, rgba(255,255,255,0.85) 35%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.5) 100%);">
                </div>'''
        icon_div = ''  # No icon when using real image
    else:
        bg_style = f"background: {topic['badge_color']};"
        overlay = '''<div class="position-absolute bottom-0 start-0 w-100 h-100"
                  style="background: linear-gradient(0deg, #ffffff 10%, rgba(255,255,255,0.8) 30%, transparent 100%);">
                </div>'''
        icon_div = '''<div class="position-absolute top-50 start-50 translate-middle" style="z-index: 1;">
                  <i class="bi bi-cpu" style="font-size: 5rem; color: rgba(255,255,255,0.3);"></i>
                </div>'''

    # Featured blog card HTML - replaces the existing featured card
    featured_card = f'''        <!-- Featured Blog - Auto Generated -->
        <div class="col-lg-8" data-aos="fade-up">
          <a href="blog/{slug}.html" style="text-decoration: none; color: inherit;">
            <div class="blog-card-featured w-100 rounded-5 overflow-hidden shadow-lg position-relative d-flex flex-column"
              style="background: linear-gradient(135deg, rgba(13, 110, 253, 0.08) 0%, rgba(111, 66, 193, 0.05) 100%); transition: all 0.4s ease;">
              <!-- Featured Badge -->
              <div class="position-absolute top-0 start-0 p-4" style="z-index: 2;">
                <span class="badge rounded-pill shadow-sm"
                  style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 10px 24px; font-weight: 700; font-size: 0.75rem; letter-spacing: 1px;">
                  <i class="bi bi-star-fill me-1"></i> LATEST
                </span>
              </div>

              <!-- Background -->
              <div class="blog-bg-image position-absolute top-0 start-0 w-100"
                style="height: 65%; {bg_style} z-index: 0;">
                {overlay}
                {icon_div}
              </div>

              <!-- Content -->
              <div class="blog-content position-relative p-4 p-md-5 mt-auto" style="z-index: 1;">
                <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                  <span class="badge rounded-pill px-3 py-2 fw-semibold" style="background: {topic['badge_color']}; color: white;">
                    <i class="bi bi-robot me-1"></i> {topic['badge']}
                  </span>
                  <span class="text-secondary small fw-medium ms-auto">
                    <i class="bi bi-clock me-1"></i> 7 min read
                  </span>
                </div>
                <h3 class="fw-bold mb-3 text-dark" style="font-size: clamp(1.5rem, 3vw, 2rem); line-height: 1.2;">{meta['title']}</h3>
                <p class="text-muted mb-4 d-none d-md-block">{meta['short_description']}</p>
                <span class="btn-premium btn-primary-mw w-100 w-md-auto d-inline-block" style="cursor: pointer;">
                  Read Full Article <i class="bi bi-arrow-right ms-2"></i>
                </span>
              </div>
            </div>
          </a>
          <style>
            .blog-card-featured {{
              min-height: 500px;
            }}

            @media (max-width: 768px) {{
              .blog-card-featured {{
                min-height: 400px;
              }}
            }}
          </style>
        </div>'''

    # Build secondary blog cards from recent posts
    secondary_cards = ""
    if recent_posts and len(recent_posts) >= 2:
        # Get the 2 most recent posts (excluding the current featured one)
        secondary_posts = recent_posts[-2:] if len(recent_posts) >= 2 else recent_posts
        
        for i, post in enumerate(secondary_posts[:2]):
            border_color = "rgba(13, 110, 253, 0.1)" if i == 0 else "rgba(255, 102, 0, 0.1)"
            badge_bg = "rgba(13, 110, 253, 0.1)" if i == 0 else "rgba(255, 102, 0, 0.1)"
            badge_text = "#0d6efd" if i == 0 else "#ff6600"
            icon = "bi-lightning" if i == 0 else "bi-speedometer2"
            
            secondary_cards += f'''
            <div class="col-12">
              <a href="blog/{post['slug']}.html" style="text-decoration: none; color: inherit;">
                <div class="blog-card-secondary"
                  style="background: white; border-radius: 24px; padding: 35px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); min-height: 235px; display: flex; flex-direction: column; position: relative; overflow: hidden; border: 2px solid {border_color};">
                  <!-- Icon Background -->
                  <div
                    style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, {badge_bg} 0%, transparent 70%); border-radius: 50%;">
                  </div>

                  <div style="position: relative; z-index: 1;">
                    <div class="d-flex align-items-center gap-2 mb-3">
                      <span class="badge"
                        style="background: {badge_bg}; color: {badge_text}; padding: 5px 14px; border-radius: 100px; font-weight: 600; font-size: 0.75rem;">
                        <i class="bi {icon} me-1"></i> {post['badge']}
                      </span>
                      <span style="color: #6c757d; font-size: 0.8rem;">
                        <i class="bi bi-clock me-1"></i> 7 min
                      </span>
                    </div>
                    <h4 class="fs-4 fw-800 mb-3" style="line-height: 1.3;">{post['title']}</h4>
                    <p class="text-muted small mb-4" style="line-height: 1.6;">{post['short_description']}</p>
                    <span class="btn btn-link link-primary p-0 mt-auto" style="font-weight: 700; text-decoration: none;">
                      Read Article <i class="bi bi-arrow-right ms-1"></i>
                    </span>
                  </div>
                </div>
              </a>
            </div>'''
    else:
        # Fallback to default cards if no recent posts
        secondary_cards = '''
            <div class="col-12">
              <div class="blog-card-secondary"
                style="background: white; border-radius: 24px; padding: 35px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); min-height: 235px; display: flex; flex-direction: column; position: relative; overflow: hidden; border: 2px solid rgba(13, 110, 253, 0.1);">
                <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(13, 110, 253, 0.08) 0%, transparent 70%); border-radius: 50%;">
                </div>
                <div style="position: relative; z-index: 1;">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="badge" style="background: rgba(13, 110, 253, 0.1); color: #0d6efd; padding: 5px 14px; border-radius: 100px; font-weight: 600; font-size: 0.75rem;">
                      <i class="bi bi-lightning me-1"></i> Beginner
                    </span>
                    <span style="color: #6c757d; font-size: 0.8rem;">
                      <i class="bi bi-clock me-1"></i> 5 min
                    </span>
                  </div>
                  <h4 class="fs-4 fw-800 mb-3" style="line-height: 1.3;">Arduino LED Basics</h4>
                  <p class="text-muted small mb-4" style="line-height: 1.6;">The "Hello World" of hardware engineering.</p>
                  <button class="btn btn-link link-primary p-0 mt-auto" data-bs-toggle="modal" data-bs-target="#blog1Modal" style="font-weight: 700; text-decoration: none;">
                    Open Log <i class="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="blog-card-secondary"
                style="background: white; border-radius: 24px; padding: 35px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); min-height: 235px; display: flex; flex-direction: column; position: relative; overflow: hidden; border: 2px solid rgba(255, 102, 0, 0.1);">
                <div style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(255, 102, 0, 0.08) 0%, transparent 70%); border-radius: 50%;">
                </div>
                <div style="position: relative; z-index: 1;">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <span class="badge" style="background: rgba(255, 102, 0, 0.1); color: #ff6600; padding: 5px 14px; border-radius: 100px; font-weight: 600; font-size: 0.75rem;">
                      <i class="bi bi-speedometer2 me-1"></i> Hardware
                    </span>
                    <span style="color: #6c757d; font-size: 0.8rem;">
                      <i class="bi bi-clock me-1"></i> 6 min
                    </span>
                  </div>
                  <h4 class="fs-4 fw-800 mb-3" style="line-height: 1.3;">Top 5 Sensors</h4>
                  <p class="text-muted small mb-4" style="line-height: 1.6;">Essential components for every modern IoT project.</p>
                  <button class="btn btn-link link-primary p-0 mt-auto" data-bs-toggle="modal" data-bs-target="#blog3Modal" style="font-weight: 700; text-decoration: none;">
                    Open Log <i class="bi bi-arrow-right ms-1"></i>
                  </button>
                </div>
              </div>
            </div>'''

    # Find and replace the featured blog section
    start_marker = '<!-- Featured Blog'
    end_marker = '<!-- Secondary Blogs -->'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        # Try alternative markers
        start_marker = '<div class="col-lg-8" data-aos="fade-up">'
        end_marker = '<!-- Secondary Blogs -->'
        start_idx = content.find(start_marker)
        end_idx = content.find(end_marker)
    
    if start_idx != -1 and end_idx != -1:
        # Replace featured card and secondary cards
        new_content = content[:start_idx] + featured_card + '\n\n        ' + end_marker + '\n        <div class="col-lg-4" data-aos="fade-up" data-aos-delay="100">\n          <div class="row g-4 h-100">\n' + secondary_cards + '\n          </div>\n        </div>'
        
        # Find where secondary section ends (before the style tag)
        style_marker = '<style>\n        /* Blog Card Hover Effects */'
        style_idx = content.find(style_marker, end_idx)
        
        if style_idx != -1:
            new_content += '\n      </div>\n\n      ' + content[style_idx:]
            
            with open(homepage_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            return True
    
    print("Warning: Could not find featured blog section in homepage")
    return False


def save_blog_post(html, slug):
    """Save the blog post HTML to the blog directory."""
    blog_dir = Path(BLOG_DIR)
    blog_dir.mkdir(parents=True, exist_ok=True)

    post_path = blog_dir / f"{slug}.html"
    with open(post_path, "w", encoding="utf-8") as f:
        f.write(html)

    return post_path


def run():
    """Main entry point for the blog agent."""
    print("=" * 50)
    print("  MakerWorks Blog Agent")
    print("=" * 50)
    print()

    # Load state
    state = load_state()
    print(f"[1/7] Loaded state. {len(state['published_posts'])} posts published so far.")

    # Get next topic
    topic = get_next_topic(state)
    print(f"[2/7] Selected topic: {topic['name']}")
    print(f"      Badge: {topic['badge']}")

    # Configure Gemini
    print("[3/7] Connecting to Gemini API...")
    model = configure_gemini()

    # Generate content
    print("[4/7] Generating blog content...")
    try:
        response_text = generate_blog_content(model, topic)
        content, meta = parse_response(response_text)
        print(f"      Title: {meta['title']}")
        print(f"      Words: ~{len(content.split())}")
    except Exception as e:
        print(f"ERROR: Failed to generate content: {e}")
        sys.exit(1)

    # Generate slug
    slug = generate_slug(meta["title"])

    # Check for duplicate slug
    if slug in state.get("published_posts", []):
        slug = f"{slug}-{datetime.now().strftime('%Y%m%d')}"
    print(f"      Slug: {slug}")

    # Fetch blog image from Pexels
    print("[5/7] Fetching blog image from Pexels...")
    image_info = fetch_blog_image(topic, slug)

    # Render templates
    print("[6/7] Rendering HTML templates...")
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))

    post_html = render_blog_post(env, content, meta, topic, slug, image_info)
    card_html = render_index_card(env, meta, topic, slug, image_info)

    # Save blog post
    post_path = save_blog_post(post_html, slug)
    print(f"      Saved: {post_path}")

    # Inject card into index
    index_path = BLOG_DIR / "index.html"
    if inject_card_into_index(index_path, card_html):
        print(f"      Updated: {index_path}")
    else:
        print(f"      Warning: Could not update index (manual update needed)")

    # Update homepage Engineering Logs section
    homepage_path = REPO_ROOT / "index.html"
    recent_posts = state.get("recent_posts", [])
    if update_homepage(homepage_path, meta, topic, slug, image_info, recent_posts):
        print(f"      Updated homepage: {homepage_path}")
    else:
        print(f"      Warning: Could not update homepage (manual update needed)")

    # Update state
    state["published_posts"].append(slug)
    
    # Add to recent_posts (keep last 5 posts)
    if "recent_posts" not in state:
        state["recent_posts"] = []
    
    post_meta = {
        "slug": slug,
        "title": meta["title"],
        "badge": topic["badge"],
        "badge_color": topic["badge_color"],
        "short_description": meta["short_description"]
    }
    state["recent_posts"].append(post_meta)
    
    # Keep only last 5 posts in recent_posts
    if len(state["recent_posts"]) > 5:
        state["recent_posts"] = state["recent_posts"][-5:]
    
    state["last_run"] = datetime.now().isoformat()
    save_state(state)

    print()
    print("[7/7] Blog post generated successfully!")
    print(f"      File: blog/{slug}.html")
    print(f"      URL:  {BLOG_URL}{slug}.html")
    print()
    print("=" * 50)
    print("  Done! Commit and push to publish.")
    print("=" * 50)

    return {
        "slug": slug,
        "title": meta["title"],
        "file": str(post_path),
    }


if __name__ == "__main__":
    run()
