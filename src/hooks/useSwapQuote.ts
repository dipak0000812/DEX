import { useReadContract } from 'wagmi';
import { POOL_ABI } from '../contracts/abis/PoolABI';
import { POOLS } from '../contracts/addresses';
import { parseUnits, formatUnits } from 'viem';

export function useSwapQuote(
    tokenIn: string,
    tokenOut: string,
    amountIn: string,
    decimals: number = 18
) {
    // Find the pool for this pair
    // In a real app, we'd use the Factory to find the pool
    // For this demo, we'll check our hardcoded map
    let poolAddress: string | undefined;

    // Actually, let's just look up based on the tokens selected
    // This part would be dynamic in a full implementation
    if (tokenIn && tokenOut) {
        // Simple lookup for demo purposes
        // We will iterate through POOLS to find a match
        for (const [key, address] of Object.entries(POOLS)) {
            if (key.includes('TKA') && key.includes('TKB') &&
                ((tokenIn.includes('TKA') && tokenOut.includes('TKB')) || (tokenIn.includes('TKB') && tokenOut.includes('TKA')))) {
                poolAddress = address;
                break;
            }
            // Add other pairs...
            // For the sake of this demo, we will pass the pool address directly from the UI or look it up more robustly
        }
    }

    const amountInBigInt = amountIn ? parseUnits(amountIn, decimals) : 0n;

    const { data: quote, isLoading, error } = useReadContract({
        address: poolAddress as `0x${string}`,
        abi: POOL_ABI,
        functionName: 'getQuote',
        args: poolAddress && amountInBigInt > 0n ? [tokenIn as `0x${string}`, amountInBigInt] : undefined,
        query: {
            enabled: !!poolAddress && amountInBigInt > 0n,
            refetchInterval: 5000,
        }
    });

    return {
        amountOut: quote ? formatUnits(quote as bigint, decimals) : '',
        amountOutBigInt: quote as bigint | undefined,
        isLoading,
        error,
        poolAddress // Return this so we know if a pool was found
    };
}
