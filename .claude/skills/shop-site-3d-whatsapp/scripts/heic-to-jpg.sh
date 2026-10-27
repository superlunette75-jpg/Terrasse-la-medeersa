#!/usr/bin/env bash
# Convert iPhone HEIC menu photos to JPG (ImageMagick here usually can't read HEIC).
# Usage: heic-to-jpg.sh <out_dir> <file.HEIC>...
# Writes <out_dir>/<name>.jpg plus 6 zoomed crops <name>_RC.jpg (rotated 90° if --rotate) for reading prices.
set -euo pipefail
OUT="$1"; shift
ROT=0; [ "${1:-}" = "--rotate" ] && { ROT=90; shift; }
VENV="${TMPDIR:-/tmp}/heic-venv"
[ -x "$VENV/bin/python" ] || { python3 -m venv "$VENV" && "$VENV/bin/pip" install -q pillow pillow-heif; }
mkdir -p "$OUT"
"$VENV/bin/python" -I - "$OUT" "$ROT" "$@" <<'PY'
import sys, os, pillow_heif
from PIL import Image
pillow_heif.register_heif_opener()
out, rot, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
for f in files:
    name = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert('RGB')
    if rot: im = im.rotate(rot, expand=True)
    w, h = im.size
    full = im.copy(); full.thumbnail((1800, 1800)); full.save(f'{out}/{name}.jpg', quality=88)
    for r in range(2):
        for c in range(3):
            box = (max(0, int(c*w/3)-100), max(0, int(r*h/2)-100), min(w, int((c+1)*w/3)+100), min(h, int((r+1)*h/2)+100))
            cr = im.crop(box); cr.thumbnail((1600, 1600)); cr.save(f'{out}/{name}_{r}{c}.jpg', quality=88)
    print('ok', name, im.size)
PY
