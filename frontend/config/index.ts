import { defineConfig } from '@tarojs/cli'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'

export default defineConfig({
  projectName: 'FinanceList',
  date: '2026-06-16',
  designWidth: 750,
  deviceRatio: { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    webpackChain(chain: any) {
      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [{ appType: 'taro', rem2rpx: true }],
          },
        },
      })
    },
  },
  h5: {},
})
