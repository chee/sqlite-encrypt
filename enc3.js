require('dotenv').config()
const sqlite = require('sqlite3')
const crypto = require('crypto-js')
const key = process.env.KEY
const dbplain = new sqlite.Database('db/plain.db')
const dbenc = new sqlite.Database('db/enc.db')

let encrypt = (text) => {
  return crypto.AES.encrypt(text, key).toString()
}

let decrypt = (text) => {
  return crypto.AES.decrypt(text, key).toString(crypto.enc.Utf8)
}

dbenc.serialize(() => {
  dbenc.run('create table lol (info text)')

  let statement = dbenc.prepare('insert into lol values (?)')

  for (let i = 0; i < 10000; i++) {
    statement.run(encrypt('some new text ' + i))
  }

  statement.finalize()
})

dbenc.serialize(() => {
  dbenc.each('select rowid as id, info from lol', (error, row) => {
    console.log(row.id + ': ' + decrypt(row.info))
  })
})

// node enc3.js  7.94s user 3.66s system 84% cpu 13.766 total
// node enc3.js  7.73s user 10.65s system 89% cpu 20.555 total
// node enc3.js  7.72s user 3.41s system 85% cpu 13.094 total
// node enc3.js  7.67s user 5.72s system 87% cpu 15.338 total
// node enc3.js  7.53s user 9.03s system 88% cpu 18.643 total
