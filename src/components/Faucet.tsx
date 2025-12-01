import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { Button } from './ui/Button';
import { ERC20_ABI } from '../contracts/abis/ERC20ABI';
import { parseUnits } from 'viem';
import { Droplets } from 'lucide-react';
import { useEffect } from 'react';

interface FaucetProps {
    tokenAddress: string;
    tokenSymbol: string;
    onSuccess?: () => void;
}

export const Faucet = ({ tokenAddress, tokenSymbol, onSuccess }: FaucetProps) => {
    const { address } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    useEffect(() => {
        if (isSuccess && onSuccess) {
            onSuccess();
        }
    }, [isSuccess, onSuccess]);

    const handleMint = () => {
        if (!address) return;

        writeContract({
            address: tokenAddress as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'mint',
            args: [
                address,
                parseUnits('1000', 18)
            ],
        });
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleMint}
            isLoading={isPending || isConfirming}
            className="flex items-center gap-2 text-xs py-1 h-8 border-primary/20 hover:bg-primary/10 text-primary"
        >
            <Droplets className="w-3 h-3" />
            {isPending ? 'Minting...' : isConfirming ? 'Confirming...' : `Mint 1000 ${tokenSymbol}`}
        </Button>
    );
};
