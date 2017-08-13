const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.argv[2] || process.env.PORT || 4000
const Block = require('./block')
const { createGenesisBlock, createNextBlock } = require('./create')

app.use(bodyParser.json())

let blockchain = []
let ourTransactions = []
let peerNodes = []
let mining = true

const minerAddress = 'q3nf394hjg-random-miner-address-34nf3i4nflkn3oi'

blockchain.push(createGenesisBlock())

app.post('/transaction', (req, res) => {
  const nt = req.body
  ourTransactions.push(JSON.parse(nt))
  console.log(`
    New transaction:
    FROM: ${nt.from}
    TO: ${nt.to}
    AMOUNT: ${nt.amount}
    Submission successful
  `)
})

app.get('/mine', (req, res) => {
  const lastBlock = blockchain[blockchain.length - 1]
  const lastProof = lastBlock.data.proofOfWork
  const proof = proofOfWork(lastProof)

  ourTransactions.push({
    from: 'network',
    to: minerAddress,
    amount: 1
  })

  const newBlockData = {
    proofOfWork: proof,
    transactions: ourTransactions
  }

  const newBlockIndex = lastBlock.index + 1
  const lastBlockHash = lastBlock.hash
  const newBlockTimestamp = new Date()

  ourTransactions = []

  const minedBlock = new Block(newBlockIndex, newBlockData, lastBlockHash)

  res.json({
    index: newBlockIndex,
    timestamp: newBlockTimestamp,
    data: newBlockData,
    hash: lastBlockHash
  })
})

const consensus = () => {
  let otherChains = findNewChains()
  let longestChain = blockchain
  otherChains.forEach((chain) => {
    if (longestChain.length < chain.length) {
      longestChain = chain
    }
  })
  blockchain = longestChain
}

const proofOfWork = (lastProof) => {
  let incrementor = lastProof + 1
  while (!(incrementor % 9 === 0 && incrementor % lastProof === 0)) {
    incrementor += 1
  }
  return incrementor
}

app.listen(port, () => {
  console.log(`listening on ${port}`)
})
