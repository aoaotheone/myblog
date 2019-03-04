const marked = require('marked')
const axios = require('axios')
const highlight = require('highlight.js')

module.exports = {
  markdown: markdown,
  fadeOut: fadeOut
}
function markdown (name) {
  marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
      return highlight.highlightAuto(code, ['javascript', 'json', 'css', 'shell']).value
    },
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    langPrefix: true
  })

  axios({
    url: window._hostname,
    method: 'post',
    data: {
      type: 'md',
      name: name
    }
    // headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })
    .then(function (response) {
      // console.log(response.data)
      let article = document.getElementById('article')
      fadeOut.apply(article, [100])
      setTimeout(function () {
        article.innerHTML = marked(response.data)
        fadeIn.apply(article, [1000])
      }, 100)
    })
    .catch(function (error) {
      console.log(error)
    })
}

function fadeIn (time) {
  let aid
  let that = this
  let count = 1
  fade()
  function fade () {
    if (that.style.opacity >= 1) {
      cancelAnimationFrame(aid)
      return
    }

    that.style.opacity = count++ / (time / 1000 * 60)
    aid = requestAnimationFrame(fade)
  }
}
function fadeOut (time) {
  let aid
  let that = this
  let count = time / 1000 * 60
  fade()
  function fade () {
    if (that.style.opacity <= 0) {
      that.innerHTML = ''
      cancelAnimationFrame(aid)
      return
    }

    that.style.opacity = count-- / (time / 1000 * 60)
    aid = requestAnimationFrame(fade)
  }
}
