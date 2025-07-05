# CryptoChain Complete Testing Walkthrough

This guide provides a comprehensive step-by-step walkthrough to test every functionality of your CryptoChain blockchain implementation.

## Prerequisites

Before starting, ensure you have:
- Node.js installed
- The project dependencies installed (`npm install`)
- Thunder Client extension in VS Code (or any API testing tool)

## Step 1: Start the Application

Open your terminal and navigate to the project directory:

```bash
cd "c:\Users\sukhb\OneDrive\Desktop\cryptochain\cryptochain"
```

Start the application in local mode (no Redis required):
```bash
npm run start-local
```

You should see:
```
Using local PubSub (no Redis required)
Listening at localhost:3000
```

## Step 2: Initial System Check

### Test 1: API Documentation
**Purpose**: Verify the application is running and see available endpoints

**Method**: GET  
**URL**: `http://localhost:3000/`

**Expected Response**:
```json
{
  "message": "CryptoChain API",
  "endpoints": {
    "GET /api/blocks": "View the blockchain",
    "POST /api/mine": "Mine a new block (body: {\"data\": \"your data\"})",
    "POST /api/transact": "Create a transaction (body: {\"amount\": 100, \"recipient\": \"address\"})",
    "GET /api/transaction-pool-map": "View pending transactions",
    "GET /api/mine-transactions": "Mine all pending transactions",
    "GET /api/wallet-info": "View wallet information"
  },
  "wallet": {
    "address": "04...", // Your wallet's public key
    "balance": 1000
  }
}
```

**What to verify**:
- Application is running
- Your wallet address is displayed
- Starting balance is 1000 (as configured)

## Step 3: Blockchain Operations

### Test 2: View Initial Blockchain
**Purpose**: See the genesis block (the first block in every blockchain)

**Method**: GET  
**URL**: `http://localhost:3000/api/blocks`

**Expected Response**:
```json
[
  {
    "timestamp": 1,
    "lastHash": "-----",
    "hash": "hash-one", 
    "nonce": 0,
    "difficulty": 3,
    "data": []
  }
]
```

**What to verify**:
- Blockchain starts with exactly one block (genesis block)
- Genesis block has timestamp: 1, lastHash: "-----", empty data array
- This proves your blockchain is properly initialized

### Test 3: Mine Your First Block
**Purpose**: Add a new block to the blockchain with custom data

**Method**: POST  
**URL**: `http://localhost:3000/api/mine`  
**Headers**: `Content-Type: application/json`  
**Body**:
```json
{
  "data": "Hello CryptoChain! This is my first block."
}
```

**Expected Response**: 
- Redirects to `/api/blocks` showing updated blockchain

**What to verify**:
- New block is added to the chain
- Block contains your data
- Block has proper hash linking to genesis block
- Mining difficulty and nonce values are present

### Test 4: Verify Block Addition
**Purpose**: Confirm the new block was properly added

**Method**: GET  
**URL**: `http://localhost:3000/api/blocks`

**Expected Response**:
```json
[
  {
    "timestamp": 1,
    "lastHash": "-----", 
    "hash": "hash-one",
    "nonce": 0,
    "difficulty": 3,
    "data": []
  },
  {
    "timestamp": 1625097600000, // Current timestamp
    "lastHash": "hash-one", // Links to genesis block
    "hash": "000abc...", // New hash starting with zeros
    "nonce": 12345, // Number found during mining
    "difficulty": 3,
    "data": "Hello CryptoChain! This is my first block."
  }
]
```

**What to verify**:
- Blockchain now has 2 blocks
- Second block's `lastHash` matches first block's `hash`
- Second block's hash starts with zeros (proof-of-work)
- Your data is stored in the second block

## Step 4: Wallet Operations

### Test 5: Check Wallet Information
**Purpose**: View your wallet details and balance

**Method**: GET  
**URL**: `http://localhost:3000/api/wallet-info`

**Expected Response**:
```json
{
  "address": "04a1b2c3d4e5f6...", // Your public key (long hex string)
  "balance": 1000
}
```

**What to verify**:
- Wallet has a unique public key address
- Balance is 1000 (starting balance from config)
- Address is a long hexadecimal string (public key)

## Step 5: Transaction System Testing

### Test 6: Create Your First Transaction  
**Purpose**: Send cryptocurrency to another address

**Method**: POST  
**URL**: `http://localhost:3000/api/transact`  
**Headers**: `Content-Type: application/json`  
**Body**:
```json
{
  "amount": 250,
  "recipient": "04recipient-public-key-here-fake-address-for-testing-123456789"
}
```

**Expected Response**:
```json
{
  "type": "success",
  "transaction": {
    "id": "abc123-def456-ghi789", // Unique transaction ID
    "outputMap": {
      "04recipient-public-key-here-fake-address-for-testing-123456789": 250,
      "04a1b2c3d4e5f6...": 750 // Your remaining balance
    },
    "input": {
      "timestamp": 1625097600000,
      "amount": 1000, // Your balance before transaction
      "address": "04a1b2c3d4e5f6...", // Your public key
      "signature": "..." // Cryptographic signature
    }
  }
}
```

**What to verify**:
- Transaction has unique ID
- outputMap shows recipient gets 250, you keep 750
- input shows your original balance (1000) and signature
- Transaction is cryptographically signed

### Test 7: View Transaction Pool
**Purpose**: See pending transactions waiting to be mined

**Method**: GET  
**URL**: `http://localhost:3000/api/transaction-pool-map`

**Expected Response**:
```json
{
  "abc123-def456-ghi789": {
    "id": "abc123-def456-ghi789",
    "outputMap": {
      "04recipient-public-key-here-fake-address-for-testing-123456789": 250,
      "04a1b2c3d4e5f6...": 750
    },
    "input": {
      "timestamp": 1625097600000,
      "amount": 1000,
      "address": "04a1b2c3d4e5f6...",
      "signature": "..."
    }
  }
}
```

**What to verify**:
- Transaction pool contains your transaction
- Transaction details match what you created
- Transaction is waiting to be mined into a block

### Test 8: Create Multiple Transactions
**Purpose**: Test multiple transactions and transaction updates

**Transaction 2**:
**Method**: POST  
**URL**: `http://localhost:3000/api/transact`  
**Body**:
```json
{
  "amount": 100,
  "recipient": "04another-recipient-address-different-from-first-one-testing"
}
```

**Transaction 3** (to same recipient as Transaction 1):
**Method**: POST  
**URL**: `http://localhost:3000/api/transact`  
**Body**:
```json
{
  "amount": 50,
  "recipient": "04recipient-public-key-here-fake-address-for-testing-123456789"
}
```

**What to verify**:
- Each transaction gets a unique ID
- Transaction pool accumulates multiple transactions
- Transactions to the same recipient update the existing transaction

### Test 9: Check Updated Transaction Pool
**Purpose**: Verify multiple transactions are properly managed

**Method**: GET  
**URL**: `http://localhost:3000/api/transaction-pool-map`

**What to verify**:
- Multiple transactions in the pool
- Each transaction has proper balance calculations
- Transactions are properly formatted and signed

## Step 6: Mining System Testing

### Test 10: Mine Pending Transactions
**Purpose**: Process all pending transactions into a new block

**Method**: GET  
**URL**: `http://localhost:3000/api/mine-transactions`

**Expected Behavior**:
- Server processes all transactions in the pool
- Creates a new block containing the transactions
- Adds mining reward transaction
- Clears the transaction pool
- Redirects to show updated blockchain

**What to verify**:
- New block is added to blockchain
- Block contains your transactions
- Mining reward transaction is included
- Transaction pool is cleared

### Test 11: Verify Mined Block
**Purpose**: Confirm transactions were properly mined

**Method**: GET  
**URL**: `http://localhost:3000/api/blocks`

**What to look for in the latest block**:
```json
{
  "timestamp": 1625097700000,
  "lastHash": "000abc...", // Hash of previous block
  "hash": "000def...", // New hash with proof-of-work
  "nonce": 23456,
  "difficulty": 3,
  "data": [
    {
      // Your transaction 1
      "id": "abc123-def456-ghi789",
      "outputMap": {...},
      "input": {...}
    },
    {
      // Your transaction 2  
      "id": "def456-ghi789-jkl012",
      "outputMap": {...},
      "input": {...}
    },
    {
      // Mining reward transaction
      "id": "mining-reward-xyz",
      "outputMap": {
        "04a1b2c3d4e5f6...": 50 // Mining reward to your address
      },
      "input": {
        "address": "*authorized-reward*" // Special mining address
      }
    }
  ]
}
```

**What to verify**:
- Block contains all your transactions
- Mining reward transaction is present
- All transactions have proper structure
- Block is properly linked to previous block

### Test 12: Verify Empty Transaction Pool
**Purpose**: Confirm transactions were removed from pool after mining

**Method**: GET  
**URL**: `http://localhost:3000/api/transaction-pool-map`

**Expected Response**:
```json
{}
```

**What to verify**:
- Transaction pool is empty
- All transactions were successfully mined

### Test 13: Check Updated Wallet Balance
**Purpose**: Verify your balance reflects transactions and mining reward

**Method**: GET  
**URL**: `http://localhost:3000/api/wallet-info`

**Expected Balance Calculation**:
- Starting balance: 1000
- Sent in transactions: -250 - 100 - 50 = -400
- Mining reward: +50
- Final balance: 1000 - 400 + 50 = 650

**Expected Response**:
```json
{
  "address": "04a1b2c3d4e5f6...",
  "balance": 650
}
```

**What to verify**:
- Balance correctly reflects all transactions
- Mining reward is included
- Balance calculation is accurate

## Step 7: Advanced Testing Scenarios

### Test 14: Test Invalid Transactions

**Test 14a: Insufficient Balance**
**Method**: POST  
**URL**: `http://localhost:3000/api/transact`  
**Body**:
```json
{
  "amount": 1000,
  "recipient": "04test-recipient-address"
}
```

**Expected Response**:
```json
{
  "type": "error", 
  "message": "Amount exceeds balance"
}
```

**Test 14b: Invalid Amount (Negative)**
**Method**: POST  
**URL**: `http://localhost:3000/api/transact`  
**Body**:
```json
{
  "amount": -100,
  "recipient": "04test-recipient-address"
}
```

**Expected Response**: Error or rejection

**What to verify**:
- System properly validates transaction amounts
- Error messages are clear and helpful
- Invalid transactions are rejected

### Test 15: Mine Additional Blocks
**Purpose**: Test continuous blockchain growth

**Create more transactions and mine them**:
1. Create 2-3 more transactions
2. Mine them with `GET /api/mine-transactions`
3. Verify blockchain growth with `GET /api/blocks`

**What to verify**:
- Each new block properly links to the previous
- Block height increases
- All transactions are properly recorded

### Test 16: Mine Blocks with Custom Data
**Purpose**: Test direct block mining (non-transaction data)

**Method**: POST  
**URL**: `http://localhost:3000/api/mine`  
**Body**:
```json
{
  "data": "Testing direct block mining - Block #4"
}
```

**What to verify**:
- Block is added with custom data
- Block doesn't contain transactions (just the string data)
- Blockchain maintains integrity

## Step 8: System Integrity Testing

### Test 17: Verify Blockchain Integrity
**Purpose**: Ensure the entire blockchain is valid

**Method**: GET  
**URL**: `http://localhost:3000/api/blocks`

**Manual Verification Steps**:
1. **Check Genesis Block**: First block should have standard genesis properties
2. **Verify Chain Linking**: Each block's `lastHash` should match the previous block's `hash`
3. **Verify Timestamps**: Timestamps should be in chronological order
4. **Check Hash Format**: All hashes should start with zeros (proof-of-work)
5. **Verify Data Integrity**: All transaction data should be present and properly formatted

### Test 18: Performance Testing
**Purpose**: Test system under load

**Rapid Transaction Creation**:
Create 5-10 transactions quickly:
```json
{"amount": 10, "recipient": "recipient1"}
{"amount": 20, "recipient": "recipient2"} 
{"amount": 15, "recipient": "recipient3"}
// ... continue
```

**What to verify**:
- System handles multiple rapid requests
- All transactions are properly recorded
- No data corruption occurs
- Mining processes all transactions correctly

## Step 9: Final Verification

### Test 19: Complete System State Check
**Purpose**: Verify final state of all components

**Check Blockchain**:
- `GET /api/blocks` - Should show complete chain with all blocks

**Check Wallet**:
- `GET /api/wallet-info` - Should show correct final balance

**Check Transaction Pool**:
- `GET /api/transaction-pool-map` - Should be empty (or contain only recent unmined transactions)

### Test 20: Restart and Persistence Test
**Purpose**: Verify data persistence (Note: This implementation uses in-memory storage)

1. Stop the application (Ctrl+C)
2. Restart with `npm run start-local`
3. Check `GET /api/blocks`

**Expected Behavior**:
- Blockchain resets to genesis block only (no persistence in this implementation)
- This is expected behavior for this educational project

## Testing Checklist Summary

Use this checklist to ensure you've tested everything:

### ✅ Basic Functionality
- [ ] Application starts successfully
- [ ] API documentation loads
- [ ] Genesis block is present
- [ ] Wallet information displays correctly

### ✅ Blockchain Operations  
- [ ] Can mine new blocks with custom data
- [ ] Blocks are properly linked
- [ ] Proof-of-work hashes are valid
- [ ] Blockchain grows correctly

### ✅ Transaction System
- [ ] Can create valid transactions
- [ ] Transaction pool accumulates transactions
- [ ] Transaction validation works (rejects invalid amounts)
- [ ] Multiple transactions are handled correctly

### ✅ Mining System
- [ ] Can mine pending transactions
- [ ] Mining rewards are distributed
- [ ] Transaction pool is cleared after mining
- [ ] Wallet balances are updated correctly

### ✅ Error Handling
- [ ] Invalid transactions are rejected
- [ ] Error messages are clear
- [ ] System remains stable after errors

### ✅ System Integrity
- [ ] Blockchain integrity is maintained
- [ ] All components work together
- [ ] Performance is acceptable under load

## Troubleshooting Common Issues

### Issue: "Cannot GET /"
**Solution**: Ensure you're using `npm run start-local` and the server is running on port 3000

### Issue: Transaction rejected with "Amount exceeds balance"
**Solution**: Check your current balance with `/api/wallet-info` and ensure transaction amount is less than available balance

### Issue: Empty response from API
**Solution**: Verify correct URL and HTTP method. Check that Content-Type header is set to "application/json" for POST requests

### Issue: Mining takes too long
**Solution**: This is normal for proof-of-work. The difficulty is set to 3, which should complete in seconds. Higher difficulty would take longer.

## Conclusion

After completing this walkthrough, you will have:
- ✅ Verified all blockchain functionality
- ✅ Tested transaction creation and validation  
- ✅ Confirmed mining and consensus mechanisms
- ✅ Validated wallet operations and balance calculations
- ✅ Tested error handling and edge cases
- ✅ Confirmed system integrity and performance

Your CryptoChain implementation demonstrates a complete understanding of blockchain technology, from basic block creation to complex transaction processing and mining algorithms. This comprehensive testing proves your blockchain works exactly like real cryptocurrency systems!
