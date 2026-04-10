/**
 * Compute the visible slice of a scrolling marquee at the given offset.
 * Wraps around seamlessly and handles widths larger than the source text.
 * @param {string} text
 * @param {number} width
 * @param {number} offset
 * @returns {string}
 */
export function visibleScroller(text, width, offset) {
  const n = text.length
  if (n === 0 || width <= 0) return ''
  // Normalize negative offsets
  const start = ((offset % n) + n) % n
  let out = ''
  for (let i = 0; i < width; i++) {
    out += text[(start + i) % n]
  }
  return out
}
