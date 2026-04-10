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
