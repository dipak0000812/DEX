import { useReadContract } from 'wagmi';
import { FACTORY_ABI } from '../contracts/abis/FactoryABI';
import { CONTRACTS } from '../contracts/addresses';
import { useQuery } from '@tanstack/react-query';

export function useGlobalStats() {
    // Get total pools
    const { data: poolsLength } = useReadContract({
        address: CONTRACTS.FACTORY as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'allPoolsLength',
        query: {
            refetchInterval: 30000
        }
    });

    // In a real app with a subgraph, we would fetch TVL, Volume, Fees here
    // For this demo without a backend indexer, we'll simulate these based on on-chain data
    // or just use placeholders that update slightly to show "liveness"

    return useQuery({
        queryKey: ['globalStats', poolsLength?.toString()],
        queryFn: async () => {
            // Simulate some data based on pool count
            const count = Number(poolsLength || 0);

            return {
                tvl: 1250000 + (count * 50000), // Mock calculation
                volume24h: 450000 + (count * 15000),
                fees24h: 1250 + (count * 45),
                totalPools: count
            };
        },
        enabled: true,
        refetchInterval: 10000
    });
}
