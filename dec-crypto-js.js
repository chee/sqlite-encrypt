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
// node dec-crypto-js.js  4.58s user 0.30s system 96% cpu 5.056 total
// node dec-crypto-js.js  4.76s user 0.30s system 94% cpu 5.355 total
// node dec-crypto-js.js  4.46s user 0.31s system 96% cpu 4.939 total

// 20,000
// node dec-crypto-js.js  8.59s user 0.58s system 94% cpu 9.667 total
// node dec-crypto-js.js  8.42s user 0.57s system 96% cpu 9.302 total
// node dec-crypto-js.js  8.24s user 0.52s system 96% cpu 9.043 total
