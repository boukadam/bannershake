import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from "vite-tsconfig-paths";
import {fileURLToPath} from "node:url";

export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/json': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:8080'
            },
            '/skills': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:8080'
            },
            '/img': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:8080'
            },
            '/find': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:8080'
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
