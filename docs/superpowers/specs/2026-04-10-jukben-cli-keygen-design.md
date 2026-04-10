# jukben CLI — keygen-style TUI intro

**Status:** draft — pending user approval
**Date:** 2026-04-10
**Branch:** `cli-keygen-intro`

## Context

The `jukben` package already ships a CLI binary via `npx jukben`, but the current implementation is a single `console.log` that prints the site URL and exits. This design replaces it with a persistent terminal UI in the style of 1990s warez-scene keygen intros — a plasma background, a big ASCII logo, a scrolling marquee, and a light menu overlay that lets visitors press hotkeys to open info panels about writing, talks, greetz, and contact.

The goal is a fun, memorable `npx jukben` experience that also happens to be a navigable portfolio.

## Goals

- Make `npx jukben` an instantly recognizable demoscene homage.
- Let visitors actually reach the content (articles, talks, contact) — not pure eye candy.
- Keep the package installable and runnable with a single `npx` command, no build step on the user's machine.
- Stay small enough to read and maintain in an afternoon; this is a personal branding toy, not a product.

## Non-goals

- No real audio. "Keygen music" is out of scope — this is silent. A fake visualizer is not worth the complexity.
- No network calls. All content is baked into the shipped bundle.
- No persistent state, no configuration, no flags. It runs, you play with it, you quit.
- Not targeting Windows `cmd.exe`. Modern terminals (iTerm2, Alacritty, Kitty, Warp, Windows Terminal, VS Code integrated, Ghostty) are the bar.

## Experience

### Layout

Three z-layers stacked into a single full-terminal frame:

1. **Plasma background** — a full-screen animated color wave, always running.
2. **Chrome overlay** — rendered over the plasma:
   - Big ASCII logo (`JUKBEN`) near the top, figlet-style with a gradient fill.
   - Tagline line under the logo: `jukben · product engineer · prague`.
   - Menu row lower-center: `[A]bout  [W]riting  [T]alks  [G]reetz  [C]ontact  [Q]uit`.
   - Scrolling marquee on the bottom row, moving right-to-left.
3. **Panel overlay** — centered box (~60×15 chars, clamped to terminal size) that appears when a menu key is pressed. Drawn with single-line borders, solid background so content is readable. Plasma keeps animating in the area outside the box.

### Interaction state machine

```
IDLE  ──(key A/W/T/G/C)──▶  PANEL_OPEN(section)  ──(any key)──▶  IDLE
IDLE  ──(key Q/Esc/Ctrl+C)──▶  EXIT
PANEL_OPEN ──(key Q/Esc/Ctrl+C)──▶  EXIT
```

- Hotkeys are case-insensitive single letters. No arrows, no mouse.
- Any key dismisses a panel back to `IDLE`.
- On exit, the alt screen is cleared and a single short line is printed into the normal terminal flow: `thanks for stopping by — jukben.codes`.

### Plasma effect

Classic 2D plasma. For each cell `(x, y)` at time `t`:

```
intensity(x, y, t) =
    sin(x * 0.15 + t)
  + sin(y * 0.12 + t * 0.8)
  + sin((x + y) * 0.10 + t * 0.5)
  + sin(sqrt(x*x + y*y) * 0.12 + t)
```

Normalize to `[0, 1]`, then map into a six-stop cyclic palette (magenta → purple → blue → cyan → teal → magenta). Render each cell as a density-block character (`█` or a shading ramp like ` ░▒▓█`) colored via `chalk.rgb(...)`.

- Tick rate: ~60 ms (~16 fps).
- Grid size: terminal `columns × rows`, recalculated on `SIGWINCH` (Ink handles resize).
- Perf fallback: if rendering a full 80×24 grid per tick is too slow on any target terminal, halve vertical resolution by having each rendered row represent two grid rows (classic demoscene trick using the `▀` upper-half-block character with different fg/bg).

### Scroller

Single bottom row. A long concatenated payload string scrolls left one column per tick (50–80 ms). When the head reaches the end, wrap seamlessly. No dynamic content — payload is static at bundle time.

Content fragments (draft):

```
»»» welcome to jukben.codes »»» hit [a] to read the about »»»
new article: the day my product leader out-engineered me »»»
currently building calendarpipe & advocate »»»
shoutouts to everyone still learning in public »»»
press [q] to quit, or don't »»» keep on sceneing
```

### Panel content

**About** — condensed from the README:

```
JUKBEN
product engineer · prague

builder with 10+ years of experience delivering end-to-end.
started by shipping freeware games as a teenager, and haven't
stopped since. roots on the frontend, more time these days
across the whole stack and infrastructure.

currently: advocate technologies · calendarpipe
previously: productboard · outreach

learning the dark arts of agentic development and tuning my
workflow for a world where half the keyboard isn't mine.
```

**Writing** — numbered list of 8 articles pulled from the README's articles section. Footer: `read more at jukben.codes`.

**Talks** — two labeled sections ("My Talks" / "Appearances") mirroring the README talks block.

**Greetz** — demoscene-style shoutouts:

```
                        ═══ GREETZ ═══

     productboard frontend platform crew · you know who you are
     the outreach settings-platform survivors
     advocate technologies — thanks for the trust
     calendarpipe early adopters
     everyone who ever reviewed my gnarly RFC
     the reactgirls community
     the monorepo tooling gang
     anyone still using federated graphql in anger

              special greetz to the warez scene of '98
                 you taught us what intros meant
```

**Contact**:

```
  email    jukben@gmail.com
  web      jukben.codes
  github   github.com/jukben
  linkedin linkedin.com/in/jukben
```

## Architecture

### Library choice

**Ink** (React for CLI). The menu/panel/state logic is where most of the real code lives, and React-in-terminal makes that almost free. The plasma effect is a ~30-line component with a tick-driven `useState` frame counter. Keyboard input uses Ink's `useInput` hook.

Additional dependencies:

- `ink-big-text` — block font for the `JUKBEN` logo.
- `ink-gradient` — gradient fill for the logo.
- `chalk` — RGB color for plasma cells.
- `react` — peer of Ink.

### Build pipeline

JSX source requires a build step. Shipping raw JSX would force users' `node` to understand it, which is brittle. The package will pre-build to a single ESM bundle committed to the repo, and `bin` will point at the built file.

**Bundler:** Rolldown. Confirmed to support JSX natively via Oxc using `transform.jsx` config:

```js
// rolldown.config.js
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

Fallback bundler if Rolldown proves flaky for this use case: `esbuild` with `--bundle --platform=node --format=esm --jsx=automatic`.

### File structure

```
/
├── cli.js                  # unchanged: #!/usr/bin/env node + require("./dist/jukben.js")
├── package.json            # "type": "module", bin → cli.js, build script, deps
├── rolldown.config.js      # build config
├── dist/
│   └── jukben.js           # built output, committed
└── src/
    ├── index.js            # entry: ink render(<App />)
    ├── App.jsx             # top-level: <Plasma/> + <Chrome/> + <Panel/>, owns UI state
    ├── Plasma.jsx          # background effect, tick loop
    ├── Chrome.jsx          # logo + tagline + menu row
    ├── Scroller.jsx        # bottom marquee, tick loop
    ├── Panel.jsx           # centered overlay box, receives section prop
    ├── content.js          # panel payloads + scroller text
    └── palette.js          # gradient stops + rgb interpolation helper
```

### State ownership

`App.jsx` owns:

- `mode`: `'idle' | 'panel'`
- `panel`: section key (`'about' | 'writing' | 'talks' | 'greetz' | 'contact'`) when `mode === 'panel'`
- Handles `useInput` for hotkeys and quit.

`Plasma.jsx`, `Scroller.jsx` each own their own tick state — they're pure presentational components, no external dependencies.

### Exit handling

- `q`, `Q`, `Escape`, and Ctrl+C all trigger a clean exit.
- Ink's `useApp().exit()` unmounts the tree, which restores the alt screen and returns cursor.
- After unmount, `process.stdout.write('thanks for stopping by — jukben.codes\n')` prints the trailing line so there's a trace after the user closes it.

## Testing strategy

Minimal. This is a visual toy — most of its value is in vibes.

- Manual testing in iTerm2, Ghostty, and VS Code integrated terminal at a few sizes (80×24, 120×40, fullscreen).
- A single smoke test that renders `<App />` with `ink-testing-library` and asserts the menu row is present — catches regressions where the tree fails to mount.
- No unit tests for the plasma math. If it renders and doesn't crash, it's correct.

## Risks and open questions

- **Terminal compatibility.** Some terminals don't render `chalk.rgb` true colors well (falls back to 256-color). Palette should still look acceptable; worth a manual check in Apple Terminal.
- **Perf on slow terminals.** 80×24 at 16fps is ~32k chalk calls per second. Should be fine on modern hardware but measure before shipping. Fallback: half-resolution rendering via `▀` trick.
- **Bundle size.** Ink + React + ink-big-text + ink-gradient is probably ~200KB minified. Acceptable for `npx`.
- **Alt screen vs inline.** Ink's default render is inline (scroll buffer); for a persistent TUI, we want the alt screen so quitting doesn't leave a mess. Ink supports this via the `exitOnCtrlC` option and manual ANSI `\x1b[?1049h` / `\x1b[?1049l` on mount/unmount if needed. To verify during implementation.

## Out of scope / future ideas

- Music visualizer (fake or real).
- Multiple background effects cycling (fire, starfield, tunnel).
- A `--plain` flag to skip the intro and print just the info (for scripts / CI).
- An ASCII portrait of jukben.
- Remote content: pulling articles from jukben.codes RSS instead of baking them in.
