import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
// import { loadEnv } from 'vite'
import shell from 'shelljs'
import mpa from '@bzlab/bz-vite-mpa'

const dynamicProxy = require('./build/proxy/index.ts')
const resolve = (p: string) => path.resolve(__dirname, p)
const mpaOptions = {
  open: false,
  openFirstPage: '/',
  scanPub: 'public',
  scanDir: 'src/views',
  scanFile: 'main.{js,ts,jsx,tsx}',
  defaultEntries: '',
  defaultPage: 'admin',
  filename: 'index.html'
}

function mpaPlugin(mode) {
  return ({ pages, dest, options }) => {
    if (mode !== 'development') {
      Object.keys(pages).map(key => {
        shell.rm('-rf', resolve(`${dest}/${key}`))
        shell.mv(resolve(`${dest}/${options.scanPub}/${key}`), resolve(dest))
      })
      shell.rm('-rf', resolve(`${dest}/public`))
    }
  }
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  // const root = process.cwd()
  // const env = loadEnv(mode, root)
  console.log('command', command, mode)

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        path: 'path-browserify'
      }
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, //打包时删除console
          drop_debugger: true, //打包时删除 debugger
          pure_funcs: ['console.log']
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      eslintPlugin(),
      mpa(mpaOptions, options => {
        mpaPlugin(mode)(options)
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/styles/mixins.scss";`
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8445,
      open: false,
      https: false,
      cors: true, // 允许跨域
      proxy: dynamicProxy.proxy
    }
  }
}
