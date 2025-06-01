# Easy Contract Deployment (No Secret Key Needed!)

Since you can't find your Freighter secret key, let's create a new deployment account. This is actually easier!

## Step 1: Check if Stellar CLI is Ready

```bash
stellar --version
```

If not installed yet, wait a bit more or run:
```bash
cargo install --locked stellar-cli
```

## Step 2: Create a New Deployment Account

```bash
# Navigate to project root
cd ~/risein-workshop

# Create a new account for deployment
stellar keys generate deployer --network testnet

# Fund it with testnet XLM (free!)
stellar keys fund deployer --network testnet

# Check your new account address
stellar keys address deployer
```

## Step 3: Deploy the Contract

```bash
# Deploy the contract
CONTRACT_ID=$(stellar contract deploy \
  --wasm contract/target/wasm32-unknown-unknown/release/loyalty_contract.wasm \
  --source deployer \
  --network testnet)

echo "Contract deployed! ID: $CONTRACT_ID"
```

## Step 4: Initialize the Contract

You have two options here:

### Option A: Make the New Account Admin (Simpler)
```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  initialize \
  --admin $(stellar keys address deployer)
```

### Option B: Make Your Freighter Account Admin (Better)
First, get your Freighter public address (NOT secret key):
1. Open Freighter
2. Click on your account
3. Copy the public address (starts with 'G')

Then run:
```bash
# Replace YOUR_FREIGHTER_PUBLIC_ADDRESS with your actual address
stellar contract invoke \
  --id $CONTRACT_ID \
  --source deployer \
  --network testnet \
  -- \
  initialize \
  --admin YOUR_FREIGHTER_PUBLIC_ADDRESS
```

## Step 5: Configure the Frontend

```bash
# If you chose Option A (new account is admin)
cat > client/.env.local << EOF
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ID
NEXT_PUBLIC_ADMIN_ADDRESS=$(stellar keys address deployer)
EOF

# If you chose Option B (Freighter is admin)
# Replace YOUR_FREIGHTER_PUBLIC_ADDRESS with your actual address
cat > client/.env.local << EOF
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ID
NEXT_PUBLIC_ADMIN_ADDRESS=YOUR_FREIGHTER_PUBLIC_ADDRESS
EOF
```

## Step 6: Restart Your App

Stop the current server (Ctrl+C) and restart:
```bash
cd client
npm run dev
```

## Done! 🎉

Your contract is now deployed and your app is connected to it!

### What You Can Do Now:
- **If Option A**: Use the stellar CLI to manage admin functions
- **If Option B**: Use your Freighter wallet (with 10,000 XLM) as admin
- All users can connect with Freighter and redeem points
- Only the admin can award points

### Total Cost:
- New account funding: FREE (from friendbot)
- Contract deployment: ~2 XLM (paid by new account)
- Your 10,000 XLM remains untouched! 