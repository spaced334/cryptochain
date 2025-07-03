# CryptoChain

A complete blockchain and cryptocurrency implementation built from scratch in JavaScript. This project demonstrates the core concepts behind modern blockchain technology including proof-of-work mining, digital signatures, peer-to-peer networking, and transaction processing.

## Overview

CryptoChain is an educational blockchain project that implements a fully functional cryptocurrency system. It includes all the essential components found in real-world blockchains like Bitcoin and Ethereum, making it perfect for understanding how blockchain technology works under the hood.

## Features

- **Complete Blockchain Implementation**: Immutable chain of blocks with cryptographic linking
- **Proof-of-Work Mining**: Secure consensus mechanism with adjustable difficulty
- **Digital Wallet System**: Public/private key cryptography for secure transactions
- **Transaction Processing**: Create, sign, and validate cryptocurrency transactions
- **Peer-to-Peer Network**: Distributed nodes that sync blockchain state
- **REST API**: Easy-to-use web interface for blockchain interaction
- **Comprehensive Testing**: Full test suite ensuring reliability

## Technology Stack

- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Web framework for REST API endpoints
- **Redis**: Pub/sub messaging for peer-to-peer communication
- **Elliptic**: Cryptographic library for digital signatures
- **Jest**: Testing framework for automated testing
- **UUID**: Unique identifier generation for transactions

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Redis server (optional for single-node testing)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cryptochain
```

2. Install dependencies:
```bash
npm install
```

3. Run tests to verify installation:
```bash
npm test
```

### Running the Application

#### Single Node (Local Testing)
```bash
npm run start-local
```

#### Multiple Nodes (Full Network)
```bash
# Terminal 1 - Start Redis
npm run start-redis

# Terminal 2 - Start main node
npm start

# Terminal 3 - Start peer node
npm run dev-peer
```

The application will be available at `http://localhost:3000`

## API Reference

### Blockchain Operations

#### View Blockchain
```
GET /api/blocks
```
Returns the complete blockchain as JSON.

#### Mine a Block
```
POST /api/mine
Content-Type: application/json

{
    "data": "Block data to store"
}
```
Mines a new block with the provided data.

### Transaction Operations

#### Create Transaction
```
POST /api/transact
Content-Type: application/json

{
    "amount": 100,
    "recipient": "recipient-public-key"
}
```
Creates a new transaction from your wallet.

#### View Transaction Pool
```
GET /api/transaction-pool-map
```
Returns all pending transactions waiting to be mined.

#### Mine Transactions
```
GET /api/mine-transactions
```
Mines all pending transactions into a new block.

### Wallet Operations

#### View Wallet Information
```
GET /api/wallet-info
```
Returns your wallet's public key and current balance.

## Project Structure

```
cryptochain/
├── app/
│   ├── pubsub.js              # Redis-based peer communication
│   ├── pubsub.local.js        # Local testing without Redis
│   └── transaction-miner.js   # Transaction mining logic
├── blockchain/
│   ├── block.js               # Block structure and mining
│   ├── index.js               # Blockchain class
│   └── *.test.js              # Blockchain tests
├── wallet/
│   ├── index.js               # Wallet implementation
│   ├── transaction.js         # Transaction structure
│   ├── transaction-pool.js    # Transaction management
│   └── *.test.js              # Wallet tests
├── utils/
│   ├── crypto-hash.js         # Cryptographic utilities
│   └── index.js               # Utility exports
├── scripts/
│   └── average-work.js        # Mining analysis tools
├── config.js                  # System configuration
├── index.js                   # Main application server
└── package.json               # Dependencies and scripts
```

## Core Concepts

### Blockchain
The blockchain is a linked list of blocks, where each block contains:
- Transaction data
- Cryptographic hash of the previous block
- Timestamp
- Proof-of-work nonce
- Mining difficulty

### Mining
Mining uses a proof-of-work algorithm where miners compete to find a nonce that produces a hash starting with a specific number of zeros. The difficulty adjusts automatically to maintain consistent block times.

### Digital Signatures
Each wallet has a public/private key pair generated using elliptic curve cryptography. Transactions are signed with the private key and verified using the public key, ensuring only the wallet owner can spend their funds.

### Peer-to-Peer Network
Nodes communicate using Redis pub/sub messaging to broadcast new blocks and transactions. When a node receives a longer valid chain, it replaces its local chain to maintain consensus.

## Testing

The project includes comprehensive tests for all major components:

```bash
# Run all tests
npm test

# Run tests with detailed output
npm test -- --verbose

# Run specific test file
npm test block
```

Test files are located alongside their corresponding implementation files and follow the naming convention `*.test.js`.

## Development

### Running in Development Mode
```bash
npm run dev-local    # Local mode with auto-restart
npm run dev          # Full network mode with auto-restart
```

### Configuration
Key configuration values are defined in `config.js`:
- `INITIAL_DIFFICULTY`: Starting mining difficulty
- `MINE_RATE`: Target time between blocks (milliseconds)
- `STARTING_BALANCE`: Initial wallet balance
- `MINING_REWARD`: Reward for successfully mining a block

### Adding Features
The codebase is modular and extensible. Common enhancements include:
- Additional consensus algorithms
- Smart contract functionality
- Advanced transaction types
- Web-based user interface
- Mobile applications

## Security Considerations

This implementation includes several security measures:
- Cryptographic hashing for data integrity
- Digital signatures for transaction authentication
- Proof-of-work for consensus security
- Chain validation to prevent tampering
- Transaction validation to prevent double-spending

However, this is an educational project and should not be used in production without additional security hardening.

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request with a clear description

## License

This project is licensed under the ISC License. See the package.json file for details.

## Acknowledgments

This project demonstrates concepts from modern blockchain systems and serves as an educational resource for understanding cryptocurrency technology. It implements patterns and algorithms used in production blockchains while maintaining simplicity for learning purposes.

## Support

For questions or issues, please review the comprehensive project guide included in the repository or create an issue in the project's issue tracker.
