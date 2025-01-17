/// <reference types="vitest" />
import { lingui } from '@lingui/vite-plugin'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import stdLibBrowser from 'node-stdlib-browser'
import { defineConfig, loadEnv, searchForWorkspaceRoot, splitVendorChunkPlugin } from 'vite'
import macrosPlugin from 'vite-plugin-babel-macros'
import { ModuleNameWithoutNodePrefix, nodePolyfills } from 'vite-plugin-node-polyfills'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from 'vite-plugin-svgr'
import viteTsConfigPaths from 'vite-tsconfig-paths'

import * as path from 'path'

const allNodeDeps = Object.keys(stdLibBrowser).map((key) => key.replace('node:', '')) as ModuleNameWithoutNodePrefix[]

// Trezor getAccountsAsync() requires crypto and stream (the module is lazy-loaded)
const nodeDepsToInclude = ['crypto', 'stream']

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['REACT_APP_'])

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce((prev, [key, val]) => {
    return {
      ...prev,
      ['process.env.' + key]: JSON.stringify(val),
    }
  }, {})

  return {
    define: {
      ...envWithProcessPrefix,
    },

    assetsInclude: ['**/*.md'],

    cacheDir: '../../node_modules/.vite/cowswap-frontend',

    server: {
      port: 3000,
      host: 'localhost',
      fs: {
        allow: [
          // search up for workspace root
          searchForWorkspaceRoot(process.cwd()),
          // your custom rules
          'apps/cowswap-frontend/src',
          'libs',
        ],
      },
    },

    preview: {
      port: 3000,
      host: 'localhost',
    },

    resolve: {
      alias: {
        'node-fetch': 'isomorphic-fetch',
        /**
         * Temporary fix for walletconnect
         * https://github.com/Uniswap/web3-react/issues/861
         */
        '@walletconnect/ethereum-provider': path.resolve(
          __dirname,
          '../../node_modules/@walletconnect/ethereum-provider/dist/umd/index.min.js'
        ),
        '@walletconnect/universal-provider': path.resolve(
          __dirname,
          '../../node_modules/@walletconnect/universal-provider/dist/index.cjs.js'
        ),
      },
    },

    build: {
      // sourcemap: true, // disabled for now, as this is causing vercel builds to fail
      rollupOptions: {
        output: {
          manualChunks(id) {
            const isPolyfill = id.includes('src/polyfills')

            if (id.includes('node_modules') || isPolyfill) {
              return 'vendor'
            }
          },
        },
      },
    },

    plugins: [
      nodePolyfills({
        exclude: allNodeDeps.filter((dep) => !nodeDepsToInclude.includes(dep)),
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
        protocolImports: true,
      }),
      splitVendorChunkPlugin(),
      react({
        plugins: [['@lingui/swc-plugin', {}]],
      }),
      viteTsConfigPaths({
        root: '../../',
      }),
      macrosPlugin(),
      lingui({
        cwd: 'apps/cowswap-frontend',
      }),
      svgr(),
      VitePWA({
        injectRegister: null,
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.ts',
        minify: true,
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,png,jpg,svg,json,woff,woff2,md}'],
        },
      }),
      sentryVitePlugin({
        authToken: process.env.REACT_APP_SENTRY_AUTH_TOKEN,
        org: 'cowprotocol',
        project: 'cowswap',
        telemetry: false,
      }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },
  }
})
