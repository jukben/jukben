import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MIN_W, WIN_H, createApp } from '../src/app.js'
import { parseKeys } from '../src/terminal.js'

// Runs the app past the intro, pressing `input` along the way, and returns the screen text.
function run(input = '', { cols = 80, rows = 24, opts = {} } = {}) {
  const app = createApp({ cols, rows, opts })
  app.frame(3)
  parseKeys(input).forEach(app.key)
  app.frame(4)
  const text = Array.from({ length: app.scr.h }, (_, y) => app.scr.row(y)).join('\n')
  return { app, text }
}

test('home screen shows the tagline and every button', () => {
  const { text } = run()
  assert.match(text, /product engineer · prague/)
  for (const label of ['About', 'CV', 'Greetz', 'Contact', 'Quit']) assert.match(text, new RegExp(` ${label} `))
})

test('hotkeys open panels and any other key closes them', () => {
  assert.match(run('v').text, /CV\.NFO/)
  assert.match(run('g').text, /GREETZ\.NFO/)
  assert.match(run('c').text, /linkedin \.\.: linkedin\.com\/in\/jukben/)
  assert.doesNotMatch(run('vx').text, /CV\.NFO/)
})

test('arrow keys move focus and enter activates it', () => {
  assert.match(run('\x1b[C\r').text, /CV\.NFO/)
  // shift-tab from the first button wraps round to Quit
  assert.equal(run('\x1b[Z\r').app.st.quit, true)
})

test('panel scrolling is clamped to its content', () => {
  const { app } = run('v' + '\x1b[6~'.repeat(50))
  const max = app.st.panelScroll
  assert.ok(max > 0)
  parseKeys('\x1b[6~').forEach(app.key)
  assert.equal(app.st.panelScroll, max)
  parseKeys('\x1b[5~'.repeat(50)).forEach(app.key)
  assert.equal(app.st.panelScroll, 0)
})

test('q and esc quit', () => {
  assert.equal(run('q').app.st.quit, true)
  assert.equal(run('\x1b').app.st.quit, true)
  assert.equal(run('vq').app.st.quit, true)
})

test('a small terminal gets a size hint instead of the window', () => {
  const { text } = run('', { cols: MIN_W - 1, rows: WIN_H })
  assert.match(text, /terminal too small/)
})

test('a key during the intro skips it', () => {
  const app = createApp({ cols: 80, rows: 24 })
  app.frame(0.5)
  parseKeys(' ').forEach(app.key)
  app.frame(1)
  const text = Array.from({ length: app.scr.h }, (_, y) => app.scr.row(y)).join('\n')
  assert.match(text, /product engineer · prague/)
})

test('an unchanged frame flushes nothing but the sync markers', () => {
  const app = createApp({ cols: 80, rows: 24 })
  app.frame(3)
  app.st.bg = 'none'
  app.frame(3)
  assert.equal(app.frame(3), '\x1b[?2026h\x1b[?2026l')
})
