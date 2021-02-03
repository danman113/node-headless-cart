const Joi = require('joi')
const express = require('express')
const requiresCart = require('../middleware/requiresCart')
const router = express.Router()

router.get('/', requiresCart, async (req, res) => {
  try {
    const cartItems = await req.cart.getCartDetails(db)
    res.status(200).json(cartItems)
  } catch (e) {
    res.status(500).send(e)
  }
})

const createCartSchema = Joi.object({
  sellerId: Joi.number().required()
})

router.post('/', async (req, res) => {
  const { value: { sellerId }, error } = createCartSchema.validate(req.body)
  if (error) throw new Error(error)
  try {
    const cart = new Cart(sellerId)
    await cart.save(db)
    const cookie = await cart.generateToken()
    setCookie(res, process.env.COOKIE_ID_CART, cookie, cart.expires.toDate())
    res.status(200).json(cart)
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
})

const upsertItemSchema = Joi.object({
  itemId: Joi.number().required(),
  quantity: Joi.number().max(1000).min(1).required()
})

router.post('/item', requiresCart, async (req, res) => {
  const { values: { itemId, quantity }, error } = upsertItemSchema.validate(req.body)
  if (error) throw new Error(error)
  try {
    const item = await req.cart.upsertItem(db, itemId, quantity)
    res.status(201).json(item)
  } catch (e) {
    console.error(e)
    res.status(500).json({
      error: e.message
    })
  }
})

module.exports = router