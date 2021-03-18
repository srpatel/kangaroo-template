const path = require('path');

module.exports = {
	mode: 'development',
	entry: './server/src/index.ts',
	target: 'es5',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './server/dist',
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'server/dist'),
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.server.json'
						}
					}
				],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};