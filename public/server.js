const http = require('http')
const fs = require('fs')
const path = require('path')
let list = 0
http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  let method = req.method.toLowerCase()
  switch (method) {
    case 'get':
      get(req, res)
      break
    case 'post':
      post(req, res)
      break
    default:
      break
  }

}).listen(8000)

function get (req, res) {
  let url = req.url
  if (url === '/') {
    url = '/index.html'
  }
  fs.readFile(path.join(__dirname, url), function (err, file) {
    if (err) {
      res.writeHead(404)
      res.end()
      return
    }
    res.writeHead(200)
    res.end(file)
  })
}

function post(req, res) {
  let buffers = ''

  req.on('data', function (chunk) {
    buffers += chunk
  })
  req.on('end', function () {
    let query
    try {
      query = JSON.parse(buffers)
    } catch (e) {
      res.writeHead(400)
      res.end('Invalid JSON')
      return
    }
    switch (query.type) {
      case 'list':
        getDir(res)
        break
      case 'md':
        getFile(res, query.name)
        break
      case 'font':
        makeList(res)
        break
      default :
        console.log(query)
        break
    }
  })
}

function getFile (res, name) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  let blogUrl = '/blog/' + name
  fs.readFile(path.join(__dirname, blogUrl), 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    res.write(data)
    res.end()
  })
}

function getDir (res) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  fs.readdir(path.join(__dirname, '/blog'), function (err, files) {
    if (err) {
      console.error(err)
      return
    }
    if (files.length > list) {
      createFont()
    }
    list = files.length
    res.end(JSON.stringify(files))
  })
}
function createFont() {
  fs.readdir(path.join(__dirname, '/blog'), function (err, res) {
    if (err) {
      console.log(err)
      return
    }
    let list = ['S','L','C','s','t','a','r','l','i','c','o','e']
    for (let i in res) {
      let str = res[i].split('.')[0].split('-')[1] || res[i].split('.')[0]
      for (let p = 0; p < str.length; p++) {
        let b = str.slice(p,p+1)
        if (list.indexOf(b) === -1) {
          list.push(b)
        }
      }
    }
    fs.readFile(path.join(__dirname, '/fonts/HYXiaoMaiTiJ_Regular.json'),function (err, res) {
      if (err) {
        console.log(err)
        return
      }
      let o = JSON.parse(res)
      let font = JSON.parse(res)
      font.glyphs = {}
      for (let i in list){
        font.glyphs[list[i]] = o.glyphs[list[i]]
      }
      fs.writeFile(path.join(__dirname, '/fonts/myFont.json'), JSON.stringify(font), 'utf8', function (err) {
        if (err) {
          console.log(err)
          return
        }
      })
    })
  })
}
