import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/json': {
                target: process.env.VITE_API_BASE_URL || 'http://localhost:8080'
            },
        },
    },
    plugins: [
        vue(),
        tsconfigPaths()
    ],
})
