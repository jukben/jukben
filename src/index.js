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
