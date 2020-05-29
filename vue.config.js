const path = require('path')

const stylesDir = 'styles'
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'src', stylesDir),
            path.resolve(__dirname, 'node_modules', 'normalize-scss', 'sass')
          ]
        },
        prependData: `
          @import "@/${stylesDir}/_variables.scss";
          @import "@/${stylesDir}/_mixins.scss";
        `
      }
    }
  }
}
