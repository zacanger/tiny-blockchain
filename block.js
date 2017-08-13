class Block {
  constructor (index, timestamp, data, previousHash) {
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

module.exports = Block
