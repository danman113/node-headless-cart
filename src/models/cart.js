const dayjs = require('dayjs');
const { v4: uuidv4 } = require('uuid')
const { promisify } = require('util')

const jwt = require('jsonwebtoken')
const sign = promisify(jwt.sign).bind(jwt)

module.exports = class Cart {
  constructor(sellerId) {
    this.cartId = uuidv4()
    this.expires = dayjs().add(1, 'month')
    this.sellerId = sellerId
  }

  async save(db) {
    await db.insert('INSERT INTO cart ("cart_id", "seller_id", "expires") VALUES (?, ?, ?)', this.cartId, this.sellerId, this.expires.toISOString())
  }

  async generateToken() {
    return await sign({
      exp: this.expires.unix(),
      data: this
    }, process.env.JWT_PRIVATE_KEY)
  }

  static fromToken(data) {
    const {
      expires,
      sellerId,
      cartId
    } = data
    const cart = new Cart()
    cart.expires = dayjs(expires)
    cart.sellerId = sellerId
    cart.cartId = cartId
    return cart
  }

  async getCartDetails (db) {
    return await db.getAll(`
      SELECT
        seller.name as seller_name,
        cart_item.quantity as quantity,
        item.name as name,
        item.price as price,
        item.weight as weight,
        item.stock as stock
      from cart
        LEFT JOIN cart_item on cart.cart_id = cart_item.cart_id
        LEFT JOIN item on cart_item.item_id = item.item_id
        LEFT JOIN seller on item.seller_id = seller.seller_id
      WHERE cart.cart_id = $cartId
      ;
    `, { $cartId: this.cartId })
  }

  async verifyItemIsFromSeller (db, itemId, sellerId) {
    db.get('S')
  }

  async upsertItem(db, itemId, quantity) {

    // TODO Make sure that items are from the same seller
    // TODO Make sure that items have sufficient stock when adding to cart
    return await db.update(`
      INSERT OR REPLACE INTO cart_item (cart_item_id, cart_id, item_id, quantity) 
      VALUES ((SELECT cart_item_id FROM cart_item WHERE item_id = $itemId), $cartId, $itemId, $quantity);
    `,
      {
        $itemId: itemId,
        $cartId: this.cartId,
        $quantity: quantity
      }
    )
  }
}
