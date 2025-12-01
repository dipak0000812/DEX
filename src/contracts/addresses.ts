import { DEPLOYED_ADDRESSES, TOKENS as DEPLOYED_TOKENS, POOLS as DEPLOYED_POOLS } from './deployed-addresses';

// Network configurations
export const NETWORKS = {
    LOCALHOST: {
        id: 31337,
        name: 'Hardhat Local',
        rpcUrl: 'http://127.0.0.1:8545',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        }
    },
    SEPOLIA: {
        id: 11155111,
        name: 'Sepolia Testnet',
        rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorer: 'https://sepolia.etherscan.io'
    }
} as const;

// Contract addresses (imported from deployment)
export const CONTRACTS = {
    FACTORY: DEPLOYED_ADDRESSES.contracts.factory,
    ROUTER: DEPLOYED_ADDRESSES.contracts.router,
} as const;

// Token addresses
export const TOKENS = {
    SWIFT: {
        address: DEPLOYED_TOKENS.TKA,
        symbol: 'SWIFT',
        name: 'Swift Protocol',
        decimals: 18,
        logo: '⚡'
    },
    BOLT: {
        address: DEPLOYED_TOKENS.TKB,
        symbol: 'BOLT',
        name: 'Bolt Network',
        decimals: 18,
        logo: '🔋'
    },
    FLASH: {
        address: DEPLOYED_TOKENS.TKC,
        symbol: 'FLASH',
        name: 'Flash Finance',
        decimals: 18,
        logo: '✨'
    }
} as const;

export interface Token {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logo: string;
}

// Pool addresses
export const POOLS = {
    'SWIFT-BOLT': DEPLOYED_POOLS['TKA-TKB'],
    'BOLT-FLASH': DEPLOYED_POOLS['TKB-TKC'],
    'SWIFT-FLASH': DEPLOYED_POOLS['TKA-TKC']
} as const;

// Fee tiers
export const FEE_TIERS = {
    LOW: 100,      // 0.01%
    MEDIUM: 500,   // 0.05%
    HIGH: 3000     // 0.3%
} as const;

export type TokenSymbol = keyof typeof TOKENS;
export type PoolPair = keyof typeof POOLS;
