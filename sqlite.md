# Ways to create an encrypted database
* Use the sqlcipher plugin that has a bug list containing bugs that are pointers to other lists of bugs
* decrypt the whole database before every transaction and encrypt it after every transaction
* http://www.cs.uml.edu/~ge/pdf/icde07_ge.pdf
* encrypt the rows in the database
  - server generates key
    + sends it over ssl
    + it is stored in encrypted key/value store (https://github.com/Crypho/cordova-plugin-secure-storage)
  - server sends data down encrypted with the key
  - client stores all data in sqlite database
  - decrypt keys on retrieval

it will probably depend on how big the transactions are

if they are small transactions, then decrypting each row will be faster

if they are big transactions, decrypting the whole database then doing the transaction then re-encrypting would be faster

although if you needed to do another query while it was still re-encrypting that would be a problem

plus if you decrypt the whole database the whole database would have to fit in memory

row-by-row decryption natively is almost free (apparently because the crypto beats disk latency)
row-by-row decryption in pure javascript is about 10 times slower

could theoretically build a cordova plugin that uses the native language to encrypt/decrypt (java for android, swift for iOS, c#??? for windows) but this is probably too much
