"""
MakerWorks Photo Sync Agent
Automatically downloads photos from Google Drive and updates the gallery.
"""

import os
import io
import re
import sys
import json
import base64
from datetime import datetime
from pathlib import Path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from PIL import Image

# Paths
SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent
GALLERY_DIR = REPO_ROOT / "gallery"
PHOTOS_DIR = GALLERY_DIR / "galleryphotos"
STATE_FILE = SCRIPT_DIR / "state.json"

# Config
FOLDER_ID = "1f4AsSQAGMKBELJzeNx6n9HMz5RibQNzK"
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}


def load_state():
    if STATE_FILE.exists():
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    return {"synced_files": {}, "last_run": None, "total_synced": 0}


def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def get_drive_service():
    creds_b64 = os.environ.get("GOOGLE_SERVICE_ACCOUNT_KEY")
    if not creds_b64:
        print("ERROR: GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set")
        sys.exit(1)

    try:
        # Clean up the base64 string (remove whitespace, newlines, quotes)
        creds_b64 = creds_b64.strip().replace('\n', '').replace('\r', '').replace(' ', '')
        # Remove surrounding quotes if present
        if creds_b64.startswith('"') and creds_b64.endswith('"'):
            creds_b64 = creds_b64[1:-1]

        decoded = base64.b64decode(creds_b64)
        creds_json = decoded.decode('utf-8')
        creds_info = json.loads(creds_json)
    except Exception as e:
        print(f"ERROR: Failed to decode service account key: {e}")
        print(f"  Key length: {len(creds_b64) if creds_b64 else 0} chars")
        sys.exit(1)

    credentials = service_account.Credentials.from_service_account_info(
        creds_info,
        scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    return build("drive", "v3", credentials=credentials)


def list_photos(service, folder_id):
    photos = []
    page_token = None

    while True:
        query = f"'{folder_id}' in parents and trashed = false"
        results = service.files().list(
            q=query,
            pageSize=100,
            fields="nextPageToken, files(id, name, mimeType, modifiedTime)",
            pageToken=page_token
        ).execute()

        for file in results.get("files", []):
            ext = Path(file["name"]).suffix.lower()
            if ext in SUPPORTED_EXTENSIONS or file["mimeType"].startswith("image/"):
                photos.append(file)

        page_token = results.get("nextPageToken")
        if not page_token:
            break

    return photos


def download_photo(service, file_id):
    request = service.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)

    done = False
    while not done:
        _, done = downloader.next_chunk()

    return fh.getvalue()


def convert_to_webp(image_data, output_path):
    img = Image.open(io.BytesIO(image_data))
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    img.save(output_path, "WEBP", quality=85)


def generate_caption(filename):
    name = Path(filename).stem
    name = name.replace("-", " ").replace("_", " ")
    return name.title()


def get_category(filename):
    name_lower = filename.lower()
    if any(w in name_lower for w in ["event", "competition", "hackathon", "contest"]):
        return "events"
    elif any(w in name_lower for w in ["show", "display", "completed", "project", "finish"]):
        return "products"
    else:
        return "people"


def get_category_badge(category):
    badges = {
        "products": {
            "icon": "bi-star",
            "gradient": "linear-gradient(135deg, #4ecdc4, #44a08d)",
            "label": "Product"
        },
        "events": {
            "icon": "bi-calendar-event",
            "gradient": "linear-gradient(135deg, #f093fb, #f5576c)",
            "label": "Event"
        },
        "people": {
            "icon": "bi-person-workspace",
            "gradient": "linear-gradient(135deg, #667eea, #764ba2)",
            "label": "People"
        }
    }
    return badges.get(category, badges["people"])


def generate_gallery_item_html(webp_filename, caption, category):
    badge = get_category_badge(category)
    return f'''            <!-- Gallery Item: {caption} -->
            <div class="gallery-item" data-category="{category}" data-aos="zoom-in">
                <div style="position: relative; overflow: hidden; height: 280px;">
                    <img src="galleryphotos/{webp_filename}" alt="{caption}">
                    <div class="category-badge"
                        style="position: absolute; top: 15px; right: 15px; {badge['gradient']}; color: white; padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                        <i class="bi {badge['icon']} me-1"></i>{badge['label']}
                    </div>
                </div>
                <div class="caption">
                    <i class="bi bi-camera me-2" style="color: #667eea;"></i>{caption}
                </div>
            </div>
'''


def inject_gallery_items(gallery_index, new_items_html):
    if not gallery_index.exists():
        print(f"  Warning: Gallery index not found at {gallery_index}")
        return False

    with open(gallery_index, "r", encoding="utf-8") as f:
        content = f.read()

    marker = '<section class="gallery-grid">'
    if marker not in content:
        print("  Warning: Could not find gallery grid marker")
        return False

    new_content = content.replace(
        marker,
        marker + "\n" + new_items_html,
        1
    )

    with open(gallery_index, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True


def run():
    print("=" * 50)
    print("  MakerWorks Photo Sync Agent")
    print("=" * 50)
    print()

    # Load state
    state = load_state()
    print(f"[1/5] Loaded state. {state['total_synced']} photos synced so far.")

    # Connect to Drive
    print("[2/5] Connecting to Google Drive...")
    try:
        service = get_drive_service()
    except Exception as e:
        print(f"ERROR: Failed to connect to Google Drive: {e}")
        sys.exit(1)

    # List photos
    print("[3/5] Scanning Drive folder for photos...")
    try:
        photos = list_photos(service, FOLDER_ID)
        print(f"      Found {len(photos)} photos in Drive folder")
    except Exception as e:
        print(f"ERROR: Failed to list photos: {e}")
        sys.exit(1)

    # Download new/modified photos
    print("[4/5] Downloading new photos...")
    PHOTOS_DIR.mkdir(parents=True, exist_ok=True)

    downloaded = []
    failed = []
    new_gallery_items = ""

    for photo in photos:
        file_id = photo["id"]
        file_name = photo["name"]
        modified = photo.get("modifiedTime", "")

        synced = state["synced_files"].get(file_id, {})
        if synced.get("modifiedTime") == modified:
            print(f"      Skip (up to date): {file_name}")
            continue

        try:
            print(f"      Downloading: {file_name}")
            image_data = download_photo(service, file_id)

            # Convert to webp
            base_name = Path(file_name).stem
            webp_name = f"{base_name}.webp"
            webp_path = PHOTOS_DIR / webp_name

            convert_to_webp(image_data, str(webp_path))

            caption = generate_caption(base_name)
            category = get_category(base_name)

            downloaded.append({
                "original": file_name,
                "webp": webp_name,
                "caption": caption,
                "category": category
            })

            # Update state
            state["synced_files"][file_id] = {
                "name": file_name,
                "webp_name": webp_name,
                "modifiedTime": modified,
                "syncedAt": datetime.now().isoformat(),
                "caption": caption,
                "category": category
            }

            # Generate gallery item HTML
            new_gallery_items += generate_gallery_item_html(webp_name, caption, category)

        except Exception as e:
            print(f"      FAILED: {file_name} - {e}")
            failed.append(file_name)

    # Update gallery page
    print("[5/5] Updating gallery page...")
    if new_gallery_items:
        if inject_gallery_items(GALLERY_DIR / "index.html", new_gallery_items):
            print(f"      Added {len(downloaded)} new items to gallery")
        else:
            print("      Warning: Could not update gallery page")
    else:
        print("      No new photos to add")

    # Save state
    state["last_run"] = datetime.now().isoformat()
    state["total_synced"] = len(state["synced_files"])
    save_state(state)

    # Summary
    print()
    print("--- Sync Summary ---")
    print(f"Total in Drive: {len(photos)}")
    print(f"Newly synced:   {len(downloaded)}")
    print(f"Failed:         {len(failed)}")
    print(f"Total synced:   {state['total_synced']}")
    print()
    print("=" * 50)
    print("  Done! Commit and push to publish.")
    print("=" * 50)


if __name__ == "__main__":
    run()
