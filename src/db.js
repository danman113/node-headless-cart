const sqlite3 = require('sqlite3').verbose();
const { readFileSync } = require('fs');
const { promisify } = require('util')
const { isDev } = require('./utils')

class DB {
  constructor() {
    this.db = new sqlite3.Database(process.env.DB_FILENAME)
    this._run = promisify(this.db.run).bind(this.db)
    this._get = promisify(this.db.get).bind(this.db)
    this._getAll = promisify(this.db.all).bind(this.db)
    if (isDev()) this.db.run(readFileSync('init-db.sql', { encoding: 'utf-8' }))
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