import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '../contracts/abis/ERC20ABI';

export function useTokenAllowance(tokenAddress: string, ownerAddress: string | undefined, spenderAddress: string | undefined) {
    const { data: allowance, refetch, isLoading } = useReadContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: ownerAddress && spenderAddress ? [ownerAddress as `0x${string}`, spenderAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!ownerAddress && !!spenderAddress,
        }
    });

    return {
        allowance: allowance as bigint | undefined,
        refetch,
        isLoading
    };
}
