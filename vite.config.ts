import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  server:{
    proxy:{
      '/api':'http://localhost:8080',
      '/websock': {
        target:'ws://localhost:8080',
        ws:true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
}})
