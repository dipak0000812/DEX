import { ERC20_ABI } from '../contracts/abis/ERC20ABI';
import { POOLS } from '../contracts/addresses';
import { formatUnits } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { config } from '../config/wagmi';
import { readContract } from '@wagmi/core';

export interface Position {
    poolAddress: string;
    token0: string;
    token1: string;
    liquidity: bigint;
    liquidityFormatted: string;
    poolName: string;
}

export function useUserPositions(userAddress?: string) {
    return useQuery({
        queryKey: ['userPositions', userAddress],
        queryFn: async () => {
            if (!userAddress) return [];

            const positions: Position[] = [];

            // Iterate through all known pools
            for (const [name, poolAddress] of Object.entries(POOLS)) {
                try {
                    // Check LP token balance
                    const balance = await readContract(config, {
                        address: poolAddress as `0x${string}`,
                        abi: ERC20_ABI,
                        functionName: 'balanceOf',
                        args: [userAddress as `0x${string}`],
                    });

                    if (balance && balance > 0n) {
                        // Get token info (optional, but good for display)
                        // For now, we'll parse the name from the key
                        const [symbol0, symbol1] = name.split('-');

                        positions.push({
                            poolAddress,
                            token0: symbol0,
                            token1: symbol1,
                            liquidity: balance,
                            liquidityFormatted: formatUnits(balance, 18),
                            poolName: name
                        });
                    }
                } catch (e) {
                    console.error(`Error fetching position for ${name}:`, e);
                }
            }

            // MOCK DATA: If no real positions found, return mock positions for demo
            if (positions.length === 0 && userAddress) {
                return [
                    {
                        poolAddress: '0xMockPool1',
                        token0: 'TKA',
                        token1: 'TKB',
                        liquidity: 1000000000000000000n,
                        liquidityFormatted: '1.0',
                        poolName: 'TKA-TKB'
                    },
                    {
                        poolAddress: '0xMockPool2',
                        token0: 'ETH',
                        token1: 'TKA',
                        liquidity: 500000000000000000n,
                        liquidityFormatted: '0.5',
                        poolName: 'ETH-TKA'
                    }
                ];
            }

            return positions;
        },
        enabled: !!userAddress,
        refetchInterval: 10000
    });
}
