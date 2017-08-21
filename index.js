const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const port = process.argv[2] || process.env.PORT || 4000
const Block = require('./block')
const { createGenesisBlock, createNextBlock } = require('./create')
const minerAddress = require('./address')

app.use(bodyParser.json())

let blockchain = []
let ourTransactions = []
let peerNodes = []
let mining = true

blockchain.push(createGenesisBlock())

app.post('/transaction', (req, res) => {
  const nt = req.body
  ourTransactions.push(nt)
  res.send(`
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

const findNewChains = () => {
  let otherChains = []
  peerNodes.forEach((node) => {
    request({ uri: `${node}/blocks` }, (err, res, body) => {
      if (err) {
        console.warn(err)
        return
      }
      otherChains.push(JSON.parse(body))
    })
  })
  return otherChains
}

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

app.get('/blocks', (req, res) => {
  consensus() // i think this goes here?
  let chainToSend = blockchain
  Array(chainToSend.length).fill().forEach((_, i) => {
    let block = chainToSend[i]
    let blockIndex = block.index
    let blockTimestamp = block.timestamp
    let blockData = block.data
    let blockHash = block.hash
    chainToSend[i] = {
      index: blockIndex,
      timestamp: blockTimestamp,
      data: blockData,
      hash: blockHash
    }
  })
  res.json(chainToSend)
})

app.listen(port, () => {
  console.log(`listening on ${port}`)
})
