# jukben CLI keygen-style TUI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the one-line `console.log` in `jukben` CLI with a persistent Ink TUI that runs a plasma effect, shows a figlet logo + scrolling marquee, and lets visitors press hotkeys to open info panels (about / writing / talks / greetz / contact).

**Architecture:** Ink (React for CLI) single-file app, pre-built by Rolldown to `dist/jukben.js` and committed. Top-level `App.jsx` owns state (current panel) and keyboard input. Layout uses column flex (Chrome on top, Plasma or Panel in middle, Scroller on bottom) — note this is a simplification from the spec's z-layered mockup; Ink doesn't natively support z-layering and the flex version reads as equally demoscene. Pure logic (palette interpolation, plasma math, scroller math) is factored into plain `.js` files so it can be unit-tested with Vitest.

**Tech Stack:** Ink v5 · React 18 · Rolldown · Vitest · ink-big-text · ink-gradient · chalk

**Spec:** `docs/superpowers/specs/2026-04-10-jukben-cli-keygen-design.md`

**Branch:** `cli-keygen-intro`

---

## File Structure

```
/
├── cli.js                        # modify: shebang + require dist/jukben.js
├── package.json                  # modify: type:module, deps, build+test scripts
├── rolldown.config.js            # create: bundle src/index.js → dist/jukben.js
├── vitest.config.js              # create: test runner config
├── .gitignore                    # modify: ignore node_modules, keep dist/
├── dist/
│   └── jukben.js                 # created by build, committed
├── src/
│   ├── index.js                  # entry: alt screen + ink render + exit message
│   ├── App.jsx                   # state, input handler, layout
│   ├── Plasma.jsx                # background effect component
│   ├── Chrome.jsx                # figlet logo + tagline + menu row
│   ├── Scroller.jsx              # marquee component
│   ├── Panel.jsx                 # centered overlay box
│   ├── content.js                # panel payloads + scroller text + tagline
│   ├── palette.js                # 6-stop cyclic palette + lerp + sample
│   ├── plasma-math.js            # pure intensity(x, y, t) function
│   └── scroller-math.js          # pure visibleScroller(text, width, offset) function
└── tests/
    ├── palette.test.js
    ├── plasma-math.test.js
    ├── scroller-math.test.js
    └── smoke.test.jsx            # ink-testing-library mount test
```

**Responsibilities:**
- `palette.js` — color math only. No chalk, no ink. Unit-tested.
- `plasma-math.js` — plasma intensity function only. Pure. Unit-tested.
- `scroller-math.js` — scroller visible-slice function only. Pure. Unit-tested.
- `content.js` — static text content. Zero logic.
- `Plasma.jsx` / `Chrome.jsx` / `Scroller.jsx` / `Panel.jsx` — pure presentational components, each owns its own internal tick state if needed.
- `App.jsx` — only place that owns UI state (current panel) and keyboard input.
- `index.js` — only place that manipulates the alt screen and prints the exit trailer.

---

## Task 1: Project scaffolding and build pipeline

**Files:**
- Modify: `package.json`
- Create: `rolldown.config.js`
- Create: `vitest.config.js`
- Modify: `.gitignore`
- Create: `src/index.js` (hello-world placeholder, replaced later)
- Create: `dist/` directory (auto from build)

- [ ] **Step 1: Update `package.json`**

Replace the current file contents with:

```json
{
  "name": "jukben",
  "version": "2.0.0",
  "description": "Haha... it's me!",
  "type": "module",
  "bin": {
    "jukben": "cli.js"
  },
  "files": [
    "cli.js",
    "dist/",
    "README.md"
  ],
  "scripts": {
    "build": "rolldown -c",
    "test": "vitest run",
    "test:watch": "vitest",
    "prepublishOnly": "npm run build && npm test"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "ink": "^5.0.0",
    "ink-big-text": "^2.0.0",
    "ink-gradient": "^3.0.0",
    "react": "^18.3.0"
  },
  "devDependencies": {
    "ink-testing-library": "^4.0.0",
    "rolldown": "^1.0.0-beta",
    "vitest": "^2.0.0"
  },
  "license": "MIT"
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: successful install, `node_modules/` populated, `package-lock.json` updated.

- [ ] **Step 3: Create `rolldown.config.js`**

```js
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/jukben.js',
    format: 'esm',
  },
  platform: 'node',
  transform: {
    jsx: {
      mode: 'automatic',
      runtime: 'react-jsx',
      importSource: 'react',
    },
  },
})
```

- [ ] **Step 4: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    include: ['tests/**/*.test.{js,jsx}'],
  },
})
```

- [ ] **Step 5: Update `.gitignore`**

Ensure these lines are present (add missing ones):

```
node_modules/
*.log
.DS_Store
```

`dist/` is intentionally NOT ignored — we commit the built bundle.

- [ ] **Step 6: Create a placeholder `src/index.js`**

```js
console.log("jukben cli — scaffolding working")
```

- [ ] **Step 7: Run the build and verify it produces `dist/jukben.js`**

Run: `npm run build`
Expected: exits 0, creates `dist/jukben.js` containing the bundled placeholder.

- [ ] **Step 8: Run the built file and verify output**

Run: `node dist/jukben.js`
Expected: prints `jukben cli — scaffolding working`.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json rolldown.config.js vitest.config.js .gitignore src/index.js dist/jukben.js
git commit -m "feat: scaffold ink cli with rolldown + vitest"
```

---

## Task 2: palette.js with tests

**Files:**
- Create: `src/palette.js`
- Create: `tests/palette.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/palette.test.js`:

```js
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
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test`
Expected: vitest reports failures with "Cannot find module '../src/palette.js'" or similar.

- [ ] **Step 3: Implement `src/palette.js`**

```js
// Six-stop cyclic palette: magenta → purple → blue → cyan → teal → magenta
// Last stop equals the first so sample(1) wraps seamlessly.
export const PALETTE = [
  [255, 0, 255],   // magenta
  [180, 0, 255],   // purple
  [0, 64, 255],    // blue
  [0, 255, 255],   // cyan
  [0, 255, 180],   // teal
  [255, 0, 255],   // back to magenta
]

/**
 * Linearly interpolate between two rgb triples.
 * @param {[number, number, number]} a
 * @param {[number, number, number]} b
 * @param {number} t - 0..1
 */
export function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ]
}

/**
 * Map an intensity in [0, 1] to a color by stepping through the palette stops.
 * @param {number} intensity - 0..1
 */
export function sample(intensity) {
  const stops = PALETTE.length - 1
  const scaled = Math.max(0, Math.min(1, intensity)) * stops
  const idx = Math.min(Math.floor(scaled), stops - 1)
  const t = scaled - idx
  return lerp(PALETTE[idx], PALETTE[idx + 1], t)
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all palette tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/palette.js tests/palette.test.js
git commit -m "feat: add palette with rgb lerp and cyclic sample"
```

---

## Task 3: plasma-math.js with tests

**Files:**
- Create: `src/plasma-math.js`
- Create: `tests/plasma-math.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/plasma-math.test.js`:

```js
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
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test`
Expected: tests fail with module-not-found.

- [ ] **Step 3: Implement `src/plasma-math.js`**

```js
/**
 * Classic 2D plasma intensity function.
 * Sum of four sine waves, normalized to [0, 1].
 * @param {number} x - column
 * @param {number} y - row
 * @param {number} t - time (scaled)
 * @returns {number} - value in [0, 1]
 */
export function intensity(x, y, t) {
  const v =
    Math.sin(x * 0.15 + t) +
    Math.sin(y * 0.12 + t * 0.8) +
    Math.sin((x + y) * 0.1 + t * 0.5) +
    Math.sin(Math.sqrt(x * x + y * y) * 0.12 + t)
  // v is in [-4, 4]; shift and scale to [0, 1]
  return (v + 4) / 8
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all plasma-math tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/plasma-math.js tests/plasma-math.test.js
git commit -m "feat: add plasma intensity math"
```

---

## Task 4: scroller-math.js with tests

**Files:**
- Create: `src/scroller-math.js`
- Create: `tests/scroller-math.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/scroller-math.test.js`:

```js
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
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `npm test`
Expected: tests fail with module-not-found.

- [ ] **Step 3: Implement `src/scroller-math.js`**

```js
/**
 * Compute the visible slice of a scrolling marquee at the given offset.
 * Wraps around seamlessly and handles widths larger than the source text.
 * @param {string} text
 * @param {number} width
 * @param {number} offset
 * @returns {string}
 */
export function visibleScroller(text, width, offset) {
  const n = text.length
  if (n === 0 || width <= 0) return ''
  // Normalize negative offsets
  const start = ((offset % n) + n) % n
  let out = ''
  for (let i = 0; i < width; i++) {
    out += text[(start + i) % n]
  }
  return out
}
```

- [ ] **Step 4: Run tests and verify they pass**

Run: `npm test`
Expected: all scroller-math tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/scroller-math.js tests/scroller-math.test.js
git commit -m "feat: add scroller marquee math"
```

---

## Task 5: content.js

**Files:**
- Create: `src/content.js`

No tests — this is static data.

- [ ] **Step 1: Create `src/content.js`**

```js
export const tagline = 'jukben · product engineer · prague'

export const menu = [
  { key: 'A', label: 'bout', section: 'about' },
  { key: 'W', label: 'riting', section: 'writing' },
  { key: 'T', label: 'alks', section: 'talks' },
  { key: 'G', label: 'reetz', section: 'greetz' },
  { key: 'C', label: 'ontact', section: 'contact' },
  { key: 'Q', label: 'uit', section: null },
]

const scrollerFragments = [
  'welcome to jukben.codes',
  'hit [a] to read the about',
  'new article: the day my product leader out-engineered me',
  'currently building calendarpipe & advocate',
  'shoutouts to everyone still learning in public',
  "press [q] to quit, or don't",
  'keep on sceneing',
]

export const scrollerText = '»»» ' + scrollerFragments.join(' »»» ') + ' »»» '

export const panels = {
  about: {
    title: 'about',
    body: [
      'JUKBEN',
      'product engineer · prague',
      '',
      'builder with 10+ years of experience delivering end-to-end.',
      "started by shipping freeware games as a teenager, and haven't",
      'stopped since. roots on the frontend, more time these days',
      'across the whole stack and infrastructure.',
      '',
      'currently: advocate technologies · calendarpipe',
      'previously: productboard · outreach',
      '',
      'learning the dark arts of agentic development and tuning my',
      "workflow for a world where half the keyboard isn't mine.",
    ],
  },
  writing: {
    title: 'writing',
    body: [
      '1. the day my product leader out-engineered me',
      '2. analyzing your webpack bundle like a pro',
      '3. the ultimate git flow: trunk-based dev & stacked prs',
      '4. outcomes over outputs',
      '5. reflection on social media in the era of elon musk',
      '6. scaling monorepo: to infinity and beyond',
      '7. how we revamped rfc process at productboard',
      '8. one yarn to rule them all',
      '',
      'read more at jukben.codes',
    ],
  },
  talks: {
    title: 'talks',
    body: [
      'my talks:',
      '  · co možná nevíte o react dev tools',
      '  · frodo baggins but with federated graphql',
      '  · fighting chaos in a monorepo',
      '',
      'appearances:',
      '  · the real role of staff/principal developers',
      '  · from ic to manager and back',
      '  · techuncovered: platform frontend',
    ],
  },
  greetz: {
    title: 'greetz',
    body: [
      '            ═══ GREETZ ═══',
      '',
      'productboard frontend platform crew · you know who you are',
      'the outreach settings-platform survivors',
      'advocate technologies — thanks for the trust',
      'calendarpipe early adopters',
      'everyone who ever reviewed my gnarly RFC',
      'the reactgirls community',
      'the monorepo tooling gang',
      'anyone still using federated graphql in anger',
      '',
      "     special greetz to the warez scene of '98",
      '        you taught us what intros meant',
    ],
  },
  contact: {
    title: 'contact',
    body: [
      '  email    jukben@gmail.com',
      '  web      jukben.codes',
      '  github   github.com/jukben',
      '  linkedin linkedin.com/in/jukben',
    ],
  },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/content.js
git commit -m "feat: add panel content, menu, scroller text"
```

---

## Task 6: Plasma.jsx component

**Files:**
- Create: `src/Plasma.jsx`

No unit tests — rendering is visual. Smoke test in Task 13 catches mount failures.

- [ ] **Step 1: Create `src/Plasma.jsx`**

```jsx
import React, { useEffect, useState } from 'react'
import { Text } from 'ink'
import chalk from 'chalk'
import { intensity } from './plasma-math.js'
import { sample } from './palette.js'

const BLOCK = '█'

export function Plasma({ width, height }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60)
    return () => clearInterval(id)
  }, [])

  const t = tick * 0.08
  const lines = []
  for (let y = 0; y < height; y++) {
    let line = ''
    for (let x = 0; x < width; x++) {
      const [r, g, b] = sample(intensity(x, y, t))
      line += chalk.rgb(r, g, b)(BLOCK)
    }
    lines.push(line)
  }
  return <Text>{lines.join('\n')}</Text>
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Plasma.jsx
git commit -m "feat: add plasma effect component"
```

---

## Task 7: Chrome.jsx component

**Files:**
- Create: `src/Chrome.jsx`

- [ ] **Step 1: Create `src/Chrome.jsx`**

```jsx
import React from 'react'
import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import { tagline, menu } from './content.js'

export function Chrome() {
  return (
    <Box flexDirection="column" alignItems="center">
      <Gradient name="pastel">
        <BigText text="JUKBEN" font="block" />
      </Gradient>
      <Text color="white">{tagline}</Text>
      <Box marginTop={1}>
        {menu.map((item, i) => (
          <Text key={item.key}>
            {i > 0 ? '  ' : ''}
            <Text color="magenta">[{item.key}]</Text>
            <Text color="white">{item.label}</Text>
          </Text>
        ))}
      </Box>
    </Box>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Chrome.jsx
git commit -m "feat: add chrome with figlet logo, tagline, menu row"
```

---

## Task 8: Scroller.jsx component

**Files:**
- Create: `src/Scroller.jsx`

- [ ] **Step 1: Create `src/Scroller.jsx`**

```jsx
import React, { useEffect, useState } from 'react'
import { Text } from 'ink'
import { scrollerText } from './content.js'
import { visibleScroller } from './scroller-math.js'

export function Scroller({ width }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setOffset((o) => o + 1), 80)
    return () => clearInterval(id)
  }, [])

  return <Text color="cyan">{visibleScroller(scrollerText, width, offset)}</Text>
}
```

- [ ] **Step 2: Commit**

```bash
git add src/Scroller.jsx
git commit -m "feat: add scroller marquee component"
```

---

## Task 9: Panel.jsx component

**Files:**
- Create: `src/Panel.jsx`

- [ ] **Step 1: Create `src/Panel.jsx`**

```jsx
import React from 'react'
import { Box, Text } from 'ink'
import { panels } from './content.js'

export function Panel({ section }) {
  const content = panels[section]
  if (!content) return null

  return (
    <Box
      borderStyle="single"
      borderColor="magenta"
      flexDirection="column"
      padding={1}
      width={64}
    >
      <Box justifyContent="center" marginBottom={1}>
        <Text bold color="cyan">
          ═══ {content.title} ═══
        </Text>
      </Box>
      {content.body.map((line, i) => (
        <Text key={i} color="white">
          {line || ' '}
        </Text>
      ))}
      <Box justifyContent="center" marginTop={1}>
        <Text color="gray">[any key] back</Text>
      </Box>
    </Box>
  )
}
```

Note: empty lines become `' '` (single space) because Ink's `<Text>` collapses empty children.

- [ ] **Step 2: Commit**

```bash
git add src/Panel.jsx
git commit -m "feat: add panel overlay component"
```

---

## Task 10: App.jsx — state, input, layout

**Files:**
- Create: `src/App.jsx`

- [ ] **Step 1: Create `src/App.jsx`**

```jsx
import React, { useEffect, useState } from 'react'
import { Box, useApp, useInput, useStdout } from 'ink'
import { Plasma } from './Plasma.jsx'
import { Chrome } from './Chrome.jsx'
import { Scroller } from './Scroller.jsx'
import { Panel } from './Panel.jsx'

const KEY_TO_SECTION = {
  a: 'about',
  w: 'writing',
  t: 'talks',
  g: 'greetz',
  c: 'contact',
}

const CHROME_ROWS = 12
const SCROLLER_ROWS = 1

export function App() {
  const { exit } = useApp()
  const { stdout } = useStdout()
  const [size, setSize] = useState({
    columns: stdout.columns || 80,
    rows: stdout.rows || 24,
  })
  const [panel, setPanel] = useState(null)

  useEffect(() => {
    const onResize = () => {
      setSize({
        columns: stdout.columns || 80,
        rows: stdout.rows || 24,
      })
    }
    stdout.on('resize', onResize)
    return () => stdout.off('resize', onResize)
  }, [stdout])

  useInput((input, key) => {
    if (key.escape || (key.ctrl && input === 'c')) {
      exit()
      return
    }
    const ch = (input || '').toLowerCase()
    if (ch === 'q') {
      exit()
      return
    }
    if (panel) {
      setPanel(null)
      return
    }
    if (KEY_TO_SECTION[ch]) {
      setPanel(KEY_TO_SECTION[ch])
    }
  })

  const middleHeight = Math.max(1, size.rows - CHROME_ROWS - SCROLLER_ROWS)

  return (
    <Box flexDirection="column" width={size.columns} height={size.rows}>
      <Chrome />
      <Box
        width={size.columns}
        height={middleHeight}
        justifyContent="center"
        alignItems="center"
      >
        {panel ? (
          <Panel section={panel} />
        ) : (
          <Plasma width={size.columns} height={middleHeight} />
        )}
      </Box>
      <Scroller width={size.columns} />
    </Box>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add App with state, input handling, layout"
```

---

## Task 11: index.js — entry point

**Files:**
- Modify: `src/index.js` (replace placeholder)

- [ ] **Step 1: Replace `src/index.js`**

```js
import React from 'react'
import { render } from 'ink'
import { App } from './App.jsx'

// Enter the alternate screen buffer so we don't trash the scrollback.
process.stdout.write('\x1b[?1049h')

const app = render(<App />)

app.waitUntilExit().then(() => {
  // Leave the alt screen cleanly.
  process.stdout.write('\x1b[?1049l')
  process.stdout.write('thanks for stopping by — jukben.codes\n')
})
```

- [ ] **Step 2: Commit**

```bash
git add src/index.js
git commit -m "feat: wire up ink render with alt screen handling"
```

---

## Task 12: cli.js — point to built bundle

**Files:**
- Modify: `cli.js`

- [ ] **Step 1: Replace `cli.js` contents**

```js
#!/usr/bin/env node
import('./dist/jukben.js')
```

Note: we switch from `require()` to dynamic `import()` because the package is now `"type": "module"`.

- [ ] **Step 2: Ensure `cli.js` is executable**

Run: `chmod +x cli.js`

- [ ] **Step 3: Commit**

```bash
git add cli.js
git commit -m "feat: point cli.js to built esm bundle"
```

---

## Task 13: Smoke test with ink-testing-library

**Files:**
- Create: `tests/smoke.test.jsx`

- [ ] **Step 1: Write the smoke test**

```jsx
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
```

- [ ] **Step 2: Run tests and verify they pass**

Run: `npm test`
Expected: all tests pass, including palette, plasma-math, scroller-math, and smoke.

If the smoke test fails because `stdout.columns` is undefined under ink-testing-library, note the fallback in App.jsx (`|| 80`, `|| 24`) should cover this. If still failing, pass an explicit size via a prop (add `App({ initialSize })` and default to current behavior).

- [ ] **Step 3: Commit**

```bash
git add tests/smoke.test.jsx
git commit -m "test: add ink smoke test for App mount and menu row"
```

---

## Task 14: Build, run, and manual smoke verification

**Files:**
- Modify: `dist/jukben.js` (regenerated by build)

- [ ] **Step 1: Run the full build**

Run: `npm run build`
Expected: exits 0, regenerates `dist/jukben.js` with the full app.

- [ ] **Step 2: Run the built CLI**

Run: `node cli.js`
Expected:
- Terminal switches to alt screen
- Plasma effect animating in the middle area
- `JUKBEN` logo visible at the top in gradient colors
- Tagline `jukben · product engineer · prague` below
- Menu row `[A]bout  [W]riting  [T]alks  [G]reetz  [C]ontact  [Q]uit`
- Scrolling marquee on the bottom line

- [ ] **Step 3: Interact with panels**

Press `a` — about panel opens over the plasma area.
Press any key — panel closes, plasma resumes.
Repeat for `w`, `t`, `g`, `c`.

- [ ] **Step 4: Quit cleanly**

Press `q`.
Expected:
- Alt screen exits cleanly (terminal restored to previous state)
- Trailer line prints: `thanks for stopping by — jukben.codes`

- [ ] **Step 5: Verify quit via Ctrl+C and Esc as well**

Run `node cli.js` again. Press Ctrl+C. Verify clean exit + trailer.
Run again, press Esc. Verify clean exit + trailer.

- [ ] **Step 6: Commit the rebuilt bundle**

```bash
git add dist/jukben.js
git commit -m "build: regenerate dist bundle with full cli"
```

---

## Task 15: Multi-terminal manual verification

No file changes. This is a checklist to run before considering the feature done.

- [ ] **Step 1: iTerm2 at 80×24**

Resize iTerm to roughly 80 columns, 24 rows. Run `node cli.js`. Verify layout fits, plasma renders, panels fit inside the screen.

- [ ] **Step 2: iTerm2 at full screen**

Maximize iTerm. Run `node cli.js`. Verify plasma fills the middle area, layout doesn't break.

- [ ] **Step 3: VS Code integrated terminal**

Run `node cli.js` inside VS Code's terminal. Verify colors render (true color may fall back to 256-color — still acceptable).

- [ ] **Step 4: Ghostty (if installed)**

Run `node cli.js` in Ghostty. Verify render.

- [ ] **Step 5: Resize mid-run**

Run `node cli.js`. While running, drag the terminal window to resize it. Verify the layout reflows and plasma re-renders at the new dimensions.

- [ ] **Step 6: Note any issues**

If any terminal has obvious rendering bugs, add a note to the risks section of the spec. If plasma is visibly slow (<10 fps), consider the half-resolution fallback mentioned in the spec (render with `▀` upper-half-block and paired fg/bg colors).

- [ ] **Step 7: Final commit (if any fixes were needed during verification)**

```bash
git add -u
git commit -m "fix: <describe any verification-driven fixes>"
```

If no fixes, skip the commit.

---

## Self-Review Checklist

**Spec coverage:**
- Layout (Chrome + Plasma + Scroller + Panel overlay) → Tasks 6–10 ✓
- Plasma math and palette → Tasks 2, 3, 6 ✓
- Scroller payload and math → Tasks 4, 5, 8 ✓
- Menu/state machine → Task 10 ✓
- Panel content (about/writing/talks/greetz/contact) → Task 5 + Task 9 ✓
- Alt screen + exit trailer → Task 11 ✓
- Rolldown build → Task 1 ✓
- Smoke test → Task 13 ✓
- Multi-terminal verification → Task 15 ✓

**Known deviation from spec:** The spec's "three z-layers stacked" visual (plasma behind chrome) is replaced with a simpler column flex layout (Chrome / Plasma / Scroller stacked vertically). Ink doesn't support z-layering natively, and forcing it would mean bypassing Ink's render model. The simplified layout still reads as a demoscene intro — logo + plasma + scroller + greetz is the genre's core, not the overlay geometry.

**Placeholder scan:** No TBDs, TODOs, or "similar to task N" references. All code is inline.

**Type consistency:** `panels[section]`, `menu[].section`, `KEY_TO_SECTION` all use the same string keys (`'about' | 'writing' | 'talks' | 'greetz' | 'contact'`). `Plasma` takes `{ width, height }` consistently. `Scroller` takes `{ width }` consistently. `visibleScroller(text, width, offset)` signature matches its test.

**Scope:** Single feature, single implementation plan. No decomposition needed.
