"""
Bulk Exercise Image Downloader
Uses the free wger.de API (open-source exercise database, no API key needed)
Downloads images for all exercises in the workout plan.

Usage:
    python download_exercise_images.py

Images are saved to: images/exercises/
"""

import os
import json
import time
import urllib.request
import urllib.parse
import urllib.error

# Target folder
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'images', 'exercises')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Exercise name → filename mapping
# The search term is what we query wger.de for
EXERCISES = [
    # Monday - Push
    ('Bench Press', 'bench-press.jpg'),
    ('Incline Dumbbell Press', 'incline-db-press.jpg'),
    ('Seated Dumbbell Shoulder Press', 'seated-db-shoulder-press.jpg'),
    ('Machine Chest Press', 'machine-chest-press.jpg'),
    ('Cable Lateral Raise', 'cable-lateral-raise.jpg'),
    ('Tricep Rope Pushdown', 'rope-pushdown.jpg'),
    ('Push Ups', 'push-ups.jpg'),
    ('Cable Crunch', 'cable-crunch.jpg'),

    # Tuesday - Pull
    ('Assisted Pull Up', 'assisted-pull-up.jpg'),
    ('Chest Supported Row', 'chest-supported-row.jpg'),
    ('Lat Pulldown', 'lat-pulldown.jpg'),
    ('Seated Cable Row', 'seated-cable-row.jpg'),
    ('Face Pull', 'face-pull.jpg'),
    ('Incline Dumbbell Curl', 'incline-curl.jpg'),
    ('Hammer Curl', 'hammer-curl.jpg'),

    # Wednesday - Lower A
    ('Hip Thrust', 'hip-thrust.jpg'),
    ('Barbell Squat', 'back-squat.jpg'),
    ('Bulgarian Split Squat', 'bulgarian-split-squat.jpg'),
    ('Leg Press', 'leg-press.jpg'),
    ('Leg Extension', 'leg-extension.jpg'),
    ('Standing Calf Raise', 'standing-calf-raise.jpg'),
    ('Hanging Knee Raise', 'hanging-knee-raise.jpg'),

    # Thursday - Upper Hypertrophy
    ('Machine Shoulder Press', 'machine-shoulder-press.jpg'),
    ('Rear Delt Fly', 'rear-delt-fly.jpg'),
    ('Wide Grip Lat Pulldown', 'wide-grip-pulldown.jpg'),
    ('Machine Row', 'machine-high-row.jpg'),
    ('Single Arm Lat Pulldown', 'single-arm-lat-pulldown.jpg'),
    ('Ab Wheel Rollout', 'ab-wheel.jpg'),
    ('Pallof Press', 'pallof-press.jpg'),
    ('Side Plank', 'side-plank.jpg'),
    ('Dead Bug', 'dead-bug.jpg'),
    ('Farmer Walk', 'farmer-carry.jpg'),

    # Friday - Pull + Arms
    ('Reverse Pec Deck', 'reverse-pec-deck.jpg'),
    ('EZ Bar Curl', 'ez-bar-curl.jpg'),
    ('Cable Curl', 'cable-curl.jpg'),
    ('Incline Treadmill', 'incline-walk.jpg'),

    # Saturday - Glute Specialization
    ('Romanian Deadlift', 'romanian-deadlift.jpg'),
    ('Walking Lunge', 'walking-lunges.jpg'),
    ('Leg Curl', 'leg-curl.jpg'),
    ('Cable Kickback', 'cable-kickback.jpg'),
    ('Back Extension', '45-back-extension.jpg'),
    ('Hip Abduction Machine', 'hip-abductor-machine.jpg'),
    ('Hanging Leg Raise', 'hanging-leg-raise.jpg'),
    ('Cable Wood Chop', 'cable-wood-chop.jpg'),
    ('Reverse Crunch', 'reverse-crunch.jpg'),
]


def search_wger(query):
    """Search wger.de exercise database and get image URL."""
    url = f"https://wger.de/api/v2/exercise/search/?term={urllib.parse.quote(query)}&language=english&format=json"
    try:
        req = urllib.request.Request(url, headers={'Accept': 'application/json'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            if data.get('suggestions'):
                exercise_id = data['suggestions'][0]['data']['id']
                return get_exercise_image(exercise_id)
    except Exception as e:
        print(f"  Search failed: {e}")
    return None


def get_exercise_image(exercise_id):
    """Get image URL for an exercise by ID."""
    url = f"https://wger.de/api/v2/exerciseimage/?exercise_base={exercise_id}&format=json"
    try:
        req = urllib.request.Request(url, headers={'Accept': 'application/json'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode())
            if data.get('results'):
                return data['results'][0]['image']
    except Exception as e:
        print(f"  Image lookup failed: {e}")
    return None


def download_image(url, filepath):
    """Download image from URL to filepath."""
    try:
        urllib.request.urlretrieve(url, filepath)
        return True
    except Exception as e:
        print(f"  Download failed: {e}")
        return False


def main():
    print("=" * 60)
    print("  FitOS Exercise Image Downloader")
    print("  Source: wger.de (free, open-source)")
    print("=" * 60)
    print(f"\n  Output: {OUTPUT_DIR}\n")

    success = 0
    failed = []

    for i, (search_name, filename) in enumerate(EXERCISES, 1):
        filepath = os.path.join(OUTPUT_DIR, filename)

        # Skip if already exists
        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            print(f"  [{i}/{len(EXERCISES)}] ✓ {filename} (already exists)")
            success += 1
            continue

        print(f"  [{i}/{len(EXERCISES)}] Searching: {search_name}...", end=' ')

        image_url = search_wger(search_name)
        if image_url:
            if download_image(image_url, filepath):
                print(f"✓ saved as {filename}")
                success += 1
            else:
                print("✗ download failed")
                failed.append((search_name, filename))
        else:
            print("✗ not found")
            failed.append((search_name, filename))

        # Rate limiting - be polite to the free API
        time.sleep(1)

    print(f"\n{'=' * 60}")
    print(f"  Done! {success}/{len(EXERCISES)} images downloaded")

    if failed:
        print(f"\n  ⚠ {len(failed)} images need manual download:")
        print(f"  (Google the exercise name → Save image to images/exercises/)\n")
        for name, filename in failed:
            print(f"    • {name} → {filename}")

    print(f"\n{'=' * 60}")


if __name__ == '__main__':
    main()
