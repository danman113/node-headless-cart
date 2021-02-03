require('dotenv').config()
const app = require('express')()
const db = require('./db')
const authMiddleware = require('./middleware/requiresCart')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cartRouter = require('./controllers/cart')
const errorHandler = require('./middleware/errorHandler')

const port = process.env.PORT || 9001
app
  .use(bodyParser.json())
  .use(cookieParser(process.env.COOKIE_SECRET))
  .use('/cart', cartRouter)
  .use(errorHandler)
  .listen(port, () => {
    console.log(`App listening on port ${port}`)
  })