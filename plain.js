require('dotenv').config()
const sqlite = require('sqlite3')
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const key = process.env.KEY
const dbplain = new sqlite.Database('db/plain.db')
const dbenc = new sqlite.Database('db/enc.db')

let encrypt = (text) => {
  let cipher = crypto.createCipher(algorithm, key)
  let crypt = cipher.update(text, 'utf8', 'hex')
  crypt += cipher.final('hex')
  return crypt
}

let decrypt = (text) => {
  let decipher = crypto.createDecipher(algorithm, key)
  let decrypt = decipher.update(text, 'hex', 'utf8')
  decrypt += decipher.final('utf8')
  return decrypt
}

dbplain.serialize(() => {
  dbplain.run('create table lol (info text)')

  let statement = dbplain.prepare('insert into lol values (?)')

  for (let i = 0; i < 10000; i++) {
    statement.run('some text ' + i)
  }

  statement.finalize()
})

dbplain.serialize(() => {
  dbplain.each('select rowid as id, info from lol', (error, row) => {
    console.log(row.id + ': ' + row.info)
  })
})

// 10
// node plain.js  0.10s user 0.03s system 98% cpu 0.129 total
// node plain.js  0.10s user 0.03s system 100% cpu 0.130 total
// node plain.js  0.10s user 0.03s system 99% cpu 0.134 total

// 10,000
// node plain.js  0.57s user 2.99s system 67% cpu 5.283 total
// node plain.js  0.58s user 5.28s system 76% cpu 7.685 total
// node plain.js  0.58s user 4.14s system 72% cpu 6.519 total
// node plain.js  0.57s user 2.86s system 66% cpu 5.148 total
// node plain.js  0.58s user 3.09s system 66% cpu 5.491 total

// 20,000
// node plain.js  1.08s user 8.04s system 70% cpu 12.902 total
// node plain.js  1.14s user 20.00s system 83% cpu 25.181 total
