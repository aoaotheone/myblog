const three = require('three')
const { markdown, fadeOut } = require('./markdown')

// console.log(three)

module.exports = function (list, listFontsVerts, pointsG) {
  let camera, scene, render, light, animateID
  let particles, pointsTexture, ListText, bText // 星星 星星纹理 按钮对象 按钮背景对象
  let isMove = true // 星星是否移动
  let istweening = false // 是否有tween动画在执行
  let listPoints = [] // 星星外层粒子对象组
  let points = [] // 列表文字粒子集组
  let listVerts = [] // 列表按钮粒子集
  let starVerts = [] // 星星按钮粒子集
  let closeVerts = [] // 关闭按钮粒子集

  initWorld()
  listBt()
  animate()

  return animateID

  function initWorld () {
    let w = window.innerWidth
    let h = window.innerHeight
    // camera = new three.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 1, 1000)
    // camera.position.z = 200
    camera = new three.PerspectiveCamera(60, w / h, 0.1, 1000)
    camera.position.z = 400
    light = new three.DirectionalLight(0xffffff)
    light.position.set(20, 20, 20)

    scene = new three.Scene()

    render = new three.WebGLRenderer()
    render.setSize(window.innerWidth, window.innerHeight)
    render.domElement.className = 'three'
    document.body.insertBefore(render.domElement, document.getElementById('article'))

    makeStars()
  }

  function initRaycaster () {
    let raycaster = new three.Raycaster()
    let mouse = new three.Vector2()

    function onMouseClick (event) {
      if (istweening) return
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, camera)

      // 获取raycaster直线和所有模型相交的数组集合
      let intersects = raycaster.intersectObjects(scene.children)

      if (intersects.length > 0) {
        switch (intersects[0].object.name) {
          case 'balls':
            ballClick(intersects[0].object.lIndex)
            if (ListText.name === 'starText') {
              showStars()
            }
            ListText.name = 'closeText'
            bText.name = 'closeText'
            tweenVerts(ListText.geometry, closeVerts, 500)
            break
          case 'listText':
            ListText.name = 'starText'
            bText.name = 'starText'
            tweenList(500)
            tweenVerts(ListText.geometry, starVerts, 500)
            break
          case 'starText':
            ListText.name = 'listText'
            bText.name = 'listText'
            showStars()
            tweenVerts(ListText.geometry, listVerts, 500)
            break
          case 'closeText':
            ListText.name = 'listText'
            bText.name = 'listText'
            fadeOut.apply(document.getElementById('article'), [100])
            tweenVerts(ListText.geometry, listVerts, 500)
            break
          default:
            break
        }
      }
    }
    function ballClick (index) {
      markdown(list[index])
    }
    window.addEventListener('click', onMouseClick, false)
    let timeStamp
    window.addEventListener('touchstart', function (e) {
      timeStamp = e.timeStamp
    }, false)
    window.addEventListener('touchover', function (e) {
      if (timeStamp - e.timeStamp <= 100) {
        onMouseClick(e)
      }
    }, false)
  }

  function makeStars () {
    let geometry = new three.Geometry()

    for (let p = 0; p < list.length; p++) {
      let x = Math.random() * 200 - 100
      let y = Math.random() * 200 - 100
      let z = Math.random() * 200 - 100
      let particle = new three.Vector3(x, y, z)
      geometry.vertices.push(particle)
    }

    if (typeof pointsTexture === 'undefined') {
      let loader = new three.TextureLoader()
      loader.load('./img/sun.png', texture => {
        // console.log(texture)
        pointsTexture = texture
        let verts = geometry.vertices
        let material = new three.PointsMaterial({
          map: texture,
          size: 40,
          color: 0xffffff,
          transparent: true,
          depthTest: false, // false值可以是背景完全透明
          opacity: 1,
          blending: three.AdditiveBlending // 提供半透明炫光
        })

        particles = new three.Points(geometry, material)
        // particles.name = 'balls'
        scene.add(particles)
        let listGeometry = new three.SphereGeometry(16, 100, 100)
        let listMaterial = new three.PointsMaterial({
          map: texture,
          size: 1,
          color: 0xffffff,
          transparent: true,
          depthTest: false, // false值可以是背景完全透明
          opacity: 0.1,
          blending: three.AdditiveBlending // 提供半透明炫光
        })
        let pMaterial = new three.PointsMaterial({
          map: texture,
          size: 1,
          color: 0xffffff,
          transparent: true,
          depthTest: false, // false值可以是背景完全透明
          opacity: 1,
          blending: three.AdditiveBlending // 提供半透明炫光
        })
        for (let i = 0; i < list.length; i++) {
          points.push(new three.Points(pointsG[i], pMaterial))
          listPoints.push(new three.Points(listGeometry, listMaterial))
          listPoints[i].name = 'balls'
          listPoints[i].lIndex = i
          listPoints[i].position.set(verts[i].x, verts[i].y, verts[i].z)
          scene.add(listPoints[i])
        }
      })
    } else {
      let verts = geometry.vertices
      let material = new three.PointsMaterial({
        map: pointsTexture,
        size: 50,
        color: 0xffffff,
        transparent: true,
        depthTest: false, // false值可以是背景完全透明
        opacity: 1,
        blending: three.AdditiveBlending // 提供半透明炫光
      })

      particles = new three.Points(geometry, material)
      scene.add(particles)
      let listGeometry = new three.SphereGeometry(25, 100, 100)
      let listMaterial = new three.PointsMaterial({
        map: pointsTexture,
        size: 1,
        color: 0xffffff,
        transparent: true,
        depthTest: false, // false值可以是背景完全透明
        opacity: 0.1,
        blending: three.AdditiveBlending // 提供半透明炫光
      })
      for (let i = 0; i < list.length; i++) {
        listPoints.push(new three.Points(listGeometry, listMaterial))
        listPoints[i].name = 'balls'
        listPoints[i].lIndex = i
        listPoints[i].position.set(verts[i].x, verts[i].y, verts[i].z)
        scene.add(listPoints[i])
      }
    }
    isMove = true
  }

  // 将目录转化为星星
  function showStars () {
    particles = []
    listPoints = []
    for (let i in points) {
      scene.remove(points[i])
      points[i].position.set(0, 0, 0)
    }
    makeStars()
  }

  // 将星星转化为目录
  function tweenList (time) {
    isMove = false
    scene.remove(particles)
    let R = 100
    let num = list.length
    let count = time / 1000 * 60
    let aid
    let d = []
    for (let i = 0; i < num; i++) {
      scene.remove(listPoints[i])
      d.push(new three.Vector3(
        0,
        R * Math.sin(i / num * Math.PI * 2) / (time / 1000 * 60),
        (R * Math.cos(i / num * Math.PI * 2) - 100) / (time / 1000 * 60)
      ))
      scene.add(points[i])
      tweenVerts(points[i].geometry, listFontsVerts[i + 3], time)
    }
    tweenning()
    function tweenning () {
      if (count <= 0) {
        cancelAnimationFrame(aid)
        spinList()
        return
      }
      for (let i = 0; i < num; i++) {
        points[i].position.set(
          0,
          points[i].position.y + d[i].y,
          points[i].position.z + d[i].z
        )
      }
      count--
      aid = requestAnimationFrame(tweenning)
    }
  }

  // 旋转目录
  function spinList () {
    let R = 100
    let num = list.length
    let count = 0
    let aid
    let g = new three.BoxGeometry(160, 30, 0.1, 160, 30, 1)
    let bmaterial = new three.PointsMaterial({
      map: pointsTexture,
      size: 1,
      color: 0xffffff,
      transparent: true,
      depthTest: false, // false值可以是背景完全透明
      opacity: 0.1,
      blending: three.AdditiveBlending // 提供半透明炫光
    })
    let b = []
    for (let i = 0; i < num; i++) {
      let bb = new three.Points(g, bmaterial)
      bb.name = 'balls'
      bb.lIndex = i
      b.push(bb)
      scene.add(bb)
    }
    spin()
    function spin () {
      if (ListText.name !== 'starText') {
        cancelAnimationFrame(aid)
        for (let i = 0; i < num; i++) {
          scene.remove(b[i])
        }
        return
      }
      for (let i = 0; i < num; i++) {
        points[i].rotation.z = 0
        let y = R * Math.sin((i + count / 300) / num * Math.PI * 2)
        let z = R * Math.cos((i + count / 300) / num * Math.PI * 2) - 100
        points[i].position.set(
          0,
          y,
          z
        )
        b[i].position.set(
          0,
          y,
          z
        )
      }
      count++
      aid = requestAnimationFrame(spin)
    }
  }
  // 粒子过渡动画
  function tweenVerts (geometry, verts, time) {
    istweening = true
    let count = 0
    let aid
    let a = []
    let l = verts.length
    let o = []
    for (let i = 0; i < geometry.vertices.length; i++) {
      if (i >= l) {
        break
      }
      a.push({
        x: verts[i].x - geometry.vertices[i].x,
        y: verts[i].y - geometry.vertices[i].y,
        z: verts[i].z - geometry.vertices[i].z
      })
      o.push({
        x: geometry.vertices[i].x,
        y: geometry.vertices[i].y,
        z: geometry.vertices[i].z
      })
    }
    tweens()
    function tweens () {
      if (count >= time / 1000 * 60) {
        cancelAnimationFrame(aid)
        istweening = false
        return
      }
      for (let i in geometry.vertices) {
        if (i >= l) {
          geometry.vertices[i].x = geometry.vertices[i % l].x
          geometry.vertices[i].y = geometry.vertices[i % l].y
          geometry.vertices[i].z = geometry.vertices[i % l].z
          continue
        }
        geometry.vertices[i].x = o[i].x + a[i].x / count * (time / 1000 * 60)
        geometry.vertices[i].y = o[i].y + a[i].y / count * (time / 1000 * 60)
        geometry.vertices[i].z = o[i].z + a[i].z / count * (time / 1000 * 60)
      }
      // geometry.center()
      geometry.verticesNeedUpdate = true
      count++
      aid = requestAnimationFrame(tweens)
    }
  }

  // 添加粒子按钮
  function listBt () {
    if (typeof pointsTexture === 'undefined') {
      setTimeout(listBt, 10)
      return
    }
    let border = new three.BoxGeometry(50, 25, 0.1, 300, 150, 1)
    let bborder = new three.BoxGeometry(50, 25, 0.1, 50, 25, 1)
    let tb = new three.Geometry()
    let lGeometry = new three.Geometry()
    let sGeometry = new three.Geometry()
    let cGeometry = new three.Geometry()
    lGeometry.vertices = listFontsVerts[0]
    sGeometry.vertices = listFontsVerts[1]
    cGeometry.vertices = listFontsVerts[2]
    lGeometry.scale(0.4, 0.4, 0.4)
    sGeometry.scale(0.4, 0.4, 0.4)
    cGeometry.scale(0.4, 0.4, 0.4)
    for (let i in border.vertices) {
      if (Math.abs(border.vertices[i].x) > 24 || Math.abs(border.vertices[i].y) > 11.5) {
        tb.vertices.push({
          x: border.vertices[i].x,
          y: border.vertices[i].y,
          z: 0
        })
      }
    }
    for (let i in lGeometry.vertices) {
      listVerts.push({
        x: lGeometry.vertices[i].x,
        y: lGeometry.vertices[i].y,
        z: lGeometry.vertices[i].z
      })
    }
    for (let i in sGeometry.vertices) {
      starVerts.push({
        x: sGeometry.vertices[i].x,
        y: sGeometry.vertices[i].y,
        z: sGeometry.vertices[i].z
      })
    }
    for (let i in cGeometry.vertices) {
      closeVerts.push({
        x: cGeometry.vertices[i].x,
        y: cGeometry.vertices[i].y,
        z: cGeometry.vertices[i].z
      })
    }
    let material = new three.PointsMaterial({
      map: pointsTexture,
      size: 1,
      color: 0xffffff,
      transparent: true,
      depthTest: false, // false值可以是背景完全透明
      opacity: 1,
      blending: three.AdditiveBlending // 提供半透明炫光
    })
    let bmaterial = new three.PointsMaterial({
      map: pointsTexture,
      size: 1,
      color: 0xffffff,
      transparent: true,
      depthTest: false, // false值可以是背景完全透明
      opacity: 0.1,
      blending: three.AdditiveBlending // 提供半透明炫光
    })
    bText = new three.Points(bborder, bmaterial)
    bText.name = 'listText'
    let bTextb = new three.Points(tb, material)
    ListText = new three.Points(cGeometry, material)
    ListText.name = 'listText'
    ListText.geometry.computeBoundingSphere()
    ListText.position.set(0, -window.innerHeight * 0.3 + 2 * ListText.geometry.boundingSphere.radius, 0)
    bTextb.position.set(0, -window.innerHeight * 0.3 + 2 * ListText.geometry.boundingSphere.radius, 0)
    bText.position.set(0, -window.innerHeight * 0.3 + 2 * ListText.geometry.boundingSphere.radius, 0)
    scene.add(ListText)
    scene.add(bTextb)
    scene.add(bText)
    tweenVerts(cGeometry, listVerts, 500)
    setTimeout(function () {
      initRaycaster()
      document.getElementById('loading').hidden = true
    }, 500)
  }

  function move () {
    let verts = particles.geometry.vertices
    let num = list.length
    while (--num) {
      let count = Math.sqrt((verts[num].x - verts[num - 1].x) * (verts[num].x - verts[num - 1].x) + (verts[num].y - verts[num - 1].y) * (verts[num].y - verts[num - 1].y) + (verts[num].z - verts[num - 1].z) * (verts[num].z - verts[num - 1].z))

      if (count >= 200) {
        verts[num].x = verts[num].x - (verts[num].x - verts[num - 1].x) / 6000
        verts[num].y = verts[num].y - (verts[num].y - verts[num - 1].y) / 6000
        verts[num].z = verts[num].z - (verts[num].z - verts[num - 1].z) / 6000
      } else {
        verts[num].x = verts[num].x + 1 / 3000
        verts[num].y = verts[num].y + 1 / 3000
        verts[num].z = verts[num].z + 1 / 3000
      }
      listPoints[num].position.set(verts[num].x, verts[num].y, verts[num].z)
      listPoints[num].rotation.z += 0.001
    }
    if (num <= 0) {
      verts[0].x = verts[0].x - verts[0].x / 1000
      verts[0].y = verts[0].y - verts[0].y / 1000
      verts[0].z = verts[0].z - verts[0].z / 1000
      listPoints[0].position.set(verts[0].x, verts[0].y, verts[0].z)
      listPoints[0].rotation.z += 0.001
    }

    particles.geometry.verticesNeedUpdate = true
  }

  function animate () {
    animateID = requestAnimationFrame(animate)
    render.render(scene, camera)
    if (typeof particles !== 'undefined' && listPoints.length > 0 && isMove) {
      move()
    }
  }
}
