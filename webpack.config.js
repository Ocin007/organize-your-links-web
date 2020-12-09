const path = require('path');

module.exports = {
    mode: 'none',
    entry: './src/frontend/components/index.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, './src/public/js/components'),
        filename: 'components.js',
        assetModuleFilename: 'img/[hash][ext][query]'
    },
    module: {
        rules: [
            {test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/},
            {test: /\.scss$/, use: ['raw-loader', 'sass-loader']},
            {test: /\.html$/, use: 'html-loader'},
            {test: /\.(ico|png)$/, type: 'asset/resource'}
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
    }
}