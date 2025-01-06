import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TinybirdTriggerTasks',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['@trigger.dev/sdk'],
      output: {
        globals: {
          '@trigger.dev/sdk': 'TriggerDevSDK',
        },
      },
    },
  },
  plugins: [dts()],
});
