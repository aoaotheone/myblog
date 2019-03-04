# myblog
为了整理自己学习过的知识，建设了一个简单的个人博客，方便用来展示自己写的`markdown`文件

添加博客的时候，只需要将编辑好的`markdown`文件放到项目文件夹下的`./public/blog`目录下，文章就能在页面上显示

## 下载
通过`git clone`将项目文件下载到本地

```
git clone https://github.com/aoaotheone/myblog.git
```
## 使用方法
安装开发环境依赖（如果需要对源码进行修改）

```
npm install
```
重新打包`webpack`项目（如果对源码进行了改动）

```
npm run build
```
运行项目(使用pm2管理项目)

```
pm2 start ./public/server.js
```

运行成功后，项目运行在 `localhost:8000` ，如果是在服务器上运行，需要修改 `./app/main.js` 中的window._hostname

## 项目效果预览

[aoaotheone.cn:8000](http://aoaotheone.cn:8000)
