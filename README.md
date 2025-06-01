# Customer Loyalty Program HARCU 🌟

A blockchain-based customer loyalty program built on Stellar Soroban, featuring a modern React/Next.js frontend, and Rust on the contract side.

<span style="font-size: 5px;"><em>This project is a work in progress, please don't be shy on reaching out, all pull requests are welcome!</em></span>



## 🚀 Features

- **Blockchain-Based Points**: Loyalty points stored on Stellar Soroban smart contract
- **Freighter Wallet Integration**: Seamless connection with Stellar wallets
- **Real-Time Balance**: Fetch loyalty points directly from the blockchain
- **Reward Redemption**: Exchange points for various rewards
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS

## 📋 Prerequisites

- Node.js 20 or higher
- [Freighter Wallet](https://www.freighter.app/) browser extension
- Stellar CLI (for contract deployment)

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd risein-workshop
```

### 2. Deploy the Smart Contract (Option 1: Automated)
```bash
# Run the easy deployment script
./deploy-easy.sh
```

This will:
- Create a new test account
- Fund it with testnet tokens
- Deploy the loyalty contract
- Save the contract ID

### 3. Configure the Frontend
The deployment script automatically creates the `.env.local` file. If you need to update it manually:

```bash
cd client
echo -e "NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org\nNEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ID" > .env.local
```

### 4. Install Dependencies
```bash
cd client
npm install
```

### 5. Run the Application
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 💰 Adding Points to an Account

To award loyalty points to a user:

```bash
stellar contract invoke \
  --id YOUR_CONTRACT_ID \
  --source test-deployer \
  --network testnet \
  -- earn_points \
  --user USER_STELLAR_ADDRESS \
  --amount 500
```

## 🔍 Checking Balance

To check a user's balance via CLI:

```bash
stellar contract invoke \
  --id YOUR_CONTRACT_ID \
  --source test-deployer \
  --network testnet \
  -- get_balance \
  --user USER_STELLAR_ADDRESS
```

## 📁 Project Structure

```
risein-workshop/
├── client/                 # Next.js frontend application
│   ├── app/               # App router pages
│   │   └── page.tsx       # Main loyalty app component
│   ├── package.json       # Frontend dependencies
│   └── .env.local         # Environment variables
├── contracts/             # Soroban smart contracts
│   └── loyalty/          # Loyalty contract source
├── deploy-easy.sh        # Automated deployment script
└── README.md            # This file
```

## 🔧 Troubleshooting

### "Invalid contract ID" Error
- Make sure the contract ID in `.env.local` matches the deployed contract
- The contract ID should start with 'C' and be 56 characters long

### Balance Not Showing
1. Click the "🔄 Yenile" (Refresh) button to fetch latest balance
2. Check browser console for errors
3. Ensure your Freighter wallet is connected to Testnet

### Node Version Issues
If you see Node.js version errors:
```bash
nvm install 20
nvm use 20
```

### Contract Deployment Failed
- Ensure Stellar CLI is installed: `stellar --version`
- Check you have internet connection for testnet funding
- Try running `stellar network container start testnet` if using local testnet

## 🏗️ Development

### Smart Contract
The loyalty contract is written in Rust and provides:
- `initialize()` - Set up contract with admin
- `earn_points()` - Award points to users
- `redeem_reward()` - Exchange points for rewards
- `get_balance()` - Check user balance
- `add_reward()` - Add new rewards (admin only)

### Frontend Features
- Real-time wallet connection status
- Automatic balance refresh on connection
- Simulated point earning (demo mode)
- Reward marketplace with cost validation

## 🔒 Security Notes

- This is a testnet deployment for demonstration
- Never share your Freighter secret key
- Contract admin functions are protected
- All transactions require wallet approval

## 📚 Resources

- [Stellar Developers](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)

## 📝 License

MIT License - feel free to use this project for learning and development!
