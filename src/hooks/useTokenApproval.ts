import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ERC20_ABI } from '../contracts/abis/ERC20ABI';
import { parseUnits } from 'viem';

export function useTokenApproval(
    tokenAddress: string,
    spenderAddress: string,
    amount: string,
    decimals: number = 18
) {
    const amountBigInt = amount ? parseUnits(amount, decimals) : 0n;

    const { writeContract, data: hash, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const approve = () => {
        writeContract({
            address: tokenAddress as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spenderAddress as `0x${string}`, amountBigInt],
        });
    };

    return {
        approve,
        isPending,
        isConfirming,
        isSuccess,
        hash,
        error
    };
}
