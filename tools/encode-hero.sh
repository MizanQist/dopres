#!/usr/bin/env bash
# Re-encode public/hero.mp4 into all-keyframe, content-hashed hero media and point data/site.ts at it.
# Usage: tools/encode-hero.sh [width] [crf]   (defaults: 1280 33)
set -euo pipefail
cd "$(dirname "$0")/.."
W=${1:-1280}; CRF=${2:-33}
mkdir -p public/media
ffmpeg -y -hide_banner -loglevel error -i public/hero.mp4 -an -vf "scale=${W}:-2" -c:v libx264 -g 1 -keyint_min 1 -pix_fmt yuv420p -profile:v high -preset slow -crf "$CRF" -movflags +faststart /tmp/hero-scrub.mp4
ffmpeg -y -hide_banner -loglevel error -i public/hero.mp4 -an -vf "scale=${W}:-2" -c:v libvpx-vp9 -g 1 -keyint_min 1 -crf $((CRF + 9)) -b:v 0 -pix_fmt yuv420p -row-mt 1 -deadline good -cpu-used 2 /tmp/hero-scrub.webm
ffmpeg -y -hide_banner -loglevel error -i public/hero.mp4 -frames:v 1 -update 1 -q:v 2 /tmp/hero-poster.jpg
rm -f public/media/hero-*
for f in hero-scrub.mp4 hero-scrub.webm hero-poster.jpg; do
  h=$(md5 -q "/tmp/$f" 2>/dev/null || md5sum "/tmp/$f" | cut -c1-32); h=${h:0:8}
  name="${f%.*}.$h.${f##*.}"
  cp "/tmp/$f" "public/media/$name"
  case $f in
    hero-scrub.mp4)  sed -i.bak -E "s|HERO_MP4 = \".*\"|HERO_MP4 = \"/media/$name\"|" data/site.ts ;;
    hero-scrub.webm) sed -i.bak -E "s|HERO_WEBM = \".*\"|HERO_WEBM = \"/media/$name\"|" data/site.ts ;;
    hero-poster.jpg) sed -i.bak -E "s|HERO_POSTER = \".*\"|HERO_POSTER = \"/media/$name\"|" data/site.ts ;;
  esac
done
rm -f data/site.ts.bak
ls -l public/media
