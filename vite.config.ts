import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 设置为相对路径，这样 Electron 才能正确加载资源
  base: './',
  server: {
    port: 5173
  }
})
