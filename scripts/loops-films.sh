#!/bin/bash
# Silent seamless loops for the film posters. Masters are the public YouTube
# uploads, downloaded to $FILMS (yt-dlp, 1080p). Same crossfade trick as loops.sh.
set -euo pipefail
cd "$(dirname "$0")/.."
FILMS="${FILMS:?set FILMS to the folder of downloaded masters}"
FADE=0.6

cut() { # name id start duration [maxrate] [pre-filter]
  local name="$1" src="$FILMS/$2.mp4" start="$3" dur="$4" rate="${5:-1800k}" pre="${6:-}"
  [ "${ONLY:-$name}" = "$name" ] || return 0
  local fc="[0:v]${pre}fps=25,scale=1280:-2:flags=lanczos,format=yuv420p,split[x][y];"
  fc+="[x]trim=${FADE}:$(echo "$dur+$FADE" | bc),setpts=PTS-STARTPTS[a];"
  fc+="[y]trim=0:${FADE},setpts=PTS-STARTPTS[b];"
  fc+="[a][b]xfade=transition=fade:duration=${FADE}:offset=$(echo "$dur-$FADE" | bc),format=yuv420p[v]"
  ffmpeg -v error -y -ss "$start" -t "$(echo "$dur+$FADE+0.2" | bc)" -i "$src" -an -filter_complex "$fc" -map '[v]' \
    -c:v libx264 -profile:v high -preset slow -crf 27 -maxrate "$rate" -bufsize 4M -movflags +faststart "public/video/$name.mp4"
  ffmpeg -v error -y -i "public/video/$name.mp4" -an -c:v libsvtav1 -preset 6 -crf 46 -svtav1-params tune=0 -movflags +faststart "public/video/$name.av1.mp4"
  ffmpeg -v error -y -ss 2 -i "public/video/$name.mp4" -frames:v 1 -f image2pipe -c:v png - | node scripts/still.mjs "public/img/$name.avif"
  ls -lh public/video/$name.mp4 public/video/$name.av1.mp4 public/img/$name.avif | awk '{print $5, $9}'
}
ONLY="${1:-}"; [ -n "$ONLY" ] || unset ONLY

cut grey       qfgRdrTVPxg 43.4 6
cut kodak      5pmQe0bnOyg 46.5 6
cut vfx        NntU6OS09BA 7.6  5
cut california o-zGjN61-NE 142 6 1800k 'crop=iw*0.72:ih:iw*0.14:0,'
cut westminster ZzeAs-jzUes 24.8 2.2
cut china      sMBT6y-thZk 0 6
