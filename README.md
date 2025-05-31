# 📦 Stellar-Soroban Voting DApp

This project is a **voting dApp** built with **Stellar and Soroban**. It offers a simple, modern, and powerful solution for decentralized decision-making.

## 🚀 Features

- 🌐 Modern frontend built with **Next.js**
- 📜 Smart contracts written in **Rust / Soroban**
- 🔑 Wallet connection via **Freighter**
- ⚡ Supports 3 voting options (A, B, C)
- 🎨 Clean and intuitive UI powered by **Tailwind CSS**

## 📂 Project Structure

```bash
/contract             # Rust/Soroban smart contract code  
/app                  # Next.js frontend application  
/tailwind.config.js   # Tailwind CSS configuration  
/README.md            # This documentation file  
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

## ⚙️ Usage

- Connect your wallet from the homepage.
- Choose your preferred option and cast your vote.
- Each vote is recorded as a **Stellar transaction**!

## 📸 Screenshots

![App Screenshot](./screenshots/vote-app.png)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

✨ **Want to contribute?**  
- Pull requests are welcome!  
- Feel free to open issues for suggestions or bug reports.

---

🔗 **Useful Links:**
- 🌐 [Stellar Developer Docs](https://developers.stellar.org/docs/)
- 🔧 [Soroban Documentation](https://soroban.stellar.org/docs)
- 💼 [Freighter Wallet](https://freighter.app/)

---

> **Note:** Make sure to compile the smart contract inside the `contract` folder before running the app!
