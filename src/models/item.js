class Item {
  static getAll(db) {
    return await db.getAll(`
      SELECT * FROM item
      LEFT JOIN ON seller WHERE item.seller_id = seller.seller_id
    `)
  }
}