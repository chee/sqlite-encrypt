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

// 10
// node enc3.js  0.15s user 0.09s system 100% cpu 0.240 total
// node enc3.js  0.15s user 0.03s system 100% cpu 0.179 total
// node enc3.js  0.15s user 0.03s system 99% cpu 0.183 total

// 10,000
// node enc3.js  7.94s user 3.66s system 84% cpu 13.766 total
// node enc3.js  8.04s user 4.66s system 83% cpu 15.122 total
// node enc3.js  7.72s user 3.41s system 85% cpu 13.094 total
// node enc3.js  7.67s user 5.72s system 87% cpu 15.338 total
// node enc3.js  7.53s user 9.03s system 88% cpu 18.643 total

// 20,000
// node enc3.js  15.31s user 10.22s system 86% cpu 29.537 total
// node enc3.js  14.67s user 7.67s system 84% cpu 26.328 total
