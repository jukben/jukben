// Six-stop cyclic palette: magenta → purple → blue → cyan → teal → magenta
// Last stop equals the first so sample(1) wraps seamlessly.
export const PALETTE = [
  [255, 0, 255],   // magenta
  [180, 0, 255],   // purple
  [0, 64, 255],    // blue
  [0, 255, 255],   // cyan
  [0, 255, 180],   // teal
  [255, 0, 255],   // back to magenta
]

/**
 * Linearly interpolate between two rgb triples.
 * @param {[number, number, number]} a
 * @param {[number, number, number]} b
 * @param {number} t - 0..1
 */
export function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

/**
 * Map an intensity in [0, 1] to a color by stepping through the palette stops.
 * @param {number} intensity - 0..1
 */
export function sample(intensity) {
  const stops = PALETTE.length - 1
  const scaled = Math.max(0, Math.min(1, intensity)) * stops
  const idx = Math.min(Math.floor(scaled), stops - 1)
  const t = scaled - idx
  return lerp(PALETTE[idx], PALETTE[idx + 1], t)
}
