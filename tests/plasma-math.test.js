import { describe, test, expect } from 'vitest'
import { intensity } from '../src/plasma-math.js'

describe('intensity', () => {
  test('is always in [0, 1]', () => {
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 120
      const y = Math.random() * 40
      const t = Math.random() * 20
      const v = intensity(x, y, t)
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    }
  })

  test('is deterministic for the same inputs', () => {
    expect(intensity(5, 5, 1)).toBe(intensity(5, 5, 1))
  })

  test('varies with time', () => {
    const v1 = intensity(10, 10, 0)
    const v2 = intensity(10, 10, 5)
    expect(v1).not.toBe(v2)
  })

  test('varies with position', () => {
    const v1 = intensity(0, 0, 0)
    const v2 = intensity(20, 20, 0)
    expect(v1).not.toBe(v2)
  })
})
