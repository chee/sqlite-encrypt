require('dotenv').config()
const sqlite = require('sqlite3')
const crypto = require('crypto-js')
const key = process.env.KEY
const dbplain = new sqlite.Database('db/plain.db')
const dbenc = new sqlite.Database('db/enc.db')

let decrypt = (text) => {
  return crypto.AES.decrypt(text, key).toString(crypto.enc.Utf8)
}

dbenc.serialize(() => {
  dbenc.each('select rowid as id, info from lol', (error, row) => {
    console.log(row.id + ': ' + decrypt(row.info))
  })
})

// 10,000
// node enc-crypto-js.js  4.58s user 0.30s system 96% cpu 5.056 total
// node enc-crypto-js.js  4.76s user 0.30s system 94% cpu 5.355 total
// node enc-crypto-js.js  4.46s user 0.31s system 96% cpu 4.939 total
