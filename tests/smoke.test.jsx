import React from 'react'
import { describe, test, expect } from 'vitest'
import { render } from 'ink-testing-library'
import { App } from '../src/App.jsx'

describe('App smoke test', () => {
  test('mounts without crashing', () => {
    const { lastFrame, unmount } = render(<App />)
    expect(lastFrame()).toBeDefined()
    unmount()
  })

  test('renders the menu row with all hotkeys', () => {
    const { lastFrame, unmount } = render(<App />)
    const frame = lastFrame() || ''
    expect(frame).toContain('[A]')
    expect(frame).toContain('[W]')
    expect(frame).toContain('[T]')
    expect(frame).toContain('[G]')
    expect(frame).toContain('[C]')
    expect(frame).toContain('[Q]')
    unmount()
  })

  test('renders the tagline', () => {
    const { lastFrame, unmount } = render(<App />)
    const frame = lastFrame() || ''
    expect(frame).toContain('product engineer')
    unmount()
  })
})
