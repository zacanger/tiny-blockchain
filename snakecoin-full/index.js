// port of https://gist.github.com/aunyks/47d157f8bc7d1829a729c2a6a919c173 to js

const crypto = require('crypto')
const getHash = (s) => crypto.createHash('sha256').update(s).digest('hex')

class Block {
  constructor (index, data, previousHash) {
    this.index = index
    this.timestamp = new Date()
    this.data = data
    this.previousHash = previousHash
    this.hash = this.generateHash()
  }

  generateHash() {
    const { index, timestamp, data, previousHash } = this
    return getHash(`${index}${timestamp}${data}${previousHash}`)
  }
}

const createGenesisBlock = () => new Block(0, {
  proofOfWork: 9,
  transactions: null
}, '0')

const minerAddress = 'q3nf394hjg-random-miner-address-34nf3i4nflkn3oi'

const createNextBlock = (previousBlock, data = null) => {
  const index = previousBlock.index + 1
  const previousHash = previousBlock.hash
  return new Block(index, data, previousHash)
}

const demo = (n) => {
  const blockchain = [ createGenesisBlock() ]
  let previousBlock = blockchain[0]

  Array(n).fill().forEach(() => {
    const block = createNextBlock(previousBlock)
    blockchain.push(block)
    previousBlock = block

    console.log(`
Block #${block.index} has been added to the blockchain!
Hash: ${block.hash}`
    )
  })
}
