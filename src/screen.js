import { WHITE, bgSeq, fgSeq } from './color.js'

// Cell framebuffer; flush() emits only cells that changed since the previous flush.
export class Screen {
  resize(w, h) {
    this.w = w
    this.h = h
    const n = w * h
    this.ch = new Array(n).fill(' ')
    this.fg = new Int32Array(n)
    this.bg = new Int32Array(n)
    this.pch = new Array(n).fill(null)
    this.pfg = new Int32Array(n).fill(-2)
    this.pbg = new Int32Array(n).fill(-2)
    this.clip = null
  }
  clear(bg) {
    this.ch.fill(' ')
    this.fg.fill(WHITE)
    this.bg.fill(bg)
  }
  set(x, y, ch, fg = -1, bg = -1) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return
    const c = this.clip
    if (c && (x < c.x0 || x > c.x1 || y < c.y0 || y > c.y1)) return
    const i = y * this.w + x
    this.ch[i] = ch
    if (fg >= 0) this.fg[i] = fg
    if (bg >= 0) this.bg[i] = bg
  }
  text(x, y, str, fg = -1, bg = -1) {
    for (const c of str) this.set(x++, y, c, fg, bg)
    return x
  }
  // Draws [text, fg] runs back to back; returns the x after the last one.
  runs(x, y, runs) {
    for (const [str, fg] of runs) x = this.text(x, y, str, fg)
    return x
  }
  fill(x, y, w, h, bg) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, ' ', -1, bg)
  }
  // Pixel buffer (w × 2h, -1 = transparent) composited via half blocks.
  pixels(x0, y0, w, ph, px) {
    for (let cy = 0; cy < ph / 2; cy++) {
      for (let cx = 0; cx < w; cx++) {
        const top = px[2 * cy * w + cx]
        const bot = px[(2 * cy + 1) * w + cx]
        if (top < 0 && bot < 0) continue
        if (top < 0) this.set(x0 + cx, y0 + cy, '▄', bot)
        else if (bot < 0) this.set(x0 + cx, y0 + cy, '▀', top)
        else if (top === bot) this.set(x0 + cx, y0 + cy, ' ', -1, top)
        else this.set(x0 + cx, y0 + cy, '▀', top, bot)
      }
    }
  }
  postprocess(fn) {
    for (let i = 0; i < this.fg.length; i++) {
      this.fg[i] = fn(this.fg[i])
      this.bg[i] = fn(this.bg[i])
    }
  }
  // Plain text of one row, for tests.
  row(y) {
    return this.ch.slice(y * this.w, (y + 1) * this.w).join('')
  }
  flush() {
    // DEC 2026 synchronized output: terminals that support it present the frame atomically.
    let out = '\x1b[?2026h'
    let cfg = -2
    let cbg = -2
    let cx = -1
    let cy = -1
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const i = y * this.w + x
        const ch = this.ch[i]
        const fg = ch === ' ' ? -1 : this.fg[i]
        const bg = this.bg[i]
        if (ch === this.pch[i] && fg === this.pfg[i] && bg === this.pbg[i]) continue
        if (cy !== y || cx !== x) out += `\x1b[${y + 1};${x + 1}H`
        if (bg !== cbg) out += bgSeq((cbg = bg))
        if (fg >= 0 && fg !== cfg) out += fgSeq((cfg = fg))
        out += ch
        cx = x + 1
        cy = y
        this.pch[i] = ch
        this.pfg[i] = fg
        this.pbg[i] = bg
      }
    }
    return out + '\x1b[?2026l'
  }
}
