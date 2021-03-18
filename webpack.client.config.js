const path = require('path');

module.exports = {
	mode: 'development',
	entry: './client/src/index.ts',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './client/dist',
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'client/dist'),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.client.json'
						}
					}
				],
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				use: 'file-loader',
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
};