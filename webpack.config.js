module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname,
  },
  module: {
     // configuration regarding modules
     rules: [
       // rules for modules (configure loaders, parser options, etc.)
       {
         test: /\.js?$/,
         loader: 'babel-loader'
       }
    ]
  }
};
