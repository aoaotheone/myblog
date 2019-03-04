# 前段开发环境--webpack
本篇承接 [node开发环境--npm][npm]

`webpack`是一个前端代码打包压缩工具，通过`webpack`我们可以将项目中的`ES6`语法转化为`ES5`语法已增强对浏览器的支持，还可以集成编译`less`，`sass`等等。
## 安装
进入项目目录，执行
	
	npm install webpack --save-dev
	npm install webpack-cli --save-dev
这条命令在上面解释过了

## 使用方法
在安装完`webpack`后，我们有两种方案去进行`webpack`配置。下面将会分两种方案来配置一个支持最新es标准语法，支持`import`引入模块，支持在js文件里引入css文件，还有编译时压缩，丑化代码的`webpack`项目。

###方案一

手动配置`webpack.config.js`，这个方法对新手不太友好，但是配置过程中可以详细的了解`webpack`各项配置的用途，这在以后维护别人开发的`webpack`项目时会很有用。

进入项目目录下，简单构建一下项目目录结构
	
	/项目目录
	.../src		// 手动添加
	....../app		// 手动添加
	.........index.js		// 手动添加
	.../node_modules 
	...package.json
	...package-lock.json
	...webpack.config.js		// 手动添加
上面需要添加的文件夹和文件都已经标出来了，其他的在用npm初始化目录后就会自动生成

编辑`webpack.config.js`，添加以下内容

	const webpack = require('webpack');
	const path = require('path');
	module.exports = {
		module: {
			// 代码编译压缩规则
			rules: [
				// 对js代码编译时执行以下规则
				{
					// 需要编译的代码目录
					include: [path.resolve(__dirname, 'src')],
					loader: 'babel-loader',
					options: {
						// 使用该插件开启对import语法的支持
						plugins: ['syntax-dynamic-import'],
						// 配置es语法版本的兼容标准
						presets: [
							[
								'@babel/preset-env',
								{
									modules: false
								}
							]
						]
					},
					// 匹配js文件
					test: /\.js$/
				},
				// 对css编译时执行以下规则
				{
					// 匹配css文件
					test: /\.css$/,
					use: [
						// 支持在js中引入css文件
						{
							loader: 'style-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'css-loader'
						}
					]
				}
			]
		},
		// 编译时的唯一入口文件，该目录下的index.js
		entry: {
			app: './src/app'
		},
		// 编译后输出的文件名，默认生成一个dist文件夹
		output: {
			filename: '[name].[chunkhash].js'
		},
		// 开发环境
		mode: 'development',	// production编译会慢一点，但编译出来的代码会小一点
	};

以上各项配置的作用都以注释的形式写在旁边了，但是手动配置的步骤还没完。上述配置需要用到很多依赖包，所以还要到项目目录安装。

项目目录下执行

	npm install @babel/core --save-dev
	npm install @babel/preset-env --save-dev
	npm install @webpack-cli/init --save-dev
	npm install babel-loader --save-dev
	npm install babel-plugin-syntax-dynamic-import --save-dev
	npm install css-loader --save-dev
	npm install style-loader --save-dev
手动配置`webpack`项目完成，需要支持更多规则，可以先安装依赖包，然后再到`webpack`里面编写规则。具体规则在依赖包的npm官网会有写明的。
### 方案二
自动完成`webpack.config.js`配置。这里使用了`webpack-cli`插件。

首先同样构建一个项目目录

	/项目目录
	.../src		// 手动添加
	....../app		// 手动添加
	.........index.js		// 手动添加
	.../node_modules 
	...package.json
	...package-lock.json
相比方案一这里少了一个`webpack.config.js`，因为等下自动构建的时候会生成。
#### 安装
	npm install @webpack-cli/init --save-dev
相比方案一这里多安装了一个`@webpack-cli/init`
#### 构建webpack配置
项目目录下运行

	npx webpack-cli init
运行时会有弹窗让你选择编译配置，按提示来填就好，运行完后就会得到一个`webpack.dev.js`
	
	const webpack = require('webpack');
	const path = require('path');
	const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
	
	module.exports = {
		module: {
			// 编译规则
			rules: [
				// js文件编译规则
				{
					// 要编译的文件目录
					include: [path.resolve(__dirname, 'src')],
					// 使用babel编译
					loader: 'babel-loader',
					// 允许项目使用import来引入模块
					options: {
						plugins: ['syntax-dynamic-import'],
						// 支持最新的es语法，可根据环境设置兼容
						presets: [
							[
								'@babel/preset-env',
								{
									modules: false
								}
							]
						]
					},
					test: /\.js$/
				},
				// css文件编译规则
				{
					test: /\.css$/,
					use: [
						// 支持用import引入css文件
						{
							loader: 'style-loader',
	
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'css-loader'
						}
					]
				}
			]
		},
		// 编译的入口文件，此时为app目录下的index文件
		entry: {
			app: './src/app'
		},
		// 编译后文件的存放名与存放位置， 默认为dist
		output: {
			filename: '[name].[chunkhash].js'
		},
		// 开发环境，编译快，文件大
		mode: 'development', // production 编译慢，文件小
		
		// 代码压缩配置
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendors: {
						priority: -10,
						test: /[\\/]node_modules[\\/]/
					}
				},
	
				chunks: 'async',
				minChunks: 1,
				minSize: 30000,
				name: true
			}
		}
	}
如果项目目录成公出现这个文件，并且没有报错，那么恭喜你自动构建`webpack`配置成功


[npm]: https://baidu.com