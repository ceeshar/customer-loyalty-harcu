#!/bin/bash

# Stellar Soroban Contract Deployment Script
# This script deploys the loyalty contract to Stellar testnet

echo "🚀 Stellar Soroban Loyalty Contract Deployment"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo -e "${RED}❌ Stellar CLI not found. Please install it first:${NC}"
    echo "cargo install --locked stellar-cli"
    exit 1
fi

echo -e "${BLUE}📋 Step 1: Setting up deployment account${NC}"
echo "Do you want to:"
echo "1) Use your existing Freighter account (you'll need to import the secret key)"
echo "2) Create a new deployment account"
read -p "Choose option (1 or 2): " ACCOUNT_OPTION

if [ "$ACCOUNT_OPTION" == "1" ]; then
    echo -e "${YELLOW}Please enter your Freighter account's secret key (starts with S):${NC}"
    read -s SECRET_KEY
    echo
    stellar keys add deployer --secret-key --network testnet <<< "$SECRET_KEY"
else
    echo -e "${BLUE}Creating new deployment account...${NC}"
    stellar keys generate deployer --network testnet
fi

# Get the account address
DEPLOYER_ADDRESS=$(stellar keys address deployer)
echo -e "${GREEN}✓ Deployer address: $DEPLOYER_ADDRESS${NC}"

# Fund the account if needed
echo -e "${BLUE}📋 Step 2: Checking account balance${NC}"
if [ "$ACCOUNT_OPTION" == "2" ]; then
    echo -e "${BLUE}Funding new account with friendbot...${NC}"
    stellar keys fund deployer --network testnet
else
    echo -e "${GREEN}✓ Using existing account with balance${NC}"
fi

# Build the contract (ensure it's up to date)
echo -e "${BLUE}📋 Step 3: Building contract${NC}"
cd contract
cargo build --target wasm32-unknown-unknown --release
cd ..

# Deploy the contract
echo -e "${BLUE}📋 Step 4: Deploying contract to testnet${NC}"
CONTRACT_ID=$(stellar contract deploy \
    --wasm contract/target/wasm32-unknown-unknown/release/loyalty_contract.wasm \
    --source deployer \
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
    --source deployer \
    --network testnet \
    -- \
    initialize \
    --admin $DEPLOYER_ADDRESS

echo -e "${GREEN}✓ Contract initialized!${NC}"

# Create .env.local file
echo -e "${BLUE}📋 Step 6: Creating frontend configuration${NC}"
cat > client/.env.local << EOF
# Stellar/Soroban Configuration
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ID

# Admin Configuration
NEXT_PUBLIC_ADMIN_ADDRESS=$DEPLOYER_ADDRESS
EOF

echo -e "${GREEN}✓ Frontend configuration created!${NC}"

# Display summary
echo
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "======================================"
echo -e "Contract ID: ${BLUE}$CONTRACT_ID${NC}"
echo -e "Admin Address: ${BLUE}$DEPLOYER_ADDRESS${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Restart your Next.js development server"
echo "2. Your app will now use the real contract!"
echo "3. As admin, you can earn points for users"
echo
echo -e "${BLUE}Contract details saved to: client/.env.local${NC}" 