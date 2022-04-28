const database = require('better-sqlite3')

const logdb = new database('log.db') 

const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`)

let row = stmt.get()

module.exports = logdb 