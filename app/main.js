// const greet = require('./lib/greeting')
import './css/github.css'
const threeWorld = require('./lib/threeWorld')
const axios = require('axios')
const three = require('three')
window._hostname = 'localhost:8000'
axios({
  url: window._hostname,
  method: 'post',
  data: {
    type: 'list'
  },
  header: {
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}).then(function (response) {
  try {
    getFont(response.data)
  } catch (e) {
    getFont(response.data)
  }
}).catch(function (error) {
  console.log(error)
})

function getFont (list) {
  new three.FontLoader().load(window._hostname + '/fonts/myFont.json', function (font) {
    let verts = []
    let pointsG = []
    let _list = ['List', 'Star', 'Close']
    for (let i = 0; i < list.length; i++) {
      _list.push(list[i].split('.')[0].split('-')[1])
    }
    for (let i = 0; i < _list.length; i++) {
      let text = _list[i]
      let g = new three.TextGeometry(text, {
        font: font, // 字体
        size: 30,
        height: 0.1, // 厚度
        curveSegments: 30
      })
      g.center()
      verts.push(g.vertices)
      if (i >= 3) {
        pointsG[i - 3] = new three.Geometry()
        for (let p = 0; p < g.vertices.length; p++) {
          pointsG[i - 3].vertices[p] = new three.Vector3(0, 0, 0)
        }
      }
    }
    threeWorld(list, verts, pointsG)
  })
}
