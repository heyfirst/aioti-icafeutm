const express = require('express')
const server = express()

server.use('/', require('./router'))

server.listen(3000, () => {
  console.log(` Hi, Port 3000`)
})