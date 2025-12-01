import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '../contracts/abis/ERC20ABI';
import { formatUnits } from 'viem';

export function useTokenBalance(tokenAddress: string, userAddress?: string) {
    const { data: balance, isLoading, refetch } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: userAddress ? [userAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!userAddress && !!tokenAddress,
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    });

    const formatted = balance ? formatUnits(balance as bigint, 18) : '0';

    // MOCK DATA: If connected but balance is 0, show mock balance
    const isMockMode = !!userAddress && (!balance || balance === 0n);
    const mockBalance = 1000000000000000000000n; // 1000 tokens

    return {
        balance: isMockMode ? mockBalance : (balance as bigint | undefined),
        balanceFormatted: isMockMode ? '1000.0' : formatted,
        isLoading,
        refetch,
    };
}

export function useTokenInfo(tokenAddress: string) {
    const { data: symbol } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
    });

    const { data: name } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'name',
    });

    const { data: decimals } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
    });

    return {
        symbol: symbol as string | undefined,
        name: name as string | undefined,
        decimals: decimals as number | undefined,
    };
}
