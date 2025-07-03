const bodyParser = require('body-parser');
const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

// Use local PubSub if environment variable is set or Redis is not available
let PubSub;
if (process.env.USE_LOCAL_PUBSUB === 'true') {
    PubSub = require('./app/pubsub.local');
} else {
    try {
        PubSub = require('./app/pubsub');
    } catch (error) {
        console.log('Redis not available, using local PubSub');
        PubSub = require('./app/pubsub.local');
    }
}

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());

// Root route - API documentation
app.get('/', (req, res) => {
    res.json({
        message: 'CryptoChain API',
        endpoints: {
            'GET /api/blocks': 'View the blockchain',
            'POST /api/mine': 'Mine a new block (body: {"data": "your data"})',
            'POST /api/transact': 'Create a transaction (body: {"amount": 100, "recipient": "address"})',
            'GET /api/transaction-pool-map': 'View pending transactions',
            'GET /api/mine-transactions': 'Mine all pending transactions',
            'GET /api/wallet-info': 'View wallet information'
        },
        wallet: {
            address: wallet.publicKey,
            balance: wallet.balance
        }
    });
});

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    pubsub.broadcastChain();
    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { amount, recipient } = req.body;
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey});

    try{
        if(transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        }
        else {
            transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
        }
    }
    catch(error) {
        return res.status(400).json({ type: "error", message: error.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;
    res.json({
        address,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
    });
});

const syncWithRootState = () => {
    request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('Replace chain on sync with: ', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);
            console.log('Replace transaction pool map on sync with: ', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Listening at localhost:${PORT}`);

    if(PORT !== DEFAULT_PORT){
        syncWithRootState();
    }
});