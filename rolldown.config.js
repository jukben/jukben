import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/jukben.js',
    format: 'esm',
  },
  platform: 'node',
  external: [
    'react',
    'react/jsx-runtime',
    'ink',
    'ink-big-text',
    'ink-gradient',
    'chalk',
  ],
  moduleTypes: {
    '.js': 'jsx',
  },
  transform: {
    jsx: {
      runtime: 'automatic',
      importSource: 'react',
    },
  },
})
