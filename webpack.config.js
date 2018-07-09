var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'inline-source-map',
	mode: 'development',
	entry: './app/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [{
		          loader:'babel-loader',
		          query: {
		            presets:['env','react']
		          }
		        }],
				include:path.join(__dirname, 'app'),
				exclude:/node_modules/	
			},

			{

		        test: /\.css$/,
		        use: [
		          'style-loader',
		          {
		            loader: 'css-loader',
		            options: {
		              importLoaders: 1,
		              modules: true,
		              localIdentName: '[name]__[local]_[hash:base64:5]',
		            },
		          }],
		        include:path.join(__dirname, 'app'),
		        exclude: /node_modules/,
		     }
		]
	},
	devServer: {
    	historyApiFallback: true,
  	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './app/public/index.html',
			filename: 'index.html',
			inject: 'body'
		}),
	]
};
