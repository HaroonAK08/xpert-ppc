"""Rename case-study covers to carry a content hash, and print the map to paste
into src/components/case-studies/case-study-cover.tsx.

Next's image optimizer caches a rendition per URL. Replacing a cover at the
same path leaves the stale rendition in place until the server restarts, so the
filename carries a hash of the contents and changes whenever the image does.

    python3 scripts/hash-case-study-covers.py
"""
import hashlib
import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COVERS = os.path.join(ROOT, 'frontend/public/case-studies/covers/optimized')
COMPONENT = os.path.join(
    ROOT, 'frontend/src/components/case-studies/case-study-cover.tsx'
)

manifest = {}
for name in sorted(os.listdir(COVERS)):
    if not name.endswith('.webp'):
        continue
    # strip any existing hash: slug.abcd1234.webp -> slug
    slug = re.sub(r'\.[0-9a-f]{8}$', '', name[:-5])
    path = os.path.join(COVERS, name)
    digest = hashlib.sha1(open(path, 'rb').read()).hexdigest()[:8]
    target = os.path.join(COVERS, f'{slug}.{digest}.webp')
    if path != target:
        shutil.move(path, target)
    manifest[slug] = digest

body = json.dumps(manifest, indent=2, sort_keys=True).replace('"', "'")
source = open(COMPONENT).read()
source = re.sub(
    r'const COVER_HASHES: Record<string, string> = \{.*?\};',
    f'const COVER_HASHES: Record<string, string> = {body};',
    source,
    flags=re.S,
)
open(COMPONENT, 'w').write(source)

print(f'{len(manifest)} covers hashed; component updated.')
