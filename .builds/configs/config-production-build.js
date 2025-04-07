import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import babel from '@rollup/plugin-babel';
import { renameSync } from 'fs';


const path = '.builds/production/'
const entryPointHTMLPageName = 'index-production.html'

export default defineConfig({
  plugins: [
    {
      name: 'rename-html-file',
      closeBundle() {
        renameSync(
          path + entryPointHTMLPageName,
          path + 'index.html'
        )
      },
    },
  ],
  publicDir: 'assets',
  build: {
    outDir: path,
    rollupOptions: {
      input: {
        index: '/' + entryPointHTMLPageName,
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
      plugins: [
        babel({
          configFile: './.builds/configs/.babelrc',
          babelHelpers: 'bundled',
          extensions: ['.js'],
          exclude: 'node_modules/**',
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})