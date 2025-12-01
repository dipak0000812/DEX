<div align="center">

# 🦄 SwiftSwap DEX V3

### Modern Decentralized Exchange Built on Web3

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.x-FFF100)](https://hardhat.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

A fully functional decentralized exchange with token swapping, liquidity pools, and seamless wallet integration.

[Get Started](#-getting-started) · [Features](#-features) · [Documentation](#-usage-guide)

</div>

---

## 🎯 Overview

SwiftSwap is a production-ready DEX built with modern Web3 technologies. It demonstrates real blockchain interactions including automated market maker (AMM) logic, liquidity provision, and ERC20 token management on a local Hardhat network.

**Perfect for:** Learning Web3 development, portfolio projects, or as a foundation for your own DEX.

---

## ✨ Features

- **🔄 Token Swapping** - Exchange ERC20 tokens (TKA, TKB, TKC) with real-time quotes and slippage protection
- **💧 Liquidity Pools** - Add/remove liquidity and earn 0.05% trading fees
- **👛 Web3 Wallet Integration** - MetaMask support via Wagmi & Viem
- **🚰 Built-in Faucet** - Mint test tokens directly from the UI
- **📊 Live Analytics** - Pool stats, volume tracking, and transaction history
- **🎨 Premium UI** - Glassmorphism design with responsive layout
- **🧪 Mock Data Mode** - Auto-populates demo data for testing

---

## 🛠️ Tech Stack

**Frontend:**
- React + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Wagmi + Viem + TanStack Query

**Blockchain:**
- Hardhat + Solidity
- OpenZeppelin Contracts
- Local Ethereum Network

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MetaMask browser extension

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/dipak0000812/swift-swap.git
cd swift-swap
```

2. **Install dependencies**
```bash
npm install
```

3. **Start local blockchain** (Terminal 1)
```bash
npm run node
```
> Keep this running!

4. **Deploy contracts** (Terminal 2)
```bash
npm run deploy
```

5. **Start frontend** (Terminal 3)
```bash
npm run dev
```

6. **Open** http://localhost:5173

---

## 🎮 Usage Guide

### 1. Connect Wallet

**Add Hardhat Network to MetaMask:**
- Network Name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency: `ETH`

Import a test account using private keys from the node terminal.

### 2. Get Test Tokens

Click the **Faucet button (💧)** next to your balance → Mint 1000 tokens → Confirm in MetaMask.

### 3. Swap Tokens

1. Select token pair (e.g., TKA → TKB)
2. Enter amount
3. Click **Approve** (first time only)
4. Click **Swap** and confirm

### 4. Provide Liquidity

1. Go to **Pools** → **New Position**
2. Select pair (e.g., TKA/TKB)
3. Enter amounts for both tokens
4. Approve both tokens
5. Click **Add Liquidity**

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Pool Not Found" | Run `npm run deploy` and select valid pair |
| "Insufficient Balance" | Use Faucet to mint tokens |
| Transaction fails after restart | Reset MetaMask: Settings → Advanced → Clear Activity Tab Data |

---

## 📂 Project Structure

```
swift-swap/
├── contracts/          # Solidity smart contracts
├── scripts/           # Deployment scripts
├── src/
│   ├── components/    # React components
│   ├── hooks/         # Custom Web3 hooks
│   └── lib/           # Contract ABIs & config
├── hardhat.config.js  # Hardhat configuration
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Dipak**

- GitHub: [@dipak0000812](https://github.com/dipak0000812)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you learn Web3 development!
