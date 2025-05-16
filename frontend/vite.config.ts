import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
        '/internal.api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
      },
    },
  }
})
