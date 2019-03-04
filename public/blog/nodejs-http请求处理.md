# nodejs——http请求处理
在web项目开发过程中，有那么一个小环节，处理的稍有差池，就会逼疯前后台的开发者，那就是**前后端的数据交互**。这篇文章将用`nodejs`从**后台**的角度来处理基`http`的**前后台交互**
## http及其他相关模块
node自带了很多相关的模块以供我们来处理来自前端的http请求，其中最为核心的是`http`模块，它可以让我们在任意可用的端口上监听http请求，获取请求相关数据包，以及返回数据给前端。另外还有一些相关模块如`url` `querystring`等，这些模块的作用是为了方便我们处理http请求数据包。
## http请求分类处理
这里只介绍常用的`get`和`post`请求，新建`server.js`

```javascript
const http = require('http')
const { URLSearchParams } = require('url')
// const query = require('querystring')
// const xml2js = require('xml2js')

http.createServer((req, res) => {
  let method = req.method.toLowerCase() // 获取请求方法
  switch (method) {
    case 'get':
      get(req, res)
      break
    case 'post':
      _post(req, res)
      break
    default:
      break
  }
}).listen(8008)
```
上述是使用`http`模块监听http请求的实例代码，`req`对象为http请求数据包，`res`为http响应对象，相面会介绍这两个对象的使用方法。
#### get请求处理

在`server.js`后加入

```javascript
function get (req, res) {
  let url = req.url.split('?') // 提取？后面的get请求数据
  if (url.length <= 1) {
    handle({}, res)
    return
  }
  console.log(url[0]) // type=list
  
  let params = new URLSearchParams(url[0])
  console.log(params) // URLSearchParams { 'type' => 'list' }
  
  let query = {}
  params.forEach((value, name) => {
    query[name] = value
  })
  console.log(query) // { type: 'list' }
  handle(query, res)
}
```
上述代码使用`url`模块中的`URLSearchParams`构造器将get请求url中的参数转化为`json`格式的数据，传给`handle`函数。

`URLSearchParams`是`url`模块实现了`WHATWG`标准的新api，而支持旧标准的`url.parse`虽然还有支持，但最终回取消。所以在这里就只介绍了新标准的用法，就标准以后在新项目中应该尽量避免使用

#### post请求处理
在server.js后加入

```javascript
function _post (req, res) {
  let buffers = ''

  req.on('data', function (chunk) {
    buffers += chunk
  })

  // 旧版本
  // req.on('end', function () {
  //   let query
  //   if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
  //     query = queryString.parse(buffers)
  //   } else if (req.headers['content-type'] === 'application/json') {
  //     try {
  //       query = JSON.parse(buffers)
  //     } catch (e) {
  //       res.writeHead(400)
  //       res.end('Invalid JSON')
  //       return
  //     }
  //   } else if (req.headers['content-type'] === 'application/xml') {
  //     xml2js.parseString(buffers, function (err, json) {
  //       if (err) {
  //         res.writeHead(400)
  //         res.end('invalid XML')
  //         return
  //       }
  //       handle(json, res)
  //     })
  //     return
  //   }
  //   handle(query, res)
  // })
  
  req.on('end', function () {
    let query
    try {
      query = JSON.parse(buffers)
    } catch (e) {
      res.writeHead(400)
      res.end('Invalid JSON')
      return
    }
    handle(query, res)
  })
}
```
原本在处理post请求时，要分析`headers`中的`content-type`，根据不同类型对请求数据做出不同的处理，已得到json格式数据。但是写博客时用的`node`版本是`v11.9.0`，这个版本里的接收到的buffer数据竟然无论哪种数据类型的请求，都已经自动转化为json格式数据，这不得不说是一个惊喜。不过在上述代码中，我还是把旧版本的处理方式贴了处理。
#### http响应
在server.js后加入

```javascript
function handle (query, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(200, { 'Content-Type': 'application/json' })

  console.log(query.type)

  let result = {
    status: 'success'
  }
  res.end(JSON.stringify(result))
}
```
还记得一开始的`req`和`res`吗，在处理`get`和`post`请求的过程中，我们多次对req数据包里的数据进行分析处理。而`res`对象则是在我们处理完所有的前端请求后，需要将响应数据返回给前端时才隆重登场。通过`res`对象，我们可以设置各种响应头，响应状态还有响应数据。
## 最后
完整代码

```javascript
const http = require('http')
const { URLSearchParams } = require('url')
// const queryString = require('querystring')
// const xml = require('xml2js')

http.createServer((req, res) => {
  let method = req.method.toLowerCase()
  switch (method) {
    case 'get':
      get(req, res)
      break
    case 'post':
      _post(req, res)
      break
    default:
      break
  }
}).listen(8008)

function get (req, res) {
  console.log(req.url) // /?type=list

  let url = req.url.split('?') // 提取？后面的get请求数据
  if (url.length <= 1) {
    handle({}, res)
    return
  }
  console.log(url[1]) // type=list

  let params = new URLSearchParams(url[1])
  console.log(params) // URLSearchParams { 'type' => 'list' }

  let query = {}
  params.forEach((value, name) => {
    query[name] = value
  })

  console.log(query) // { type: 'list' }

  handle(query, res)
}

function _post (req, res) {
  let buffers = ''

  req.on('data', function (chunk) {
    buffers += chunk
  })

  // 旧版本
  // req.on('end', function () {
  //   let query
  //   if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
  //     query = queryString.parse(buffers)
  //   } else if (req.headers['content-type'] === 'application/json') {
  //     try {
  //       query = JSON.parse(buffers)
  //     } catch (e) {
  //       res.writeHead(400)
  //       res.end('Invalid JSON')
  //       return
  //     }
  //   } else if (req.headers['content-type'] === 'application/xml') {
  //     xml2js.parseString(buffers, function (err, json) {
  //       if (err) {
  //         res.writeHead(400)
  //         res.end('invalid XML')
  //         return
  //       }
  //       handle(json, res)
  //     })
  //     return
  //   }
  //   handle(query, res)
  // })

  req.on('end', function () {
    let query
    try {
      query = JSON.parse(buffers)
    } catch (e) {
      res.writeHead(400)
      res.end('Invalid JSON')
      return
    }
    handle(query, res)
  })
}

function handle (query, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.writeHead(200, { 'Content-Type': 'application/json' })

  console.log(query.type)

  let result = {
    status: 'success'
  }
  res.end(JSON.stringify(result))
}
```