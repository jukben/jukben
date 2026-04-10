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
    if (typeof stdout.on !== 'function') {
      return
    }
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
