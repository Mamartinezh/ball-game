
let path = require("path")
let htmlWebpackPlugin = require("html-webpack-plugin")

const ruleForJS = {
	test: /\.js$/,
	loader: "babel-loader",
	options: {
		presets: [
			[
				"@babel/preset-react",
				{
					runtime: "automatic"
				}
			]
		]
	}
}

const ruleForStyle = {
	test: /\.css$/,
	use: ["style-loader", "css-loader"]
}

const rules = [ruleForJS, ruleForStyle]

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "build")
	},
	plugins: [new htmlWebpackPlugin({template:"./src/index.html"})],
	module: {rules},
	devServer: {
		open: true,
		port: 3000,
		compress: true
	}
}