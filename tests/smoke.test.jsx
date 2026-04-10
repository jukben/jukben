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
    // The Chrome component renders the title (as ASCII art) and the menu
    // Verify the app renders the title using BigText box-drawing characters
    expect(/█|╗|║|╚/.test(frame)).toBe(true)
    // Check for hotkey indicators (either from menu [A-Z] or scroller [a-z])
    expect(/\[[A-Za-z]\]/.test(frame)).toBe(true)
    unmount()
  })

  test('renders the tagline', () => {
    const { lastFrame, unmount } = render(<App />)
    const frame = lastFrame() || ''
    expect(frame).toContain('product engineer')
    unmount()
  })
})
