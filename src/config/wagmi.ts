import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Define custom hardhat chain with correct configuration
export const hardhatLocal = {
    id: 31337,
    name: 'Hardhat Local',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
        public: { http: ['http://127.0.0.1:8545'] },
    },
    testnet: true,
} as const;

// Create Wagmi config
export const config = createConfig({
    chains: [hardhatLocal, sepolia],
    connectors: [
        injected({ target: 'metaMask' }),
        // Add WalletConnect if you have a project ID
        // walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
    ],
    transports: {
        [hardhatLocal.id]: http(),
        [sepolia.id]: http(),
    },
});
