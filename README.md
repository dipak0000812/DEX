# 🦄 DEX V3 - Web3 Decentralized Exchange

A modern, fully functional Decentralized Exchange (DEX) built with React, Vite, Tailwind CSS, and Hardhat. This project demonstrates a complete Web3 application with real blockchain interactions, including swapping, liquidity management, and wallet integration.

![DEX V3 Preview](https://via.placeholder.com/800x400?text=DEX+V3+Preview)

## ✨ Features

- **🔄 Token Swapping**: Swap between ERC20 tokens (TKA, TKB, TKC) with real-time price quotes and slippage protection.
- **💧 Liquidity Management**: Add and remove liquidity from pools to earn trading fees (0.05%).
- **👛 Wallet Integration**: Seamless connection with MetaMask and other Web3 wallets using Wagmi & Viem.
- **🚰 Built-in Faucet**: Mint test tokens directly from the UI to test functionality without needing real funds.
- **📊 Real-time Analytics**: View pool statistics, volume, and recent transactions (simulated for demo).
- **🎨 Premium UI**: Glassmorphism design with responsive layout and smooth animations.
- **🧪 Mock Data Mode**: Automatically populates the dashboard with mock data if the connected wallet is empty, ensuring a great demo experience.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Viem, TanStack Query
- **Blockchain**: Hardhat, Solidity (OpenZeppelin)
- **Testing**: Hardhat Local Network

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MetaMask](https://metamask.io/) installed in your browser

### 1. Clone the Repository

```bash
git clone https://github.com/dipak0000812/DEX.git
cd DEX
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Local Blockchain Node

Open a terminal and run the Hardhat node. This simulates an Ethereum network on your machine.

```bash
npm run node
```
*Keep this terminal running!*

### 4. Deploy Smart Contracts

In a **second terminal**, deploy the contracts (Factory, Router, Tokens) to your local node.

```bash
npm run deploy
```

### 5. Start Frontend Application

In a **third terminal**, start the React development server.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎮 Usage Guide

### Connecting Wallet
1. Open MetaMask and add a custom network:
   - **Network Name**: Hardhat Local
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: `ETH`
2. Import a test account using one of the private keys displayed in the "Start Local Blockchain Node" terminal.
3. Click **"Connect Wallet"** in the DEX app.

### Getting Test Tokens
1. Go to the **Swap** page.
2. Click the **Faucet** button (💧) next to your balance for TKA, TKB, or TKC.
3. Click **"Mint 1000"** and confirm the transaction in MetaMask.

### Swapping Tokens
1. Select the tokens you want to swap (e.g., TKA to TKB).
2. Enter an amount.
3. Click **"Approve"** (if it's your first time) and confirm.
4. Click **"Swap"** and confirm.

### Adding Liquidity
1. Go to the **Pools** page.
2. Click **"New Position"**.
3. Select a pair (e.g., TKA/TKB).
4. Enter amounts for both tokens.
5. Approve both tokens and click **"Add Liquidity"**.

## 🔧 Troubleshooting

- **"Pool Not Found"**: Ensure you have deployed the contracts (`npm run deploy`) and are selecting a valid pair (e.g., TKA-TKB).
- **"Insufficient Balance"**: Use the Faucet feature to mint more test tokens.
- **Transaction Failed**: If you restarted the Hardhat node, you must reset your MetaMask account for the Localhost network (Settings > Advanced > Clear Activity Tab Data) to fix nonce issues.

## 📄 License

This project is licensed under the MIT License.
