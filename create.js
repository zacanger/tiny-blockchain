const Block = require('./block')

const createGenesisBlock = () =>
  new Block(0, new Date(), { proofOfWork: 9, transactions: null }, '0')

const createNextBlock = (previousBlock, data = null) =>
  new Block(previousBlock.index + 1, data, previousBlock.hash)

module.exports = {
  createGenesisBlock,
  createNextBlock
}
