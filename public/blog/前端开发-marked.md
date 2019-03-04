# 前端开发——marked.js
marked.js是一款将markdown文件转换成html的插件。因为要建个人博客，所以想着用这个插件直接将markdown文件显示在网页上，这样会比较方便。

## 安装
```
npm install marked --save-dev 
npm install highlight.js --save-dev //用于代码高亮
```
npm工具包给前端开发带来的便利就是，只要一条命令就能在项目中使用相关插件。
## 使用方法
```
import 'node_modules/highlightjs/styles/gitbub.css' // 引入highlight.js包中的样式，否则代码无法高亮
const marked = require('marked')
const highlight = require('highlight.js')
marked.setOptions({
  	renderer: new myMarked.Renderer(),
  	highlight: function(code) {
 		return highlight.highlightAuto(code, ['javascript', 'json', 'css', 'shell']).value
  	}, // 使用highlight.js高亮代码，将会为代码中的特殊部分添加特定类名，配合上面引入的css样式实现高亮
  	pedantic: false,
  	gfm: true,
  	tables: true,
 	breaks: false,
  	sanitize: false,
  	smartLists: true,
  	smartypants: false,
 	xhtml: false
})
document.body.innerHTML = marked('markdown文本')
```
marked()函数的options详见[marked.js](https://marked.js.org/)
## 样式
marked.js只是单纯的将markdown标记转化为html标签，例如`<h1>`,`<p>`,`<pre>`,`<code>`等标签。所以只要对这些标签进行样式绑定，就可以做到简单的美化。
#### GitHub样式
针对markdown文档，很多支持markdown的网站和markdown编辑器都有自己的一套css样式，我们可以直接拿来使用。
#### 安装
```
npm install github-markdown-css --save-dev
```
#### 使用
```
import 'github-markdown-css'
```
因为本项目是使用`webpack`进行打包的的，而且已经集成了`css-loader`和`style-loade`。所以只需要在`main.js`中引入即可