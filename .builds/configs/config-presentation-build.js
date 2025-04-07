import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import babel from '@rollup/plugin-babel';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: './.builds/presentation',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    lib: {
      entry: 'src/EntryPointPresentation.js',
      formats: ['iife'],
      name: 'PresentationLayer',
      fileName: (format) => `CompiledPresentationLayer.js`,
    },
    rollupOptions: {
      plugins: [
        babel({
          configFile: './.builds/configs/.babelrc',
          babelHelpers: 'bundled',
          extensions: ['.js'],
          exclude: 'node_modules/**',
        })
      ],
    },
  },
  minify: 'terser',
  terserOptions: {
    compress: {
      passes: 3,
      drop_console: true,
      drop_debugger: true,
    },
    mangle: {
      toplevel: true,
    },
    format: {
      comments: false,
    },
  },
});