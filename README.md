# 🎁 Stellar-Soroban Loyalty DApp

This project is a **customer loyalty dApp** built with **Stellar Soroban smart contracts**. Users earn points as they shop, and these points are stored **on-chain** as a TRY-pegged stablecoin. Points can be redeemed for rewards within the app.

## 🚀 Features

- 🔐 **Freighter wallet integration**  
- ⚙️ **Stellar Soroban smart contracts** for on-chain point storage  
- 🪙 **TRY-pegged stablecoin** as reward points  
- 🛍️ Points accumulate automatically with each purchase (simulated)
- 🎁 Users can redeem points for available rewards
- 💎 Simple and clean UI with:
  - Wallet connect button  
  - Point balance display  
  - Redeemable rewards list

## 📂 Project Structure

```bash
/contract             # Rust/Soroban smart contract code  
/app                  # Next.js frontend application  
/tailwind.config.js   # Tailwind CSS configuration  
/README.md            # Project documentation  
```

## 🛠️ Installation

1️⃣ **Clone the repository:**

```bash
git clone https://github.com/<username>/<repo_name>.git  
cd <repo_name>
```

2️⃣ **Install dependencies:**

```bash
npm install
```

3️⃣ **Start the development server:**

```bash
npm run dev
```

4️⃣ **Build the smart contract:**

```bash
cd contract  
cargo build --target wasm32-unknown-unknown --release
```

## ⚙️ How It Works

- Connect your wallet using Freighter  
- Your current points (TRY stablecoin) are shown  
- Select a reward and redeem if you have enough points  
- Each transaction is securely processed on the **Stellar blockchain**

## 📸 Screenshots

![App Screenshot](./screenshots/loyalty-app.png)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

✨ **Want to contribute?**  
- Pull requests are welcome  
- Feel free to open issues for ideas, improvements, or bug reports

---

🔗 **Useful Links:**
- 🌐 [Stellar Developer Docs](https://developers.stellar.org/docs/)
- 🔧 [Soroban Documentation](https://soroban.stellar.org/docs)
- 💼 [Freighter Wallet](https://freighter.app/)

---

> **Note:** Before running the app, make sure you have compiled the Soroban smart contract in the `contract` folder.
