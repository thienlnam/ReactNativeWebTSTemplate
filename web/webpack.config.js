const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '../');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary
// `node_module`.
const babelLoaderConfiguration = {
  test: /\.js$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'src'),
    path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
    path.resolve(appDirectory, 'node_modules/react-native-elements'),
    path.resolve(appDirectory, 'node_modules/react-native-ratings'),
    path.resolve(appDirectory, 'node_modules/react-native-status-bar-height'),
    path.resolve(appDirectory, 'node_modules/react-native-vector-icons'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
      presets: ['module:metro-react-native-babel-preset'],
      // Re-write paths to import only the modules needed by the app
      plugins: [
        'react-native-web',
        [
          'module-resolver',
          {
            alias: {
              '^react-native$': 'react-native-web',
            },
          },
        ],
      ],
    }
  }
};

const tsLoaderConfiguration = {
    test: /\.ts(x?)$/,
    exclude: /node_modules/,
    use: {
        loader: 'ts-loader'
    }
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    }
  }
};

const iconLoaderConfiguration = {
    test: /\.ttf$/,
    loader: "url-loader", // or directly file-loader
    include: path.resolve(__dirname, "node_modules/react-native-vector-icons"),
};

module.exports = {
  entry: [
    // load any web API polyfills
    // path.resolve(appDirectory, 'polyfills-web.js'),
    // your web-specific entry file
    path.resolve(appDirectory, 'index.web.js')
  ],

  // configures where the build ends up
  output: {
    filename: 'bundle.web.js',
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/'
  },
  devServer: {
    static: {
        directory: path.join(appDirectory, '/')
    }
  },

  // ...the rest of your config

  module: {
    rules: [
      tsLoaderConfiguration,
      iconLoaderConfiguration,
      babelLoaderConfiguration,
      imageLoaderConfiguration,
    ]
  },

  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      'react-native$': 'react-native-web'
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // `.web.js`.
    extensions: [ '.web.js', '.js', '.tsx', '.ts']
  }
}
