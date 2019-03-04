const axios = require('axios')

module.exports = () => {
  let list
  axios.get('http://localhost:8008', {
    params: {
      type: 'list'
    }
  })
    .then(function (response) {
      // console.log(response.data)
      list = response.data
    })
    .catch(function (error) {
      console.log(error)
    })

  return list
}
