// Local PubSub implementation for testing without Redis
class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        console.log('Using local PubSub (no Redis required)');
    }

    broadcastChain() {
        console.log('Broadcasting blockchain update (local mode)');
        // In local mode, we don't actually broadcast to other nodes
    }

    broadcastTransaction(transaction) {
        console.log('Broadcasting transaction (local mode):', transaction.id);
        // In local mode, we don't actually broadcast to other nodes
    }
}

module.exports = PubSub;
