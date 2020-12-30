require('dotenv').config()
const app = require('express')()
const db = require('./db')
const authMiddleware = require('./middleware/auth')
const cookieParser = require('cookie-parser')

const Cart = require('./models/cart')
const { setCookie } = require('./utils')

console.log(authMiddleware)

app.use(cookieParser(process.env.COOKIE_SECRET))

app.get('/items/:sellerId', async (req, res) => {
  try {
    const items = await db.getAll('SELECT * FROM item WHERE item.seller_id = ?;', req.params.sellerId)
    res.status(200).json(items)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
})

app.get('/cart/', authMiddleware, async (req, res) => {
  console.log('====', req.cart)
  try {
    const cartItems = await req.cart.getCartDetails(db)
    res.status(200).json(cartItems)
  } catch (e) {
    res.status(500).send(e)
  }
})


// TODO Make everything REST compliant
app.get('/cart/item', authMiddleware, async (req, res) => {
  const { itemId, quantity } = req.query
  try {
    const item = await req.cart.upsertItem(db, itemId, quantity)
    res.status(201).json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
})

app.get('/cart/:sellerId', async (req, res) => {
  try {
    const cart = new Cart(req.params.sellerId)
    await cart.save(db)
    const cookie = await cart.generateToken()
    setCookie(res, process.env.COOKIE_ID_CART, cookie, cart.expires.toDate())
    res.status(200).json(cart)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
})

const port = process.env.PORT || 9001
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})