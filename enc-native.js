require('dotenv').config()
const sqlite = require('sqlite3')
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const key = process.env.KEY
const dbplain = new sqlite.Database('db/plain.db')
const dbenc = new sqlite.Database('db/enc.db')

let decrypt = (text) => {
  let decipher = crypto.createDecipher(algorithm, key)
  let decrypt = decipher.update(text, 'hex', 'utf8')
  decrypt += decipher.final('utf8')
  return decrypt
}

dbenc.serialize(() => {
  dbenc.each('select rowid as id, info from lol', (error, row) => {
    console.log(row.id + ': ' + decrypt(row.info))
  })
})

// 10,000
// node enc-native.js  0.44s user 0.08s system 102% cpu 0.508 total
// node enc-native.js  0.43s user 0.07s system 100% cpu 0.505 total
// node enc-native.js  0.47s user 0.08s system 98% cpu 0.554 total
