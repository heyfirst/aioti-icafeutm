const router = require('express').Router()
const firebase = require('./firebase')

router.route('/').get((req, res) => {
  res.send('Hi')
})

router.route('/test').get((req, res) => {
  const food = {
    name: 'chicken fired rice1',
    ingredients: ['rice','chicken','spice'],
    price: 999
  }
  firebase.foodRef.child(2).set(food)
  res.send('Hi')
})


module.exports = router