#!/usr/bin/env bash
# Download generated images and convert them to trimmed, light WebP files.
# Usage: fetch-images.sh <urls.txt> <project>/public/drinks
#   urls.txt: one "<file-key> <https url>" per line, e.g. "brown-sugar https://.../hf_....png"
# The image called "hero" is exported larger (900x1120) for the hero section.
set -euo pipefail
LIST="$1"; DEST="$2"; TMP="$(mktemp -d)"
mkdir -p "$DEST"
while read -r key url; do
  [ -z "${key:-}" ] && continue
  curl -sS -o "$TMP/$key.png" "$url"
  size=640x800; [ "$key" = "hero" ] && size=900x1120
  convert "$TMP/$key.png" -trim +repage -resize "${size}>" -quality 80 -define webp:alpha-quality=90 "$DEST/$key.webp"
  echo "$key.webp $(du -k "$DEST/$key.webp" | cut -f1) KB"
done < "$LIST"
rm -rf "$TMP"
