import { LOGO_PH, LOGO_PIXELS, LOGO_W, TRACKS, VU_CHARS, plasma, rasterBars } from './art.js'
import {
  BLACK,
  BRIGHT,
  BUTTON_BG,
  CAPTION,
  CHROME,
  COPPER,
  CYAN,
  DIM,
  GOLD,
  HOT_FOCUSED,
  LOGO_SHADOW,
  PANEL_BG,
  PLASMA,
  SCAN_DIM,
  SCREEN_BG,
  SILVER,
  STAR_COLORS,
  TEXT,
  VU_COLORS,
  VU_NOTE,
  VU_POS,
  VU_TITLE,
  WHITE,
  WIN_BG,
  hsv,
  mix,
  ramp,
  scale,
} from './color.js'
import { BUTTONS, HOME, PANELS, ROLE, SCROLL_TEXT } from './content.js'
import { Screen } from './screen.js'
import { styledLine, wrap } from './text.js'

const INTRO_LEN = 2.3
export const MIN_W = 68
const MAX_W = 84
export const WIN_H = 22
// Window rows, from its top edge. Row 0 is the caption, row WIN_H-1 the bottom border.
const ROW = { logo: 1, tag: 7, scan: 8, home: 10, buttons: 17, scan2: 19, scroller: 20 }
// Panels cover tagline → second scanner; text rows exclude the frame.
const PANEL_H = ROW.scan2 - ROW.tag + 1
const PANEL_ROWS = PANEL_H - 2

const TAGLINE = [['-=[ ', CYAN], [ROLE, TEXT], [' ]=-', CYAN]]
const HOME_RUNS = HOME.map((line) => styledLine(line, BRIGHT))
const STAR_SPEED = [1.5, 4, 10]
const STAR_CHARS = ['.', '·', '+']

const center = (x0, w, len) => x0 + Math.floor((w - len) / 2)
const runsWidth = (runs) => runs.reduce((n, [str]) => n + str.length, 0)

// opts: { plasma?: boolean }
export function createApp({ cols, rows, opts = {} }) {
  const scr = new Screen()
  const st = {
    t: 0,
    mainStart: INTRO_LEN,
    flash: true, // white flash as the window opens; dropped when the intro is skipped
    btn: 0,
    panel: null,
    panelScroll: 0,
    bg: opts.plasma ? 'plasma' : 'stars',
    quit: false,
    stats: null,
  }
  let stars = []
  let plasmaPx = null
  let wrapped = { key: null, lines: [] }

  function resize(c, r) {
    scr.resize(c, r)
    stars = Array.from({ length: Math.floor((c * r) / 16) }, () => {
      const z = Math.random() < 0.6 ? 0 : Math.random() < 0.7 ? 1 : 2
      return { x: Math.random() * c, y: Math.floor(Math.random() * r), z, ph: Math.random() * 6.28 }
    })
  }
  resize(cols, rows)

  function windowRect() {
    const w = Math.min(scr.w - 2, MAX_W)
    return { x: Math.floor((scr.w - w) / 2), y: Math.floor((scr.h - WIN_H) / 2), w }
  }

  function panelLines() {
    const width = windowRect().w - 8 // window inner width minus panel frame and padding
    const key = `${st.panel}:${width}`
    if (wrapped.key !== key) wrapped = { key, lines: PANELS[st.panel].lines.flatMap((l) => wrap(l, width)) }
    return wrapped.lines
  }

  function scrollPanel(delta) {
    st.panelScroll = Math.max(0, Math.min(st.panelScroll + delta, panelLines().length - PANEL_ROWS))
  }

  // ── background ──
  function drawStars(t, fade) {
    for (const s of stars) {
      const x = Math.floor((((s.x - t * STAR_SPEED[s.z]) % scr.w) + scr.w) % scr.w)
      const c = s.z < 2 ? STAR_COLORS[s.z] : mix(STAR_COLORS[2], WHITE, 0.5 + 0.5 * Math.sin(t * 4 + s.ph))
      scr.set(x, s.y, STAR_CHARS[s.z], scale(c, fade))
    }
  }

  function drawPlasma(t) {
    const w = scr.w
    const ph = scr.h * 2
    if (plasmaPx?.length !== w * ph) plasmaPx = new Int32Array(w * ph)
    for (let y = 0; y < ph; y++)
      for (let x = 0; x < w; x++) plasmaPx[y * w + x] = PLASMA[Math.round(plasma(x, y, t * 1.3) * (PLASMA.length - 1))]
    scr.pixels(0, 0, w, ph, plasmaPx)
  }

  // ── window parts ──
  // Animated copper half-block frame; the gradient walks clockwise round the perimeter.
  function drawCopperFrame(x, y, w, h, t, { top = true } = {}) {
    const at = (p) => ramp(COPPER, p * 0.012 - t * 0.3)
    const right = x + w - 1
    const bottom = y + h - 1
    if (top) {
      for (let i = 1; i < w - 1; i++) scr.set(x + i, y, '▄', at(i))
      scr.set(x, y, '▗', at(0))
      scr.set(right, y, '▖', at(w))
    }
    for (let j = 1; j < h - 1; j++) {
      scr.set(right, y + j, '▌', at(w + j))
      scr.set(x, y + j, '▐', at(2 * w + 2 * h - j))
    }
    for (let i = 1; i < w - 1; i++) scr.set(x + i, bottom, '▀', at(2 * w + h - i))
    scr.set(right, bottom, '▘', at(w + h))
    scr.set(x, bottom, '▝', at(2 * w + h))
  }

  // Win98-style active caption bar
  function drawCaption(x0, y, w) {
    for (let i = 0; i < w; i++) scr.set(x0 + i, y, ' ', -1, mix(CAPTION[0], CAPTION[1], i / w))
    scr.text(x0 + 1, y, ' ░ jukben.v2.0 [JKB]', WHITE)
    for (const [k, c] of [[11, '_'], [7, '□'], [3, 'x']]) scr.text(x0 + w - k, y, ` ${c} `, BLACK, SILVER)
  }

  function drawLogo(x0, y0, w, t) {
    const px = new Int32Array(w * LOGO_PH).fill(-1)
    rasterBars(px, w, t)
    const put = (x, y, c) => {
      if (x >= 0 && x < w && y >= 0 && y < LOGO_PH) px[y * w + x] = c
    }
    const lx = Math.floor((w - LOGO_W) / 2)
    const shine = ((t * 0.45) % 1.8) * (LOGO_W + 24) - 12
    // Per terminal row, not per half-row pixel, or the two halves of a cell tear apart.
    const wobble = (gy) => Math.round(Math.sin(Math.floor((gy + 1) / 2) * 0.9 + t * 2.4) * 1.2)
    for (const p of LOGO_PIXELS) put(lx + p.x + wobble(p.y) + 1, p.y + 2, LOGO_SHADOW)
    for (const p of LOGO_PIXELS) {
      const X = lx + p.x + wobble(p.y)
      const Y = p.y + 1
      const d = X - Y * 0.6 - shine
      put(X, Y, d >= 0 && d < 3 ? mix(CHROME[p.y], WHITE, 0.85 - d * 0.25) : CHROME[p.y])
    }
    scr.pixels(x0, y0, w, LOGO_PH, px)
  }

  function drawScanner(x0, y, w, t) {
    const head = (t * 45) % (w + 20)
    for (let i = 0; i < w; i++) {
      const d = head - i
      const k = d >= 0 && d < 20 ? 1 - d / 20 : 0
      scr.set(x0 + i, y, '─', mix(SCAN_DIM, CYAN, k * k))
    }
  }

  function drawScroller(x0, y, w, t) {
    const base = Math.floor(t * 14)
    const n = SCROLL_TEXT.length
    const edge = 10
    for (let x = 0; x < w; x++) {
      const c = SCROLL_TEXT[(base + x) % n]
      if (c === ' ') continue
      const fade = Math.min(1, (x + 1) / edge, (w - x) / edge)
      scr.set(x0 + x, y, c, mix(WIN_BG, hsv(200 + x * 1.5 + t * 30, 0.45, 1), fade))
    }
  }

  function drawVU(x, y, t) {
    const step = t * (128 / 60) * 4
    const row = Math.floor(step) % 64
    const pat = Math.floor(step / 64) % 16
    const pos = ` ${String(pat).padStart(2, '0')}:${row.toString(16).toUpperCase().padStart(2, '0')}`
    scr.runs(x, y, [['♫ ', VU_NOTE], ['prgnight.xm', VU_TITLE], [pos, VU_POS]])
    TRACKS.forEach((tr, ch) => {
      let level = 0
      for (let back = 0; back < 8; back++) {
        const s = Math.floor(step) - back
        if (tr.p[((s % 16) + 16) % 16] === 'x') {
          level = tr.amp * Math.exp(-(step - s) * tr.decay)
          break
        }
      }
      level = Math.max(0, Math.min(1, Math.sqrt(level) + 0.06 * Math.sin(t * 37 + ch * 7)))
      const h = Math.round(level * 32)
      for (let r = 0; r < 4; r++) {
        const f = Math.max(0, Math.min(8, h - r * 8))
        for (let k = 0; k < 2; k++) scr.set(x + ch * 3 + k, y + 4 - r, VU_CHARS[f], VU_COLORS[r])
      }
    })
  }

  function drawButtons(x0, y, w) {
    const total = BUTTONS.reduce((n, b) => n + b.label.length + 3, -1)
    let bx = center(x0, w, total)
    BUTTONS.forEach((b, i) => {
      const focused = st.btn === i
      const bg = focused ? CYAN : BUTTON_BG
      const fg = focused ? BLACK : TEXT
      const hot = focused ? HOT_FOCUSED : GOLD
      scr.set(bx++, y, ' ', -1, bg)
      for (let k = 0; k < b.label.length; k++) scr.set(bx++, y, b.label[k], k === b.hot ? hot : fg, bg)
      scr.set(bx++, y, ' ', -1, bg)
      bx++
    })
  }

  function drawPanel(x, y, w, h, t) {
    const p = PANELS[st.panel]
    scr.fill(x + 1, y + 1, w - 2, h - 2, PANEL_BG)
    drawCopperFrame(x, y, w, h, t)
    const title = ` ░▒▓ ${p.title} ▓▒░ `
    scr.text(center(x, w, title.length), y, title, WHITE, WIN_BG)

    const hint = ' ↑↓ scroll · any key back '
    scr.text(x + w - hint.length - 2, y + h - 1, hint, DIM, WIN_BG)

    const lines = panelLines()
    const start = Math.min(st.panelScroll, Math.max(0, lines.length - PANEL_ROWS))
    for (let j = 0; j < PANEL_ROWS && start + j < lines.length; j++) {
      scr.runs(x + 3, y + 1 + j, styledLine(lines[start + j], p.color))
    }
    if (start > 0) scr.set(x + w - 3, y + 1, '▲', CYAN)
    if (start + PANEL_ROWS < lines.length) scr.set(x + w - 3, y + h - 2, '▼', CYAN)
  }

  function drawWindow(t, reveal) {
    const { x: x0, y: y0, w: W } = windowRect()
    const ix = x0 + 1
    const iw = W - 2

    const half = Math.ceil((WIN_H / 2) * reveal)
    const cy = y0 + Math.floor(WIN_H / 2)
    scr.clip = { x0: 0, x1: scr.w - 1, y0: cy - half, y1: cy + half }

    scr.fill(ix, y0 + 1, iw, WIN_H - 2, WIN_BG)
    drawCopperFrame(x0, y0, W, WIN_H, t, { top: false })
    drawCaption(x0, y0, W)

    drawLogo(ix, y0 + ROW.logo, iw, t)
    scr.runs(center(ix, iw, runsWidth(TAGLINE)), y0 + ROW.tag, TAGLINE)
    drawScanner(ix, y0 + ROW.scan, iw, t)

    HOME_RUNS.forEach((runs, i) => scr.runs(ix + 3, y0 + ROW.home + i, runs))
    drawVU(ix + iw - 20, y0 + ROW.home, t)
    drawButtons(ix, y0 + ROW.buttons, iw)

    drawScanner(ix, y0 + ROW.scan2, iw, t + 1.3)
    drawScroller(ix, y0 + ROW.scroller, iw, t)

    if (st.panel) drawPanel(ix, y0 + ROW.tag, iw, PANEL_H, t)
    scr.clip = null
  }

  function drawIntro(t) {
    const cx = Math.floor(scr.w / 2)
    const cy = Math.floor(scr.h / 2)
    const type = (str, y, from, fg) => {
      const n = Math.max(0, Math.min(str.length, Math.floor((t - from) / 0.06)))
      const x = cx - Math.floor(str.length / 2)
      scr.text(x, y, str.slice(0, n), fg)
      if (t > from && Math.floor(t * 6) % 2 === 0) scr.set(x + n, y, '█', fg)
    }
    type('J U K B E N', cy - 1, 0.4, WHITE)
    type('p r e s e n t s', cy + 1, 1.2, DIM)
  }

  // Renders time `t` (seconds) and returns the escape sequence that updates the terminal.
  function frame(t) {
    st.t = t
    scr.clear(SCREEN_BG)
    if (st.bg === 'plasma') drawPlasma(t)
    else drawStars(t, Math.min(1, t / 0.8))

    if (scr.w < MIN_W || scr.h < WIN_H) {
      const msg = `terminal too small · need ${MIN_W}×${WIN_H} · have ${scr.w}×${scr.h}`
      scr.text(Math.max(0, center(0, scr.w, msg.length)), Math.floor(scr.h / 2), msg, WHITE)
    } else if (t < st.mainStart) {
      drawIntro(t)
    } else {
      const r = Math.min(1, (t - st.mainStart) / 0.4)
      drawWindow(t, 1 - Math.pow(1 - r, 3))
    }

    if (st.stats) scr.text(0, scr.h - 1, ` ${st.stats} `, DIM, BLACK)

    if (st.flash) {
      const f = 1 - (t - st.mainStart) / 0.35
      if (f > 0 && f <= 1) scr.postprocess((c) => mix(c, WHITE, f))
    }
    return scr.flush()
  }

  function activate(action) {
    if (action === 'quit') st.quit = true
    else {
      st.panel = action
      st.panelScroll = 0
    }
  }

  function key(k) {
    if (k.name === 'ctrl-c') {
      st.quit = true
      return
    }
    if (st.t < st.mainStart) {
      st.mainStart = st.t
      st.flash = false
      return
    }
    const c = k.ch?.toLowerCase()
    if (st.panel) {
      if (k.name === 'up' || c === 'k') scrollPanel(-1)
      else if (k.name === 'down' || c === 'j') scrollPanel(1)
      else if (k.name === 'pgup') scrollPanel(-5)
      else if (k.name === 'pgdn') scrollPanel(5)
      else if (c === 'q') st.quit = true
      else st.panel = null
      return
    }
    if (k.name === 'left' || k.name === 'shift-tab') st.btn = (st.btn + BUTTONS.length - 1) % BUTTONS.length
    else if (k.name === 'right' || k.name === 'tab') st.btn = (st.btn + 1) % BUTTONS.length
    else if (k.name === 'enter') activate(BUTTONS[st.btn].action)
    else if (k.name === 'esc') st.quit = true
    else if (c) {
      if (c === 'f') st.bg = st.bg === 'stars' ? 'plasma' : 'stars'
      const i = BUTTONS.findIndex((b) => b.label[b.hot].toLowerCase() === c)
      if (i >= 0) {
        st.btn = i
        activate(BUTTONS[i].action)
      }
    }
  }

  return { scr, st, resize, frame, key }
}
