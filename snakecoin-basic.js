// https://gist.github.com/aunyks/8f2c2fd51cc17f342737917e1c2582e2 in js

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

const createGenesisBlock = () => new Block(0, 'Genesis Block', '0')

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

demo(parseInt(process.argv[2] || 10, 10))
