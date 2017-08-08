const router = require('express').Router()
const firebase = require('./firebase')

const foods = [
  {
    name: 'chicken fired rice',
    ingredients: ['rice','chicken','spice'],
    price: 9
  },
  {
    name: 'Curry Mee',
    ingredients: ['noodle', 'spice', 'curry', 'chicken'],
    price: 12
  },
  {
    name: 'Village fried rice',
    ingredients: ['nice', 'vegetables'],
    price: 7
  },
  {
    name: 'Pattaya fried rice',
    ingredients: ['egg', 'rice', 'sauce'],
    price: 5
  },
  {
    name: 'Fired Noodle',
    ingredients: ['noodle', 'vegetables'],
    price: 11
  },
  {
    name: 'Salad',
    ingredients: ['vegetable'],
    price: 6
  },
  {
    name: 'Banana Juice',
    ingredients: ['fruit', 'banana'],
    price: 3
  },
]

const tables = [
  {
    name: 'utm-cafe1-table1',
    status: 0
  },
  {
    name: 'utm-cafe1-table2',
    status: 0
  },
  {
    name: 'utm-cafe1-table3',
    status: 0
  }
]

router.route('/initial-cafe').get((req, res) => {
  firebase.foodRef.remove()
  firebase.orderRef.remove()
  firebase.tableRef.remove()

  foods.map((food, key) => {
    firebase.foodRef.push(food)
  })
  
  tables.map((table, key) => {
    firebase.tableRef.push(table)
  })

  res.send('Initial the Cafe !')
})

router.route('/').get((req, res) => {
  res.send('Hi, iCafe UTM')
})

router.route('/order').get((req, res) => {
  res.json(req.query)
})

router.route('/foods').get(async (req, res) => {
  let data = await firebase.foodRef.once('value').then(snapshot => snapshot.val())
  
  const foods = Object.keys(data)
    .reverse()
    .map(key => data[key])
  
  let manu = ''

  await foods.map(f => {
    console.log(f.name)
    manu = manu.concat(f.name + ',')
    console.log(manu)
  })
  
  res.send(manu)
})

module.exports = router