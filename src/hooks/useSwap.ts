import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { POOL_ABI } from '../contracts/abis/PoolABI';
import { parseUnits } from 'viem';

export function useSwap() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const executeSwap = (
        poolAddress: string,
        tokenIn: string,
        amountIn: string,
        amountOutMin: string,
        decimals: number = 18
    ) => {
        const amountInBigInt = parseUnits(amountIn, decimals);
        const amountOutMinBigInt = parseUnits(amountOutMin, decimals);

        writeContract({
            address: poolAddress as `0x${string}`,
            abi: POOL_ABI,
            functionName: 'swap',
            args: [
                tokenIn as `0x${string}`,
                amountInBigInt,
                amountOutMinBigInt
            ],
        });
    };

    return {
        executeSwap,
        isPending,
        isConfirming,
        isSuccess,
        hash,
        error
    };
}
