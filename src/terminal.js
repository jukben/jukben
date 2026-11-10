import { COPPER, LABEL, fgSeq, ramp } from './color.js'
import { createApp } from './app.js'
import { CONTACT } from './content.js'
import { dotted } from './text.js'

const CSI_KEYS = { A: 'up', B: 'down', C: 'right', D: 'left', Z: 'shift-tab' }
const TILDE_KEYS = { 5: 'pgup', 6: 'pgdn' }

// Raw-mode stdin chunk → [{ name, ch? }]
export function parseKeys(d) {
  const keys = []
  for (let i = 0; i < d.length; ) {
    const c = d[i]
    if (c === '\x1b') {
      const m = /^\x1b(\[|O)([0-9;]*)([A-Za-z~])/.exec(d.slice(i))
      if (m) {
        const name = m[3] === '~' ? TILDE_KEYS[m[2]] : CSI_KEYS[m[3]]
        keys.push({ name: name || 'unknown' })
        i += m[0].length
        continue
      }
      keys.push({ name: 'esc' })
    } else if (c === '\r' || c === '\n') keys.push({ name: 'enter' })
    else if (c === '\t') keys.push({ name: 'tab' })
    else if (c === '\x03') keys.push({ name: 'ctrl-c' })
    else if (c >= ' ') keys.push({ name: 'char', ch: c })
    i++
  }
  return keys
}

const CARD_W = 46

// Printed on exit, and instead of the demo when there's no interactive terminal.
export function card(color) {
  const paint = (s, c) => (color ? fgSeq(c) + s + '\x1b[0m' : s)
  const link = (url, text) => (color ? `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\` : text)
  const bar = (ch) =>
    color ? [...ch.repeat(CARD_W)].map((c, i) => fgSeq(ramp(COPPER, i / CARD_W)) + c).join('') + '\x1b[0m' : ch.repeat(CARD_W)
  return (
    [
      '',
      ' ' + bar('▄'),
      '   jukben.v2.0 · thanks for stopping by',
      ...CONTACT.map((c) => `   ${paint(dotted(c.label), LABEL)} ${link(c.url, c.text)}`),
      ' ' + bar('▀'),
      '   -= keep on sceneing =-',
      '',
    ].join('\n') + '\n'
  )
}

export function main(args = process.argv.slice(2)) {
  const out = process.stdout
  const inp = process.stdin
  const color = !process.env.NO_COLOR
  if (!out.isTTY || !inp.isTTY || args.includes('--plain')) {
    out.write(card(color && out.isTTY))
    return
  }

  const app = createApp({ cols: out.columns, rows: out.rows, opts: { plasma: args.includes('--plasma') } })
  const showStats = args.includes('--stats')

  let restored = false
  const restore = () => {
    if (restored) return
    restored = true
    out.write('\x1b[0m\x1b[?25h\x1b[?1049l')
    try {
      inp.setRawMode(false)
    } catch {}
  }
  process.on('exit', restore)
  for (const sig of ['SIGTERM', 'SIGHUP']) process.on(sig, () => process.exit(0))
  process.on('uncaughtException', (e) => {
    restore()
    console.error(e)
    process.exit(1)
  })

  out.write('\x1b[?1049h\x1b[?25l\x1b[2J')
  inp.setRawMode(true)
  inp.setEncoding('utf8')
  inp.resume()
  inp.on('data', (d) => parseKeys(d).forEach(app.key))
  out.on('resize', () => {
    app.resize(out.columns, out.rows)
    out.write('\x1b[0m\x1b[2J')
  })

  const t0 = performance.now()
  let bytes = 0
  let frames = 0
  let windowStart = t0
  const timer = setInterval(() => {
    const now = performance.now()
    const s = app.frame((now - t0) / 1000)
    out.write(s)
    if (showStats) {
      bytes += Buffer.byteLength(s)
      frames++
      if (now - windowStart > 1000) {
        const secs = (now - windowStart) / 1000
        app.st.stats = `${(frames / secs).toFixed(0)} fps · ${(bytes / frames / 1024).toFixed(1)} KB/frame · ${(bytes / secs / 1024).toFixed(0)} KB/s`
        bytes = frames = 0
        windowStart = now
      }
    }
    if (app.st.quit) {
      clearInterval(timer)
      restore()
      out.write(card(color))
      process.exit(0)
    }
  }, 33)
}
