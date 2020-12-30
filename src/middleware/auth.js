const jwt = require('jsonwebtoken')
const Cart = require('../models/cart')
const { promisify } = require('util')
const verify = promisify(jwt.verify).bind(jwt)

module.exports = async (req, res, next) => {
  const cartCookie = req.cookies[process.env.COOKIE_ID_CART]
  try {
    if (cartCookie) {
      const { data } = await verify(cartCookie, process.env.JWT_PRIVATE_KEY)
      req.cart = Cart.fromToken(data)
    } else {
      throw new Error('Cookie not found')
    }
  } catch (e) {
    console.error(e)
    return res.status(403).json({
      error: 'Authentication cookie missing, expired or malformed'
    })
  }
  next()
}