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

// node enc.js  0.87s user 3.08s system 68% cpu 5.763 total
// node enc.js  0.87s user 5.47s system 77% cpu 8.158 total
// node enc.js  0.88s user 4.16s system 73% cpu 6.848 total
// node enc.js  0.89s user 3.99s system 71% cpu 6.815 total
// node enc.js  0.88s user 3.02s system 69% cpu 5.627 total
