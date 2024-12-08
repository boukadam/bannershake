import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from "vite-tsconfig-paths";
import {fileURLToPath} from "node:url";

export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: process.env.VITE_BANNERSHAKE_API_URL || 'http://localhost:8080',
                rewrite: (path) => path.replace(/^\/api/, '/')
            }
        },
    },
    plugins: [
        vue(),
        tsconfigPaths()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    }
})
