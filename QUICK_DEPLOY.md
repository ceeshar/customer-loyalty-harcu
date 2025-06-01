# Quick Deployment Guide - Stellar Testnet

## Option 1: Using Your Existing Freighter Account (Recommended)

Since you have 10,000 test XLM in your Freighter wallet, you can use that account directly.

### Step 1: Get Your Secret Key from Freighter

1. Open Freighter wallet
2. Click on your account name
3. Click "Show Secret Key"
4. Enter your password
5. Copy the secret key (starts with 'S')

### Step 2: Run These Commands in WSL

```bash
# 1. Wait for stellar CLI installation to complete, then verify
stellar --version

# 2. Import your Freighter account
stellar keys add myaccount --secret-key --network testnet
# (Paste your secret key when prompted)

# 3. Verify the account
stellar keys address myaccount

# 4. Deploy the contract
cd ~/risein-workshop
CONTRACT_ID=$(stellar contract deploy \
  --wasm contract/target/wasm32-unknown-unknown/release/loyalty_contract.wasm \
  --source myaccount \
  --network testnet)

echo "Contract ID: $CONTRACT_ID"

# 5. Initialize the contract with your account as admin
stellar contract invoke \
  --id $CONTRACT_ID \
  --source myaccount \
  --network testnet \
  -- \
  initialize \
  --admin $(stellar keys address myaccount)

# 6. Create the environment file
cat > client/.env.local << EOF
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ID
NEXT_PUBLIC_ADMIN_ADDRESS=$(stellar keys address myaccount)
EOF

echo "✅ Deployment complete!"
echo "Contract ID: $CONTRACT_ID"
echo "Admin: $(stellar keys address myaccount)"
```

### Step 3: Restart Your App

```bash
# Stop the current dev server (Ctrl+C)
# Then restart it
cd client
npm run dev
```

## Option 2: Automated Script

Just run:
```bash
cd ~/risein-workshop
./deploy-contract.sh
```

Choose option 1 when prompted and enter your Freighter secret key.

## Deployment Costs

- Contract deployment: ~1-2 XLM
- Contract initialization: ~0.1 XLM
- Each transaction: ~0.00001 XLM

With 10,000 test XLM, you can do thousands of transactions!

## After Deployment

Your app will automatically:
- Exit demo mode
- Connect to the real contract
- Show actual blockchain balances
- Process real transactions

As the admin, you'll be able to:
- Award points to any user
- View total supply
- Monitor all transactions on-chain 