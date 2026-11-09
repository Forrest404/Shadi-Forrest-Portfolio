#!/bin/bash
# Cuts silent, seamlessly looping clips and posters from local masters.
# Usage: scripts/loops.sh            (all)   |   scripts/loops.sh landing   (one)
set -euo pipefail
cd "$(dirname "$0")/.."
SKI="$HOME/Desktop/showreel /Exports/Skiing final.mp4"
FADE=0.6

cut() { # name master start duration extra-filter maxrate width
  local name="$1" master="$2" start="$3" dur="$4" vf="$5" rate="${6:-2100k}" width="${7:-1280}"
  [ "${ONLY:-$name}" = "$name" ] || return 0
  # Body runs from FADE to dur+FADE, its tail crossfades into the head, so the
  # last frame lands exactly on the first frame and the loop has no visible jump.
  local fc="[0:v]${vf}fps=25,scale=${width}:-2:flags=lanczos,format=yuv420p,split[x][y];"
  fc+="[x]trim=${FADE}:$(echo "$dur+$FADE" | bc),setpts=PTS-STARTPTS[a];"
  fc+="[y]trim=0:${FADE},setpts=PTS-STARTPTS[b];"
  fc+="[a][b]xfade=transition=fade:duration=${FADE}:offset=$(echo "$dur-$FADE" | bc),format=yuv420p[v]"
  ffmpeg -v error -y -ss "$start" -t "$(echo "$dur+$FADE+0.2" | bc)" -i "$master" -an -filter_complex "$fc" -map '[v]' \
    -c:v libx264 -profile:v high -preset slow -crf 27 -maxrate "$rate" -bufsize 4M -movflags +faststart "public/video/$name.mp4"
  ffmpeg -v error -y -i "public/video/$name.mp4" -an -c:v libsvtav1 -preset 6 -crf 46 -svtav1-params tune=0 -movflags +faststart "public/video/$name.av1.mp4"
  ffmpeg -v error -y -i "public/video/$name.mp4" -frames:v 1 -f image2pipe -c:v png - \
    | node scripts/still.mjs "public/img/$name.avif"
  ls -lh public/video/$name.mp4 public/video/$name.av1.mp4 public/img/$name.avif | awk '{print $5, $9}'
}
ONLY="${1:-}"; [ -n "$ONLY" ] || unset ONLY

# The two biggest on screen get 1080p and a small colour lift so they hold their own against flat colour.
LIFT="eq=saturation=1.28:contrast=1.06,"
cut landing "$SKI" 38.6 6 "$LIFT" 3200k 1920
cut letters "$SKI" 45.5 7 "$LIFT" 3000k 1920
# POV shots carry the camera's watermark bottom-right: crop towards the top-left.
cut verbier "$SKI" 54 6 "crop=iw*0.86:ih*0.86:0:0,"

# Tiny version of the landing clip for the switch chip on the Tech page.
if [ "${ONLY:-chip}" = "chip" ]; then
  ffmpeg -v error -y -i public/video/landing.mp4 -an -vf "scale=320:-2:flags=lanczos,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf 30 -movflags +faststart public/video/chip.mp4
  ffmpeg -v error -y -i public/video/chip.mp4 -frames:v 1 -f image2pipe -c:v png - | node scripts/still.mjs public/img/chip.avif
  ls -lh public/video/chip.mp4 public/img/chip.avif | awk '{print $5, $9}'
fi
