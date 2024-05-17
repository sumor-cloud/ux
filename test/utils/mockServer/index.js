import { createServer } from 'vite'
import vue from '@vitejs/plugin-vue'

export default async port => {
  const url = `http://localhost:${port}`

  const server = await createServer({
    configFile: false,
    mode: 'development',
    root: './testServer',
    server: {
      port
    },
    plugins: [vue()]
  })
  await server.listen()

  return {
    server,
    url
  }
}
