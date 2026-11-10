import { BARS, scale } from './color.js'

const FONT = {
  J: ['...#####', '...#####', '.....##.', '.....##.', '.....##.', '.....##.', '##...##.', '##...##.', '.#####..', '..###...'],
  U: ['##....##', '##....##', '##....##', '##....##', '##....##', '##....##', '##....##', '##....##', '.######.', '..####..'],
  K: ['##....##', '##...##.', '##..##..', '##.##...', '####....', '#####...', '##.##...', '##..##..', '##...##.', '##....##'],
  B: ['######..', '#######.', '##...##.', '##...##.', '######..', '#######.', '##....##', '##....##', '#######.', '######..'],
  E: ['########', '########', '##......', '##......', '######..', '######..', '##......', '##......', '########', '########'],
  N: ['##....##', '###...##', '####..##', '##.##.##', '##.##.##', '##..####', '##..####', '##...###', '##....##', '##....##'],
}
const GLYPH_W = 8
const GLYPH_GAP = 2
const LOGO_WORD = 'JUKBEN'

export const LOGO_W = LOGO_WORD.length * (GLYPH_W + GLYPH_GAP) - GLYPH_GAP
export const LOGO_PH = 12 // pixel rows: 1 margin + 10 glyph + 1 shadow
export const LOGO_PIXELS = [...LOGO_WORD].flatMap((letter, li) =>
  FONT[letter].flatMap((row, gy) =>
    [...row].flatMap((cell, gx) => (cell === '#' ? [{ x: li * (GLYPH_W + GLYPH_GAP) + gx, y: gy }] : [])),
  ),
)

// Three copper bars orbiting behind the logo; far ones are dimmer and drawn first.
export function rasterBars(px, w, t) {
  const bars = BARS.map((c, k) => {
    const a = t * 1.6 + k * 2.094
    return { c, y: 5.5 + Math.sin(a) * 4.5, z: Math.cos(a) }
  }).sort((a, b) => a.z - b.z)
  for (const b of bars)
    for (let py = 0; py < LOGO_PH; py++) {
      const d = Math.abs(py - b.y)
      if (d >= 1.8) continue
      px.fill(scale(b.c, (0.12 + 0.16 * (b.z + 1)) * (0.35 + 0.65 * (1 - d / 1.8))), py * w, (py + 1) * w)
    }
}

// Classic four-sine plasma, normalized to [0, 1].
export function plasma(x, y, t) {
  const v =
    Math.sin(x * 0.15 + t) +
    Math.sin(y * 0.12 + t * 0.8) +
    Math.sin((x + y) * 0.1 + t * 0.5) +
    Math.sin(Math.sqrt(x * x + y * y) * 0.12 + t)
  return (v + 4) / 8
}

// 16-step patterns for the fake tracker; each channel decays at its own rate.
export const TRACKS = [
  { p: 'x...x...x...x...', decay: 0.9, amp: 1.0 },
  { p: '....x.......x..x', decay: 0.8, amp: 0.85 },
  { p: 'x.x.x.x.x.x.x.xx', decay: 1.8, amp: 0.6 },
  { p: 'x..x..x.x..x..x.', decay: 0.6, amp: 0.8 },
  { p: 'x...x.x...x.xx..', decay: 0.5, amp: 0.75 },
  { p: 'x.......x.......', decay: 0.25, amp: 0.7 },
]
export const VU_CHARS = ' ▁▂▃▄▅▆▇█'
