import { describe, test, expect } from 'vitest'
import { lerp, sample, PALETTE } from '../src/palette.js'

describe('lerp', () => {
  test('returns a at t=0', () => {
    expect(lerp([0, 0, 0], [255, 255, 255], 0)).toEqual([0, 0, 0])
  })

  test('returns b at t=1', () => {
    expect(lerp([0, 0, 0], [255, 255, 255], 1)).toEqual([255, 255, 255])
  })

  test('returns midpoint at t=0.5', () => {
    expect(lerp([0, 0, 0], [200, 100, 50], 0.5)).toEqual([100, 50, 25])
  })

  test('rounds values to integers', () => {
    const result = lerp([0, 0, 0], [1, 1, 1], 0.5)
    expect(result.every((v) => Number.isInteger(v))).toBe(true)
  })
})

describe('sample', () => {
  test('returns first palette color at intensity=0', () => {
    expect(sample(0)).toEqual(PALETTE[0])
  })

  test('returns last palette color at intensity=1', () => {
    expect(sample(1)).toEqual(PALETTE[PALETTE.length - 1])
  })

  test('returns an rgb triple for any valid intensity', () => {
    for (let i = 0; i <= 10; i++) {
      const result = sample(i / 10)
      expect(result).toHaveLength(3)
      expect(result.every((v) => v >= 0 && v <= 255)).toBe(true)
    }
  })

  test('palette wraps back to first color (cyclic)', () => {
    // last stop should equal first stop for seamless cycling
    expect(PALETTE[PALETTE.length - 1]).toEqual(PALETTE[0])
  })
})
