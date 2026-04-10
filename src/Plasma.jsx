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
