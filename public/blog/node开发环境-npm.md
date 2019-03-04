# 前段开发环境--npm
前段开发已经实现了模块化，要跟进技术的潮流，就需要不停的更新自己的知识库。所以这篇博客将会简单介绍npm工具的使用

`npm`是`node`自带的模块管理工具，方便我们安装各种插件支持。其作用相当于`linux`下的`apt`，`mac`下的`brew`。
### 系统
mac OS 或 Linux

## 安装
	#mac os
	brew install node -g
	
	#linux
	apt-get install node -g
## 使用方法
新建项目目录`npmPro`，进入项目目录，并执行npm项目初始化

	#新建目录
	mkdir npmPro
	
	#进入目录
	cd pro
	
	#初始化npm项目文件夹
	npm init
执行`npm init`后，会弹出很多选项，都是关于项目描述的，如果不明白可以直接会车跳过就好。最后在项目目录下会生成一个`package.json`文件，这个文件非常的重要
## package.json
执行完`npm init`后的`package.json`

	{
	  "name": "项目名",
	  "version": "1.0.0",
	  "description": "项目描述",
	  "main": "index.js",
	  "scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "author": "作者名",
	  "license": "ISC"
	}
只要是开发项目，都会有项目移植的可能。而该文件除了存放项目基本信息外，还会记录你曾经安装过的依赖包，也就是记录了你的开发环境。所以它在项目移植的时候至关重要。

当然，你在项目开发的过程中，需要正确的使用npm来管理你的依赖包和开发环境。
## npm包管理
### 下载依赖包
	#安装全局依赖包
	npm install 包名 -g
	
	#安装项目依赖包
	npm install 包名 --save-dev
全局安装的依赖包在所有的npm项目中都能使用，但一般我们都不推荐使用全局安装，原因接下来就会提到

安装项目开发环境下的依赖包，需要进入项目目录下。安装命令中的参数`--save-dev`，会自动在该项目的`package.json`中的`devDependencies`选项下添加你安装的依赖包名字。

项目在第一次执行npm install后会新增一个`node_modules`文件夹，用于存放依赖包

执行完`npm install 包名 --save-dev`后的`package.json`

	{
	  "name": "项目名",
	  "version": "1.0.0",
	  "description": "项目描述",
	  "main": "index.js",
	  "scripts": {
	    "test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "author": "作者名",
	  "license": "ISC",
	  "devDependencies": {
	    "包名": "版本号",
	  },
	  "dependencies": {}
	}
### 卸载依赖包
	npm remove 包名
	
执行`npm remove`将会删除`node_modules`中的依赖包，同时删掉`package.json`中的包名
### 依赖包的使用
`node`对依赖包的引用是按照`common.js`标准来引用的
	
	const a = require('包名')
`a`就是npm依赖包暴露出来的对象
## 项目移植
在我们需要移植项目是，我们只需要把项目目录下除了`node_modules`以外的文件和文件夹移植到新的`node`环境下，然后进入项目目录，执行
	
	npm install
这样，我们就可以将项目环境完整的移植到新设备上。当然这个新设备要先安装好`node`。

注意，不用复制`node_modules`文件夹，因为它很大，而且没必要。

前段小伙伴可以看下一篇[webpack][webpack]

[webpack]:https://baidu.com