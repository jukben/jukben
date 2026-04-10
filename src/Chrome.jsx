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
