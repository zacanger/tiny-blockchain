const Block = require('./block')

const createGenesisBlock = () =>
  new Block(0, new Date(), { proofOfWork: 9, transactions: null }, '0')

const createNextBlock = (previousBlock, data = null) => {
  const index = previousBlock.index + 1
  const previousHash = previousBlock.hash
  return new Block(index, data, previousHash)
}

module.exports = {
  createGenesisBlock,
  createNextBlock
}
