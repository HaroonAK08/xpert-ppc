/**
 * Local art for the industry portfolio tiles.
 *
 * Three images per industry, matching the three `portfolio` entries in
 * `industries.ts` in order. Filenames carry a content hash so replacing an
 * image changes its URL — otherwise Next's image optimizer keeps serving the
 * previously cached rendition at the same path.
 *
 * Regenerate after replacing a file with:
 *   python3 scripts/hash-industry-images.py
 */
const IMAGE_HASHES: Record<string, string> = {
  'dermatologists-1': 'ecf18578',
  'dermatologists-2': 'ec65b314',
  'dermatologists-3': '40ef87b9',
  'ecommerce-1': 'c8fa03e8',
  'ecommerce-2': '6f64035b',
  'ecommerce-3': '1058f602',
  'food-beverage-1': '1f7434b0',
  'food-beverage-2': '23bed73f',
  'food-beverage-3': 'bd8d751e',
  'healthcare-clinics-1': '8db2a2b5',
  'healthcare-clinics-2': 'c0287ec7',
  'healthcare-clinics-3': '6560d3c0',
  'law-firms-1': '0bc8c0f1',
  'law-firms-2': 'ba77fadc',
  'law-firms-3': 'd0cbbd83',
  'local-services-1': 'd00dc7fc',
  'local-services-2': '582ffbba',
  'local-services-3': 'd467a75b'
};

/**
 * Resolves `<slug>-<n>` to its hashed local file, falling back to the remote
 * URL held in the content file when no local image exists yet.
 */
export function industryImageSrc(slug: string, index: number, fallback: string) {
  const hash = IMAGE_HASHES[`${slug}-${index + 1}`];
  return hash ? `/industries/${slug}-${index + 1}.${hash}.webp` : fallback;
}
