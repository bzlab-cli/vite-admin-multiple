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
import externalGlobals from 'rollup-plugin-external-globals'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { readFileSync } from 'fs'
import sass from 'sass'

const resolve = (p: string) => path.resolve(__dirname, p)

const parseScssVariables = (filePath: string) => {
  const content = readFileSync(resolve(filePath), 'utf-8')
  const compiled = sass.compileString(content, {
    style: 'compressed',
    loadPaths: [resolve('./src/styles')]
  }).css

  const exportBlock = compiled.match(/:export\s*{([\s\S]*?)}/)?.[1] || ''
  return exportBlock.split(';').reduce((obj: Record<string, string>, line) => {
    const [key, val] = line.split(':').map(s => s.trim().replace(/['"]/g, ''))
    if (key && val) obj[key] = val
    return obj
  }, {})
}

const proxyJson = () => {
  try {
    return require('./build/proxy/proxy.json')
  } catch (e) {
    return {}
  }
}
const dynamicProxy = require('./build/proxy/index.ts')
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
const __APP_INFO__ = {
  proxy: proxyJson()
}

const __SCSS_VARS__ = {
  ...parseScssVariables('./src/styles/mixins/variables.module.scss')
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

const cdnJsScript = [
  '/lib/common/vue/vue.global.prod.js',
  '/lib/common/vue-router/vue-router.global.prod.js',
  '/lib/common/demi/index.iife.min.js',
  '/lib/common/element/index.full.min.js',
  '/lib/common/echarts/echarts.min.js',
  '/lib/common/upload/bz-upload.umd.min.js'
]

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
        external: ['vue', 'vue-router', 'vue-demi', 'element-plus', 'echarts'],
        plugins: [
          externalGlobals({
            vue: 'Vue',
            'vue-router': 'VueRouter',
            'vue-demi': 'VueDemi',
            'element-plus': 'ElementPlus',
            echarts: 'echarts',
            '@bz/bz-upload': 'BzUpload'
          })
        ] as any,
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    plugins: [
      vue(),
      ViteEjsPlugin({
        cdnCssScript: [],
        cdnJsScript: process.env.NODE_ENV === 'production' ? cdnJsScript : []
      }),
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
          additionalData: `@import "./src/styles/mixins/index.scss";`
        }
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __SCSS_VARS__: JSON.stringify(__SCSS_VARS__)
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
