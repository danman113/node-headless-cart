const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util')

class DB {
  constructor() {
    this.db = new sqlite3.Database(process.env.DB_FILENAME)
    this._run = promisify(this.db.run).bind(this.db)
    this._get = promisify(this.db.get).bind(this.db)
    this._getAll = promisify(this.db.all).bind(this.db)
  }

  async update (query, ...args) {
    return await this._run(query, ...args)
  }

  async insert (query, ...args) {
    return await this._run(query, ...args)
  }

  async getOne (query, ...args) {
    return this._get(query, ...args)
  }

  async getAll (query, ...args) {
    return this._getAll(query, ...args)
  }
}


module.exports = new DB()