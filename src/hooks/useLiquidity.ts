import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { POOL_ABI } from '../contracts/abis/PoolABI';
import { parseUnits } from 'viem';

export function useLiquidity() {
    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const addLiquidity = (
        poolAddress: string,
        amount0: string,
        amount1: string,
        decimals: number = 18
    ) => {
        const amount0BigInt = parseUnits(amount0, decimals);
        const amount1BigInt = parseUnits(amount1, decimals);

        writeContract({
            address: poolAddress as `0x${string}`,
            abi: POOL_ABI,
            functionName: 'addLiquidity',
            args: [
                amount0BigInt,
                amount1BigInt,
                0n, // Min amount 0 (0 for demo)
                0n, // Min amount 1 (0 for demo)
                -887272, // Full range lower tick
                887272   // Full range upper tick
            ],
        });
    };

    const removeLiquidity = (
        poolAddress: string,
        liquidity: bigint
    ) => {
        writeContract({
            address: poolAddress as `0x${string}`,
            abi: POOL_ABI,
            functionName: 'removeLiquidity',
            args: [liquidity],
        });
    };

    return {
        addLiquidity,
        removeLiquidity,
        isPending,
        isConfirming,
        isSuccess,
        hash,
        error
    };
}
