const fs = require('fs')
const path = require('path')

function createFont() {
  fs.readdir(path.join(__dirname, '/blog'), function (err, res) {
    if (err) {
      console.log(err)
      return
    }
    let list = ['L','S','C','s','t','a','r','l','i','c','o','e']
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
      });
    })
  })
}
createFont()