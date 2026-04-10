/**
 * Classic 2D plasma intensity function.
 * Sum of four sine waves, normalized to [0, 1].
 * @param {number} x - column
 * @param {number} y - row
 * @param {number} t - time (scaled)
 * @returns {number} - value in [0, 1]
 */
export function intensity(x, y, t) {
  const v =
    Math.sin(x * 0.15 + t) +
    Math.sin(y * 0.12 + t * 0.8) +
    Math.sin((x + y) * 0.1 + t * 0.5) +
    Math.sin(Math.sqrt(x * x + y * y) * 0.12 + t)
  // v is in [-4, 4]; shift and scale to [0, 1]
  return (v + 4) / 8
}
