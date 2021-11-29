'use strict'
const path = require('path')
const fs = require('fs')

const FileManagerPlugin = require('filemanager-webpack-plugin')

const outputDir = 'dist'
const assetsDir = 'static'

const config = require('./src/config.js')
const date = require('./src/utils/date.js')

const port = process.env.port || process.env.npm_config_port || 9528 // dev port
const projectName = process.env.name || config.projectName
const projectPlatform = config.projectPlatform

const envName = process.env.ENV || 'local'
const env = config.env[envName]

const getZipName = (() => {
  const time = date
    .formatTime(new Date())
    .replace(/^\d{4}|\/|:|\d{2}$/g, '')
    .replace(/\s/g, '-')

  return `${projectName}-${projectPlatform}-${env.name}-${time}.zip`
})()

function resolve(dir) {
  return path.join(__dirname, dir)
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: env.publicPath,
  outputDir: outputDir,
  assetsDir: assetsDir,
  lintOnSave: process.env.ENV === 'local',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.ENV]: {
        target: `http://127.0.0.1:${port}/mock`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.ENV]: '',
        },
      },
    },
    after: require('./mock/mock-server.js'),
  },

  configureWebpack: config => {
    if (process.env.ENV !== 'local') {
      config.plugins.push({
        apply: compiler => {
          compiler.hooks.afterEmit.tap('open-dist-webpack-plugin', stats => {
            const zipIsExist = () => {
              fs.exists(resolve(`${outputDir}/` + getZipName), exists => {
                if (exists) {
                  const exec = require('child_process').exec
                  const platform = process.platform

                  // Open `outputDir` directory folder and selected zip file for windows or mac
                  if (platform === 'win32' || platform === 'win64') {
                    exec(
                      'explorer.exe /select,' +
                        resolve(`${outputDir}/` + getZipName)
                    )
                  } else if (platform === 'darwin') {
                    exec(`open -R ${outputDir}/` + getZipName)
                  }
                } else {
                  zipIsExist()
                }
              })
            }

            zipIsExist()
          })
        },
      })
    }
  },

  chainWebpack(config) {
    config.plugin('define').tap(args => {
      args[0]['env'] = JSON.stringify(env)
      return args
    })

    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config =>
        config.devtool('cheap-source-map')
      )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/,
          },
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      config.optimization.runtimeChunk('single')

      config.plugin('filemanager-webpack-plugin').use(FileManagerPlugin, [
        {
          onEnd: {
            archive: [
              {
                source: `${outputDir}`,
                destination: `${outputDir}/` + getZipName,
              },
            ],
          },
        },
      ])
    })
  },
}
