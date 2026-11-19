"""Rename industry portfolio images to carry a content hash and rewrite the
resolver in src/lib/industry-images.ts.

Next's image optimizer caches a rendition per URL, so replacing an image at the
same path leaves the stale copy in place until the server restarts. The hash in
the filename changes whenever the image does.

    python3 scripts/hash-industry-images.py
"""
import hashlib
import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES = os.path.join(ROOT, 'frontend/public/industries')
RESOLVER = os.path.join(ROOT, 'frontend/src/lib/industry-images.ts')

manifest = {}
for name in sorted(os.listdir(IMAGES)):
    if not name.endswith('.webp'):
        continue
    stem = re.sub(r'\.[0-9a-f]{8}$', '', name[:-5])
    path = os.path.join(IMAGES, name)
    digest = hashlib.sha1(open(path, 'rb').read()).hexdigest()[:8]
    target = os.path.join(IMAGES, f'{stem}.{digest}.webp')
    if path != target:
        shutil.move(path, target)
    manifest[stem] = digest

body = json.dumps(manifest, indent=2, sort_keys=True).replace('"', "'")
source = open(RESOLVER).read()
source = re.sub(
    r'const IMAGE_HASHES: Record<string, string> = \{.*?\};',
    f'const IMAGE_HASHES: Record<string, string> = {body};',
    source,
    flags=re.S,
)
open(RESOLVER, 'w').write(source)

print(f'{len(manifest)} industry images hashed; resolver updated.')
