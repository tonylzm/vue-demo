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
				target: 'http://localhost:9090', // 后端服务地址
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				}
			}
		}
	}
};
