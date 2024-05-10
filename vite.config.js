import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import fs from 'fs'

// load package.json dependencies
const pkg = JSON.parse(fs.readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'))

const npmToCamelCase = (str) => {
  if (str) {
    // 替换/为-
    str = str.replace(/\//g, '-')

    // 删除首字母@
    str = str.replace(/@/g, '')

    // 首字母大写
    str = str.replace(/(\w)/, (v) => v.toUpperCase())

    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
  }
  return str
}

const globals = {
  // "vue": "Vue"
}
const external = Object.keys(pkg.dependencies || {})
for (let i = 0; i < external.length; i += 1) {
  globals[external[i]] = npmToCamelCase(external[i])
}
const name = npmToCamelCase(pkg.name) || 'MyLib'

export default defineConfig({
  root: process.cwd(),
  base: '/',
  plugins: [vue()],
  server: {
    port: 30200
  },
  build: {
    emptyOutDir: false,
    sourcemap: true,
    outDir: './dist',
    lib: {
      entry: './index.js',
      name,
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external,
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals
      }
    }
  }
})
