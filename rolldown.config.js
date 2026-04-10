import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.js',
  output: {
    file: 'dist/jukben.js',
    format: 'esm',
  },
  platform: 'node',
  jsx: {
    runtime: 'automatic',
    importSource: 'react',
  },
})
