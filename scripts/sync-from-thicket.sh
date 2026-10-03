#!/usr/bin/env bash
# Copies the pieces of thicket's design system this site draws with, from a
# thicket checkout (default: ../thicket), so the site can't drift from the app.
#
#   scripts/sync-from-thicket.sh [path-to-thicket]
#
# These files are owned by thicket. Change them there, then run this. The
# site's own files (src/lib/api.ts, the landing page, its picture and the
# cards it draws) are not in this list and are never overwritten.
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"
thicket="$(cd "${1:-$here/../thicket}" && pwd)"
from="$thicket/packages/web/src"
to="$here/src"

files=(
  app.css
  app.html
  lib/focus.svelte.ts
  lib/orphans.ts
  lib/time.ts
  lib/components/Button.svelte
  lib/components/Card.svelte
  lib/components/CardMeta.svelte
  lib/components/Field.svelte
  lib/components/Icon.svelte
  lib/components/IconButton.svelte
  lib/components/Input.svelte
  lib/components/Monogram.svelte
  lib/components/SourceIcon.svelte
  lib/components/Wordmark.svelte
)

for f in "${files[@]}"; do
  mkdir -p "$(dirname "$to/$f")"
  cp "$from/$f" "$to/$f"
done

echo "Copied ${#files[@]} files from $thicket at $(git -C "$thicket" rev-parse --short HEAD)."
