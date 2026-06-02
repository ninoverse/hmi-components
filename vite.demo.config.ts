import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist-demo',
        emptyOutDir: true,
    },
});
