import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';

export default defineConfig({
  plugins: [
    react(),
    preserveDirectives() as Plugin,
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true 
    }),
  ],
  build: {
    lib: {
      entry: [resolve(__dirname, 'src/client.ts'), resolve(__dirname, 'src/actions/server.ts')],
      name: '@inputron',
      formats: ['es', 'cjs'],
      fileName: (format,name) =>  `${name}.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },

    },
    target: 'esnext',
    sourcemap: true,
  },
  ssr: {
    noExternal: ['react', 'react-dom'], // Ensure Vite doesn't bundle these
  },
});