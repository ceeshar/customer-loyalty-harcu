# Stellar Soroban Loyalty DApp Deployment Guide

## Prerequisites

1. **Rust & Cargo** - For building the smart contract
2. **Node.js & npm** - For the frontend
3. **Stellar CLI** - For deploying contracts
4. **Freighter Wallet** - Browser extension for Stellar

## Step 1: Install Stellar CLI

```bash
# Install Stellar CLI
cargo install --locked soroban-cli

# Verify installation
soroban --version
```

## Step 2: Configure Stellar Testnet Account

```bash
# Create a new account for testnet
soroban keys generate --global admin --network testnet

# Fund the account using friendbot
soroban keys fund admin --network testnet

# Get the admin address
soroban keys address admin
```

## Step 3: Deploy the Smart Contract

```bash
# Navigate to contract directory
cd contract

# Build the contract (already done)
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/loyalty_contract.wasm \
  --source admin \
  --network testnet

# Save the contract ID that is returned!
```

## Step 4: Initialize the Contract

```bash
# Initialize with admin address (replace CONTRACT_ID with actual ID)
soroban contract invoke \
  --id CONTRACT_ID \
  --source admin \
  --network testnet \
  -- \
  initialize \
  --admin $(soroban keys address admin)
```

## Step 5: Configure the Frontend

1. Create a `.env.local` file in the `client` directory:

```bash
cd ../client
```

2. Add the following environment variables:

```env
# Replace with your deployed contract ID
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_id_here

# Replace with your admin address
NEXT_PUBLIC_ADMIN_ADDRESS=your_admin_address_here

# Network configuration (keep these for testnet)
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
```

## Step 6: Run the Frontend

```bash
# Install dependencies (if not already done)
npm install

# Run the development server
npm run dev
```

## Step 7: Test the Application

1. Open http://localhost:3000 in your browser
2. Install Freighter wallet extension if not already installed
3. Create/import a Stellar testnet account in Freighter
4. Connect your wallet to the app
5. If you're using the admin account, you can earn points
6. Try redeeming rewards with your points

## Troubleshooting

### Contract Not Working
- Ensure the contract is properly deployed and initialized
- Check that the CONTRACT_ADDRESS in .env.local is correct
- Verify you're on the correct network (testnet)

### Demo Mode Active
- If you see "Demo Mode" warning, it means CONTRACT_ADDRESS is not set
- The app will work with simulated data until a real contract is configured

### Transaction Failures
- Ensure your account has enough XLM for transaction fees
- Check that you're connected to the correct network in Freighter
- For testnet, use the friendbot to get free XLM

## Production Deployment

For production deployment:

1. Deploy contract to Stellar mainnet
2. Update environment variables to mainnet values
3. Build the frontend: `npm run build`
4. Deploy to your hosting service (Vercel, Netlify, etc.)

## Security Considerations

1. Never expose private keys in your code
2. Use environment variables for sensitive data
3. Implement proper access controls in the contract
4. Consider adding rate limiting for point earning
5. Audit the contract before mainnet deployment 