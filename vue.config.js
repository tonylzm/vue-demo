const {
	defineConfig
} = require('@vue/cli-service')
module.exports = defineConfig({
	transpileDependencies: true
})

module.exports = {
	configureWebpack: {
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".json"],
			alias: {}
		},
		module: {
			rules: [{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					appendTsSuffixTo: [/\.vue$/],
				}
			}]
		},
		experiments: {
			topLevelAwait: true
		}
	}
}
module.exports = {
	devServer: {
		proxy: {
			'/api': {
				target: 'https://192.168.101.6:8443', // 后端服务地址
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/'
				}
			}
		},
		  // 此处开启 https
		https: true

	}
};
