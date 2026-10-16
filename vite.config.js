import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({ base: '/prompt-hub-cn/', plugins: [vue()], build: { sourcemap: false } })
