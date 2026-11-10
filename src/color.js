// Colors are packed 0xRRGGBB ints; -1 means "keep what's there".
const byte = (v) => Math.max(0, Math.min(255, Math.round(v)))
export const rgb = (r, g, b) => (byte(r) << 16) | (byte(g) << 8) | byte(b)
export const R = (c) => (c >> 16) & 255
export const G = (c) => (c >> 8) & 255
export const B = (c) => c & 255
export const hex = (s) => parseInt(s.slice(1), 16)
export const mix = (a, b, t) => rgb(R(a) + (R(b) - R(a)) * t, G(a) + (G(b) - G(a)) * t, B(a) + (B(b) - B(a)) * t)
export const scale = (c, k) => rgb(R(c) * k, G(c) * k, B(c) * k)
export const fgSeq = (c) => `\x1b[38;2;${R(c)};${G(c)};${B(c)}m`
export const bgSeq = (c) => `\x1b[48;2;${R(c)};${G(c)};${B(c)}m`

export function hsv(h, s, v) {
  h = ((h % 360) + 360) % 360
  const f = (n) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return rgb(f(5) * 255, f(3) * 255, f(1) * 255)
}

// Cyclic gradient through `stops`; t wraps at 1.
export function ramp(stops, t) {
  t = ((t % 1) + 1) % 1
  const s = t * (stops.length - 1)
  const i = Math.floor(s)
  return mix(stops[i], stops[Math.min(i + 1, stops.length - 1)], s - i)
}

export const BLACK = 0x000000
export const WHITE = 0xffffff
export const SCREEN_BG = hex('#000006')
export const WIN_BG = hex('#0b0918')
export const PANEL_BG = hex('#06050d')
export const TEXT = hex('#c8c8e8')
export const BRIGHT = hex('#d8d8f0')
export const DIM = hex('#8a88b8')
export const LABEL = hex('#6a8ad0')
export const LEADER = hex('#3a3866')
export const CYAN = hex('#40e0ff')
export const GOLD = hex('#ffd000')
export const GREETZ = hex('#e0c8f0')
export const SCAN_DIM = hex('#24224a')
export const CAPTION = ['#000080', '#1084d0'].map(hex)
export const SILVER = hex('#c0c0c0')
export const BUTTON_BG = hex('#1c1a34')
export const HOT_FOCUSED = hex('#a00030')
export const LOGO_SHADOW = hex('#3a0850')
export const STAR_COLORS = ['#26264a', '#5a5aa0', '#8080c0'].map(hex)
export const VU_NOTE = hex('#ff60c0')
export const VU_TITLE = hex('#9a98c8')
export const VU_POS = hex('#5a5890')
export const VU_COLORS = ['#20e070', '#a0f040', '#ffd000', '#ff3040'].map(hex)
export const COPPER = ['#4a0c00', '#c03000', '#ff8000', '#ffd040', '#fff8c0', '#ffd040', '#ff8000', '#c03000', '#4a0c00'].map(hex)
// 80s chrome: sky on top, horizon band, ground reflection below
export const CHROME = ['#ffffff', '#e6efff', '#bcd2ff', '#8aa8f0', '#5a6ad0', '#8a3a9a', '#d0502a', '#ff8a20', '#ffc040', '#fff0a0'].map(hex)
export const BARS = ['#ff2060', '#20a0ff', '#a040ff'].map(hex)
// Last stop repeats the first so the cycle is seamless; dimmed so the window stays readable on top.
const PLASMA_STOPS = ['#ff00ff', '#b400ff', '#0040ff', '#00ffff', '#00ffb4', '#ff00ff'].map(hex)
export const PLASMA = Array.from({ length: 64 }, (_, i) => scale(ramp(PLASMA_STOPS, i / 63), 0.32))
