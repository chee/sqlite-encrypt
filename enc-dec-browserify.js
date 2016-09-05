require('dotenv').config()
const sqlite = require('sqlite3')
const crypto = require('crypto-browserify')
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

// node enc-dec-browserify.js  0.96s user 3.48s system 67% cpu 6.585 total
// node enc-dec-browserify.js  0.91s user 3.21s system 68% cpu 5.993 total
// node enc-dec-browserify.js  0.92s user 3.29s system 69% cpu 6.105 total
// node enc-dec-browserify.js  0.95s user 4.70s system 73% cpu 7.690 total
// node enc-dec-browserify.js  0.91s user 3.36s system 69% cpu 6.166 total
