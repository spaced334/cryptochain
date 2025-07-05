const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../utils');

class Wallet{
    constructor() {
        this.balance = STARTING_BALANCE;
        
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({ amount, recipient, chain }) {
        if(chain) {
            this.balance = Wallet.calculateBalance({ chain, address: this.publicKey });
        }

        if (amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }

    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputsTotal = 0;

        for (let i = chain.length - 1; i > 0; i--) {
            const block = chain[i];

            // Check if block.data is an array of transactions
            if (Array.isArray(block.data)) {
                for (let transaction of block.data) {
                    // Ensure transaction has the expected structure
                    if (transaction && transaction.input && transaction.outputMap) {
                        if (transaction.input.address === address) {
                            hasConductedTransaction = true;
                        }

                        const addressOutput = transaction.outputMap[address];

                        if (addressOutput) {
                            outputsTotal = outputsTotal + addressOutput;
                        }
                    }
                }
            }
            // If block.data is not an array (e.g., custom data from mining), skip this block

            if (hasConductedTransaction) {
                break;
            }
        }

        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
    }
};

module.exports = Wallet;