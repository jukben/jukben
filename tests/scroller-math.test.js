import { describe, test, expect } from 'vitest'
import { visibleScroller } from '../src/scroller-math.js'

describe('visibleScroller', () => {
  test('returns a slice at offset 0', () => {
    expect(visibleScroller('abcdef', 3, 0)).toBe('abc')
  })

  test('wraps around when slice extends past end', () => {
    expect(visibleScroller('abcdef', 3, 4)).toBe('efa')
  })

  test('wraps fully when offset beyond length', () => {
    expect(visibleScroller('abcdef', 3, 6)).toBe('abc')
    expect(visibleScroller('abcdef', 3, 10)).toBe('efa')
  })

  test('handles width equal to text length', () => {
    expect(visibleScroller('abcdef', 6, 0)).toBe('abcdef')
    expect(visibleScroller('abcdef', 6, 3)).toBe('defabc')
  })

  test('handles width larger than text length', () => {
    expect(visibleScroller('abc', 5, 0)).toBe('abcab')
    expect(visibleScroller('abc', 7, 1)).toBe('bcabcab')
  })

  test('handles negative offsets (mod arithmetic)', () => {
    expect(visibleScroller('abcdef', 3, -1)).toBe('fab')
  })
})
