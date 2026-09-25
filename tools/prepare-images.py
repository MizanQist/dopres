#!/usr/bin/env python3
"""Cut the client's renders into per-project galleries under public/projects/<slug>/.

Reads the spec below (which image goes to which project, plus crop boxes for
screenshots that stack two shots), trims black borders, resizes to 1600px max
and prints the resulting dimensions to paste into data/projects.ts.
Run from the project root:  python3 tools/prepare-images.py
"""
from PIL import Image
import numpy as np, os, json

SRC = os.path.expanduser("~/Desktop/Clients/Dopres ")  # note the trailing space in the folder name
OUT = "public/projects"

def trim(im, thr=14):
    a = np.asarray(im.convert("L"), dtype=np.float32)
    rows = np.where(a.mean(axis=1) >= thr)[0]; cols = np.where(a.mean(axis=0) >= thr)[0]
    if len(rows) == 0 or len(cols) == 0: return im
    return im.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1))

def stacked(name, split, gap=10, left=0):
    """Two shots stacked in one screenshot, separated at row `split`."""
    W, H = Image.open(os.path.join(SRC, name + ".jpg")).size
    return [(name, (left, 0, W, split - gap)), (name, (0, split + gap, W, H))]

# slug -> list of (source image, crop box or None)
SPEC = {
    "aviary-private-terminal": [("IMG_1409", None), ("IMG_1410", None), ("IMG_1411", None), ("IMG_1412", None)],
    "wave-house": stacked("IMG_1396", 762, left=70) + stacked("IMG_1397", 758),
    "timber-crescent": [("IMG_1391", None), ("IMG_1392", None), ("IMG_1393", None)],
    "arcade-residence": stacked("IMG_1398", 639, 14) + stacked("IMG_1399", 767, 16),
    "harbour-court": [("IMG_1386", None), ("IMG_1387", None), ("IMG_1388", None)],
    "veil-pavilion": [("IMG_1400", None), ("IMG_1401", None)],
    "screen-house": [("IMG_1389", None), ("IMG_1390", None)],
    "twin-court": [("IMG_1394", None), ("IMG_1395", None)],
    "stone-court": [("IMG_1402", None)],
    "verdant-rise": [("IMG_1403", None), ("IMG_1404", None)],
    "fin-house": [("IMG_1405", None), ("IMG_1406", None)],
    "crimson-row": [("IMG_1407", None), ("IMG_1408", None)],
}

if __name__ == "__main__":
    dims = {}
    for slug, imgs in SPEC.items():
        d = os.path.join(OUT, slug); os.makedirs(d, exist_ok=True)
        dims[slug] = []
        for i, (name, box) in enumerate(imgs, 1):
            im = Image.open(os.path.join(SRC, name + ".jpg")).convert("RGB")
            if box: im = im.crop(box)
            im = trim(im)
            if im.width > 1600: im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
            im.save(os.path.join(d, f"{i}.jpg"), quality=85, optimize=True, progressive=True)
            dims[slug].append(im.size)
    print(json.dumps(dims))
