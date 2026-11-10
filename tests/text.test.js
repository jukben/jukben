import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ramp, rgb } from '../src/color.js'
import { card, parseKeys } from '../src/terminal.js'
import { styledLine, wrap } from '../src/text.js'

test('wrap hangs continuation lines under the bullet text', () => {
  assert.deepEqual(wrap(' · one two three', 10), [' · one two', '   three'])
  assert.deepEqual(wrap('short', 10), ['short'])
})

test('styledLine splits jobs, key/values and headings', () => {
  assert.deepEqual(
    styledLine('2026–now   Founder .... CalendarPipe').map(([s]) => s),
    ['2026–now   ', 'Founder ', '....', ' CalendarPipe'],
  )
  assert.deepEqual(
    styledLine('email ..: a@b.c').map(([s]) => s),
    ['email ..: ', 'a@b.c'],
  )
  assert.equal(styledLine('stack:').length, 1)
})

test('ramp wraps around and hits its stops', () => {
  const stops = [rgb(0, 0, 0), rgb(255, 255, 255)]
  assert.equal(ramp(stops, 0), 0)
  assert.equal(ramp(stops, 0.5), rgb(128, 128, 128))
  assert.equal(ramp(stops, 1.5), ramp(stops, 0.5))
})

test('parseKeys decodes arrows, paging, enter and chars', () => {
  assert.deepEqual(
    parseKeys('\x1b[A\x1b[6~\rq\x03').map((k) => k.ch ?? k.name),
    ['up', 'pgdn', 'enter', 'q', 'ctrl-c'],
  )
  assert.deepEqual(parseKeys('\x1b').map((k) => k.name), ['esc'])
})

test('plain card has every contact and no escape codes', () => {
  const plain = card(false)
  assert.doesNotMatch(plain, /\x1b/)
  for (const s of ['jukben@gmail.com', 'jukben.codes', 'github.com/jukben', 'linkedin.com/in/jukben']) assert.ok(plain.includes(s))
})
