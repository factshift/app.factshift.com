import {defineConfig} from 'vite';
import path           from 'path';

export default defineConfig(
  {
    root:      path.resolve(__dirname, 'src'),
    base:      '/',
    publicDir: path.resolve(__dirname, 'public'),
    build:     {
      outDir:        path.resolve(__dirname, 'dist'),
      emptyOutDir:   true,
      sourcemap:     true,
      rollupOptions: {
        input: {
          main:       path.resolve(__dirname, 'src/index.html'),
          // language=file-reference
          'spwashi@': path.resolve(__dirname, 'src/_spwashi@/index.html'),
        }
      }
    },
    server:    {
      host: 'localhost',
      port: 3000,
      open: true,
    },
    plugins:   []
  }
);

