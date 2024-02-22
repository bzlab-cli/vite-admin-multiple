import type { UserConfig, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// import { loadEnv } from 'vite'
import shell from 'shelljs'
import mpa from '@bzlab/bz-vite-mpa'
import { Vite } from './src/config/settings'

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
  // const env = loadEnv(mode, process.cwd())
  console.log('command', command, mode)

  return {
    resolve: {
      alias: {
        '@': resolve('./src'),
        path: 'path-browserify'
      }
    },
    build: {
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
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
      eslintPlugin({ cache: false }),
      VueSetupExtend(),
      mpa(mpaOptions, options => {
        mpaPlugin(mode)(options)
      }),
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 102400,
        algorithm: 'gzip',
        ext: '.gz'
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve('src/assets/svg')],
        symbolId: 'icon-[name]'
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
      port: Vite.port,
      open: false,
      https: false,
      cors: true, // 允许跨域
      proxy: dynamicProxy.proxy
    }
  }
}
