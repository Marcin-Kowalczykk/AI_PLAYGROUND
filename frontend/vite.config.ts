import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/verify': {
          target: env.VITE_AGENTS_XYZ_API,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
