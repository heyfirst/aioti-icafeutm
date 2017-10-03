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

router.route('/menus').get(async (req, res) => {
  let data = await firebase.foodRef.once('value').then(snapshot => snapshot.val())
  const foods = Object.keys(data)
    .reverse()
    .map(key => data[key])
  
  let manu = []
  
  ingredients = req.query.ingredients
  
  if(ingredients === undefined) {
    await foods.map(food => {
      manu.push(food.name)
    })
  } else {
    ingredients = ingredients.split(',')
    if(ingredients[0] !== '') {
      await foods.map(food => {
        ingredients.map(ingredient => {
          if(food.ingredients.indexOf(ingredient) !== -1 && manu.indexOf(food.name) === -1){
            manu.push(food.name)
          }
        })
      })
    } else {
      await foods.map(food => {
        manu.push(food.name)
      })
    }
  }
  
  res.send(manu.join(','))
})

router.route('/order/new').get((req, res) => {
  let order = {
    table: req.query.table,
    menus: [],
    payment: false
  }

  req.query.menus.split('|').map(menu => {
    order.menus.push({
      food: menu.split(',')[0],
      quantity: menu.split(',')[1]
    })
  })

  let key = firebase.orderRef.push(order).key
  res.send(''+key)
})

router.route('/order/update').get( async (req, res) => {
  let data = await firebase.orderRef.once('value').then(snapshot => snapshot.val())
  
  let order = data[req.query.orderId]

  order.menus = await req.query.menus.split('|').map(menu => 
  ({
    food: menu.split(',')[0],
    quantity: menu.split(',')[1]
  }))

  await firebase.orderRef.child(`/${req.query.orderId}`).update(order)

  res.send(req.query.orderId)
})

router.route('/payment/:orderId').get( async (req, res) => {
  let orderId = req.params.orderId
  let raworders = await firebase.orderRef.once('value').then(snapshot => snapshot.val())
  let order = raworders[orderId]

  let rawfoods = await firebase.foodRef.once('value').then(snapshot => snapshot.val())

  const foods = Object.keys(rawfoods)
    .reverse()
    .map(key => rawfoods[key])
  
  let total = 0;
  await order.menus.map(m => {
    let food = foods.find(f => f.name === m.food)
    total += food.price * m.quantity
  })

  total = Math.round(total * 100) / 100
  res.send('' + ((total%1 > 0) ? total+'0' : total+'.00') )

})

router.route('/payment/:orderId/completed').get( async (req, res) => {
  let orderId = req.params.orderId
  let data = await firebase.orderRef.once('value').then(snapshot => snapshot.val())
  let order = data[orderId]

  order.payment = true

  await firebase.orderRef.child(`/${orderId}`).update(order)
  
  res.send(order.payment)
})

router.route('/payment/:orderId/status').get( async (req, res) => {
  let orderId = req.params.orderId
  let data = await firebase.orderRef.once('value').then(snapshot => snapshot.val())
  let order = data[orderId]

  res.send(order.payment)
})

router.route('/table/:orderId').get( async (req, res) => {
  let orderId = req.params.orderId
  let data = await firebase.orderRef.once('value').then(snapshot => snapshot.val())
  let order = data[orderId]

  res.send(order.table)
})

module.exports = router