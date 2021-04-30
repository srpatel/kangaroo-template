const path = require('path');

module.exports = function(env, argv) {
	const entryPoint = env.production ? 'index.ts' : 'shim.ts';
	return {
		mode: env.production ? 'production' : 'development',
		entry: `./client/src/${entryPoint}`,
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
					exclude: [
						/node_modules/, 
						path.resolve(__dirname, 'client/src/' + (env.production ? 'shim.ts' : 'index.ts'))
					],
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
};