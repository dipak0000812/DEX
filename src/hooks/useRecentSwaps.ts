import { useWatchContractEvent } from 'wagmi';
import { POOL_ABI } from '../contracts/abis/PoolABI';
import { POOLS } from '../contracts/addresses';
import { useState } from 'react';
import { formatUnits } from 'viem';

export interface SwapEvent {
    hash: string;
    sender: string;
    amount0: string;
    amount1: string;
    timestamp: number;
    pool: string;
    type: 'buy' | 'sell';
}

export function useRecentSwaps() {
    const [swaps, setSwaps] = useState<SwapEvent[]>([]);

    // Watch for Swap events on all known pools
    // Note: In production, use a subgraph. Watching multiple contracts client-side is heavy.
    // We'll just watch one pool for the demo to keep it light
    const demoPoolAddress = Object.values(POOLS)[0];

    useWatchContractEvent({
        address: demoPoolAddress as `0x${string}`,
        abi: POOL_ABI,
        eventName: 'Swap',
        onLogs(logs) {
            const newSwaps = logs.map(log => {
                const { args, transactionHash } = log;
                // Basic parsing
                const amount0 = args.amount0 ? formatUnits(args.amount0, 18) : '0';

                return {
                    hash: transactionHash,
                    sender: args.sender || '',
                    amount0,
                    amount1: args.amount1 ? formatUnits(args.amount1, 18) : '0',
                    timestamp: Date.now(),
                    pool: 'TKA-TKB', // Hardcoded for demo
                    type: parseFloat(amount0) < 0 ? 'buy' : 'sell' // Simplified logic
                } as SwapEvent;
            });

            setSwaps(prev => [...newSwaps, ...prev].slice(0, 20));
        },
    });

    return { swaps };
}
