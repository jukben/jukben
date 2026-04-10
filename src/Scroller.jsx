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
