const crypto = require('crypto')
const getRandomString = () => crypto.randomBytes(16).toString('hex')
const minerAddress = process.env.MINER_ADDRESS || getRandomString()

module.exports = minerAddress
