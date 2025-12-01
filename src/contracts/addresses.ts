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
    TKA: {
        address: DEPLOYED_TOKENS.TKA,
        symbol: 'TKA',
        name: 'Token A',
        decimals: 18,
        logo: '🔵'
    },
    TKB: {
        address: DEPLOYED_TOKENS.TKB,
        symbol: 'TKB',
        name: 'Token B',
        decimals: 18,
        logo: '🟢'
    },
    TKC: {
        address: DEPLOYED_TOKENS.TKC,
        symbol: 'TKC',
        name: 'Token C',
        decimals: 18,
        logo: '🟣'
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
    'TKA-TKB': DEPLOYED_POOLS['TKA-TKB'],
    'TKB-TKC': DEPLOYED_POOLS['TKB-TKC'],
    'TKA-TKC': DEPLOYED_POOLS['TKA-TKC']
} as const;

// Fee tiers
export const FEE_TIERS = {
    LOW: 100,      // 0.01%
    MEDIUM: 500,   // 0.05%
    HIGH: 3000     // 0.3%
} as const;

export type TokenSymbol = keyof typeof TOKENS;
export type PoolPair = keyof typeof POOLS;
