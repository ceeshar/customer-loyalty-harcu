#!/bin/bash

# Simple Stellar Soroban Contract Deployment Script
# This script automatically creates a new test account and deploys the contract

echo "🚀 Stellar Soroban Loyalty Contract Easy Deployment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo -e "${RED}❌ Stellar CLI not found. Please install it first:${NC}"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.stellar.org | sh"
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Creating new test account${NC}"
# Generate a new account
stellar keys generate test-deployer --network testnet --no-fund

# Get the account address
DEPLOYER_ADDRESS=$(stellar keys address test-deployer)
echo -e "${GREEN}✓ New account created: $DEPLOYER_ADDRESS${NC}"

# Fund the account
echo -e "${BLUE}📋 Step 2: Funding account from friendbot${NC}"
stellar keys fund test-deployer --network testnet

echo -e "${GREEN}✓ Account funded!${NC}"

# Build the contract
echo -e "${BLUE}📋 Step 3: Building contract${NC}"
cd contract
cargo build --target wasm32-unknown-unknown --release
cd ..

# Deploy the contract
echo -e "${BLUE}📋 Step 4: Deploying contract to testnet${NC}"
CONTRACT_ID=$(stellar contract deploy \
    --wasm contract/target/wasm32-unknown-unknown/release/loyalty_contract.wasm \
    --source test-deployer \
    --network testnet)

if [ -z "$CONTRACT_ID" ]; then
    echo -e "${RED}❌ Contract deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Contract deployed successfully!${NC}"
echo -e "${GREEN}Contract ID: $CONTRACT_ID${NC}"

# Initialize the contract
echo -e "${BLUE}📋 Step 5: Initializing contract${NC}"
stellar contract invoke \
    --id $CONTRACT_ID \
    --source test-deployer \
    --network testnet \
    -- \
    initialize \
    --admin $DEPLOYER_ADDRESS

echo -e "${GREEN}✓ Contract initialized!${NC}"

# Update the .env.local file
echo -e "${BLUE}📋 Step 6: Updating frontend configuration${NC}"
cat > client/.env.local << EOF
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ID
EOF

echo -e "${GREEN}✓ Frontend configuration updated!${NC}"

# Display summary
echo
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "======================================"
echo -e "Contract ID: ${BLUE}$CONTRACT_ID${NC}"
echo -e "Admin Address: ${BLUE}$DEPLOYER_ADDRESS${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Your app at http://localhost:3000 will now use the real contract!"
echo "2. Connect your Freighter wallet"
echo "3. You'll see 0 points initially (real blockchain data)"
echo "4. The contract admin can award points to users"
echo
echo -e "${YELLOW}To award points as admin (optional):${NC}"
echo "stellar contract invoke \\"
echo "  --id $CONTRACT_ID \\"
echo "  --source test-deployer \\"
echo "  --network testnet \\"
echo "  -- earn_points \\"
echo "  --user YOUR_FREIGHTER_ADDRESS \\"
echo "  --amount 100" 