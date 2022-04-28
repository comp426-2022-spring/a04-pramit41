const database = require('better-sqlite3')

const logdb = new database('log.db') 

const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`)

let row = stmt.get()

if(row == undefined){
    console.log('Your database appears to be empty. I will initialize it now.')
} else {
    console.log('Database exits')
}

module.exports = logdb 