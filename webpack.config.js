const path = require('path');

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        material: {
          test: /[\\/]node_modules[\\/]@angular[\\/]material[\\/]/,
          name: 'material',
          chunks: 'all',
          priority: 10,
        },
        angular: {
          test: /[\\/]node_modules[\\/]@angular[\\/]/,
          name: 'angular',
          chunks: 'all',
          priority: 5,
        }
      }
    }
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@shared': path.resolve(__dirname, 'src/app/shared'),
      '@components': path.resolve(__dirname, 'src/app/components'),
      '@services': path.resolve(__dirname, 'src/app/services'),
      '@models': path.resolve(__dirname, 'src/app/models')
    }
  }
}; 