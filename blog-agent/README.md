# MakerWorks Blog Agent

Automated blog post generator for MakerWorks robotics website (makerworkslab.in).

## What It Does

- Generates robotics blog posts using Google Gemini API
- Fetches real images from Pexels API
- Updates blog index and homepage automatically
- Deploys to GitHub Pages

## Quick Start

### Run Locally

```bash
# Navigate to blog-agent folder
cd ummadi-ajay.github.io/blog-agent

# Generate a new blog post
python agent.py

# Push to GitHub
cd ..
git add -A
git commit -m "New blog post"
git push origin main
```

### Run Cleanup (Remove Deleted Post Cards)

```bash
cd blog-agent
python cleanup.py
```

---

## Commands Reference

| Command | What It Does |
|---------|--------------|
| `python agent.py` | Cleans up + generates new blog post with image |
| `python cleanup.py` | Only removes orphaned cards (no new post) |

---

## Environment Variables

The agent reads API keys from `.env` file (not committed to GitHub).

### .env File Format

```
GEMINI_API_KEY=your-gemini-api-key
PEXELS_API_KEY=your-pexels-api-key
```

### Or Set Environment Variables (Windows PowerShell)

```powershell
$env:GEMINI_API_KEY = "your-gemini-key"
$env:PEXELS_API_KEY = "your-pexels-key"
```

---

## GitHub Actions (Automatic Publishing)

### Schedule

- **When**: Monday & Thursday at 10:00 AM IST
- **What**: Auto-cleans orphaned posts + generates new blog post

### Manual Trigger

1. Go to your GitHub repo
2. Click **Actions** tab
3. Click **Generate Robotics Blog Post**
4. Click **Run workflow** button

### Required Secrets

Add these in GitHub → Settings → Secrets and variables → Actions:

| Secret Name | Description |
|-------------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `PEXELS_API_KEY` | Pexels API key for images |

### How to Add Secrets

1. Go to: https://github.com/ummadi-ajay/ummadi-ajay.github.io
2. Click **Settings**
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add `GEMINI_API_KEY` with your key
6. Repeat for `PEXELS_API_KEY`

---

## Changing the Schedule

Edit `.github/workflows/blog-generator.yml`:

```yaml
on:
  schedule:
    - cron: '30 4 * * 1,4'  # Mon & Thu 10AM IST
```

### Common Schedules

| Schedule | Cron Expression |
|----------|-----------------|
| Mon & Thu 10AM IST | `30 4 * * 1,4` |
| Daily 10AM IST | `30 4 * * *` |
| Every Monday | `30 4 * * 1` |
| Every 6 hours | `0 */6 * * *` |
| Every hour | `0 * * * *` |

---

## How Auto-Cleanup Works

When you delete a blog post from GitHub:

1. **Without cleanup**: Card still appears on blog index and homepage
2. **With cleanup**: Card is automatically removed

### Option 1: Manual Cleanup

```bash
cd blog-agent
python cleanup.py
git add -A
git commit -m "Clean up orphaned cards"
git push
```

### Option 2: Auto Cleanup

Every time `python agent.py` runs (manual or GitHub Actions), it:
1. Scans blog/ folder for existing posts
2. Removes cards for posts that no longer exist
3. Updates homepage if it references deleted posts
4. Updates state.json
5. Then generates new blog post

---

## File Structure

```
ummadi-ajay.github.io/
├── .github/
│   └── workflows/
│       └── blog-generator.yml   # GitHub Actions workflow
├── blog/
│   ├── blogphotos/              # Blog images
│   ├── *.html                   # Blog posts
│   └── index.html               # Blog listing page
├── blog-agent/
│   ├── agent.py                 # Main blog generator
│   ├── cleanup.py               # Cleanup script
│   ├── config.py                # Settings & topics
│   ├── requirements.txt         # Python dependencies
│   ├── state.json               # Tracks published posts
│   ├── .env                     # API keys (not in git)
│   └── templates/
│       ├── blog_post.html       # Blog post template
│       └── blog_index_card.html # Blog card template
├── index.html                   # Homepage
└── .gitignore                   # Ignores .env file
```

---

## Troubleshooting

### "API key was reported as leaked"

Your Gemini API key was exposed. Get a new one:
1. Go to https://aistudio.google.com/app/apikey
2. Create new key
3. Update `.env` file or GitHub Secrets

### Cards still showing after deleting posts

Run cleanup:
```bash
python cleanup.py
```

### GitHub Actions not running

1. Check if secrets are added (Settings → Secrets)
2. Check if Actions is enabled (Actions tab → "I understand my workflows")
3. Check workflow file exists at `.github/workflows/blog-generator.yml`

### Image not fetching

1. Check Pexels API key is correct
2. Check internet connection
3. Pexels free tier: 200 requests/hour

---

## Topics Rotation

The agent rotates through 15 robotics topics:

1. AI in Robotics
2. Reinforcement Learning in Robots
3. Computer Vision for Robotics
4. Humanoid Robots and AI
5. Autonomous Vehicles
6. AI-Powered Drones
7. Collaborative Robots (Cobots)
8. Industrial Robotics
9. Surgical and Medical Robots
10. Space Robotics
11. Swarm Robotics
12. Soft Robotics
13. Agricultural Robots
14. Warehouse and Logistics Robots
15. Robot Ethics and Safety

---

## Dependencies

```
google-generativeai>=0.7.0
jinja2>=3.1.0
requests>=2.28.0
```

Install:
```bash
pip install -r requirements.txt
```

---

## Website

- **URL**: https://makerworkslab.in
- **Blog**: https://makerworkslab.in/blog
- **GitHub**: https://github.com/ummadi-ajay/ummadi-ajay.github.io
