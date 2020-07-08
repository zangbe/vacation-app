module.exports = {

  outputDir: '../Backend/public/',

  devServer: {
    proxy: {
      "^/api/": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api/": "/api/" },
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  },

  "transpileDependencies": [
    "vuetify"
  ]
}