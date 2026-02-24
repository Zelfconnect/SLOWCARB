#!/bin/bash
# Batch generate food photos for all SlowCarb recipes
# Rate limit: 10s delay between requests

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/public/recipes"
RECIPES_JSON="$PROJECT_DIR/src/data/recipes.json"
NANO_SCRIPT="/Users/jesperhorst/clawd/skills/nano-banana-pro/scripts/generate_image.py"

mkdir -p "$OUTPUT_DIR"

echo "🍌 SlowCarb Recipe Photo Generator"
echo "Output: $OUTPUT_DIR"
echo "=================================="

# Extract recipes en genereer foto per recept
python3 << PYEOF
import json, subprocess, time, os, sys

OUTPUT_DIR = "$OUTPUT_DIR"
RECIPES_JSON = "$RECIPES_JSON"
NANO_SCRIPT = "$NANO_SCRIPT"

data = json.load(open(RECIPES_JSON))
recipes = data["recipes"]

print(f"Totaal: {len(recipes)} recepten")

generated = 0
skipped = 0
failed = 0

for i, r in enumerate(recipes):
    rid = r["id"]
    title = r["title"]
    subtitle = r.get("subtitle", "")
    ingredients = r.get("ingredients", [])[:4]
    tags = r.get("tags", [])
    
    output_path = os.path.join(OUTPUT_DIR, f"{rid}.png")
    
    # Skip al gegenereerde
    if os.path.exists(output_path):
        print(f"  ✅ Skip {i+1}/{len(recipes)}: {title} (al aanwezig)")
        skipped += 1
        continue
    
    # Bepaal stijl op basis van tags
    meal_context = ""
    if "ontbijt" in tags:
        meal_context = "breakfast plate, morning light"
    elif "lunch" in tags:
        meal_context = "lunch bowl, bright natural light"
    elif "avondeten" in tags:
        meal_context = "dinner plate, warm evening light"
    elif "snack" in tags:
        meal_context = "snack plate, casual styling"
    else:
        meal_context = "meal plate, natural light"
    
    ingr_str = ", ".join(ingredients).replace('"', "'")
    
    prompt = (
        f"Professional food photography, overhead shot, white ceramic plate or bowl, "
        f"wooden table background, natural side lighting, shallow depth of field. "
        f"Appetizing {title.lower()} — {subtitle.lower()}. "
        f"Key ingredients: {ingr_str}. "
        f"Clean minimal food styling, {meal_context}, "
        f"high resolution, magazine quality. No text, no logos."
    )
    
    print(f"  📸 {i+1}/{len(recipes)}: {title}...", end="", flush=True)
    
    try:
        result = subprocess.run(
            ["uv", "run", NANO_SCRIPT,
             "--prompt", prompt,
             "--filename", output_path,
             "--resolution", "1K"],
            capture_output=True, text=True, timeout=60
        )
        
        if result.returncode == 0 and os.path.exists(output_path):
            size = os.path.getsize(output_path)
            print(f" ✅ ({size//1024}KB)")
            generated += 1
        else:
            print(f" ❌ error: {result.stderr[:100]}")
            failed += 1
            
    except subprocess.TimeoutExpired:
        print(f" ⏱ timeout")
        failed += 1
    except Exception as e:
        print(f" ❌ {e}")
        failed += 1
    
    # Rate limit: 10s tussen requests
    if i < len(recipes) - 1:
        time.sleep(10)

print(f"\n✅ Gegenereerd: {generated} | ⏭ Overgeslagen: {skipped} | ❌ Mislukt: {failed}")

# Update recipes.json met image paths
if generated > 0:
    print("\n📝 Recipes.json updaten met image paths...")
    for r in data["recipes"]:
        img_path = f"/recipes/{r['id']}.png"
        full_path = os.path.join(OUTPUT_DIR, f"{r['id']}.png")
        if os.path.exists(full_path):
            r["image"] = img_path
    
    with open(RECIPES_JSON, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("✅ recipes.json bijgewerkt")
    
    print("\n🚀 Commit en push...")
    os.system("cd $(dirname $RECIPES_JSON)/.. && git add public/recipes/ src/data/recipes.json && git commit --no-verify -m 'feat: AI-gegenereerde foodfoto voor alle recepten [pipeline]' && git push --no-verify")
PYEOF
