import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Credits: https://stackoverflow.com/questions/75883720/504-outdated-optimize-dep-while-using-react-vite
  // Added the following to resolve the issue "504 (Outdated Optimize Dep)"
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
