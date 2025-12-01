import { useState, useEffect } from 'react';
import { X, ChevronDown, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TokenSelector } from './TokenSelector';
import { Faucet } from './Faucet';
import { useWallet } from '../hooks/useWallet';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useLiquidity } from '../hooks/useLiquidity';
import { useTokenApproval } from '../hooks/useTokenApproval';
import { useTokenAllowance } from '../hooks/useTokenAllowance';
import { TOKENS, POOLS, type Token } from '../contracts/addresses';
import { parseUnits } from 'viem';

interface AddLiquidityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}


export const AddLiquidityModal = ({ isOpen, onClose, onSuccess }: AddLiquidityModalProps) => {
    const { address } = useWallet();
    const [token0, setToken0] = useState<Token>(TOKENS.TKA);
    const [token1, setToken1] = useState<Token>(TOKENS.TKB);
    const [amount0, setAmount0] = useState('');
    const [amount1, setAmount1] = useState('');

    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
    const [selectingField, setSelectingField] = useState<'token0' | 'token1'>('token0');

    // Find Pool Address
    const getPoolAddress = (t0: Token, t1: Token) => {
        const pair1 = `${t0.symbol}-${t1.symbol}`;
        const pair2 = `${t1.symbol}-${t0.symbol}`;
        // @ts-ignore
        return POOLS[pair1] || POOLS[pair2];
    };

    const poolAddress = getPoolAddress(token0, token1);

    // Balances
    const { balanceFormatted: balance0, refetch: refetchBalance0 } = useTokenBalance(token0.address, address);
    const { balanceFormatted: balance1, refetch: refetchBalance1 } = useTokenBalance(token1.address, address);

    // Allowances
    const { allowance: allowance0, refetch: refetchAllowance0 } = useTokenAllowance(token0.address, address, poolAddress);
    const { allowance: allowance1, refetch: refetchAllowance1 } = useTokenAllowance(token1.address, address, poolAddress);

    // Approvals
    const { approve: approve0, isPending: isApproving0, isConfirming: isConfirmingApprove0, isSuccess: isSuccessApprove0 } = useTokenApproval(token0.address, poolAddress || '', amount0);
    const { approve: approve1, isPending: isApproving1, isConfirming: isConfirmingApprove1, isSuccess: isSuccessApprove1 } = useTokenApproval(token1.address, poolAddress || '', amount1);

    // Liquidity Action
    const { addLiquidity, isPending: isAdding, isConfirming: isConfirmingAdd, isSuccess: isSuccessAdd } = useLiquidity();

    // Refetch allowances on approval success
    useEffect(() => {
        if (isSuccessApprove0) refetchAllowance0();
    }, [isSuccessApprove0, refetchAllowance0]);

    useEffect(() => {
        if (isSuccessApprove1) refetchAllowance1();
    }, [isSuccessApprove1, refetchAllowance1]);

    // Close on success
    useEffect(() => {
        if (isSuccessAdd) {
            if (onSuccess) onSuccess();
            onClose();
        }
    }, [isSuccessAdd, onSuccess, onClose]);

    if (!isOpen) return null;

    const amount0BigInt = amount0 ? parseUnits(amount0, 18) : 0n;
    const amount1BigInt = amount1 ? parseUnits(amount1, 18) : 0n;

    const needsApproval0 = poolAddress && allowance0 !== undefined && allowance0 < amount0BigInt;
    const needsApproval1 = poolAddress && allowance1 !== undefined && allowance1 < amount1BigInt;

    const handleTokenSelect = (token: Token) => {
        if (selectingField === 'token0') {
            if (token.address === token1.address) setToken1(token0);
            setToken0(token);
        } else {
            if (token.address === token0.address) setToken0(token1);
            setToken1(token);
        }
    };

    const handleAddLiquidity = () => {
        if (!poolAddress || !amount0 || !amount1) return;
        addLiquidity(poolAddress, amount0, amount1);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card className="w-full max-w-md p-6 relative bg-[#0A0E27]/95 border-primary/20">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">Add Liquidity</h2>

                {!poolAddress ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-200">
                            Pool not found for this pair. Please select a valid pair (e.g., TKA-TKB).
                        </div>
                    </div>
                ) : null}

                <div className="space-y-4 mb-6">
                    {/* Token 0 Input */}
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-text-secondary">Input</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-text-secondary">Balance: {parseFloat(balance0).toFixed(4)}</span>
                                <Faucet
                                    tokenAddress={token0.address}
                                    tokenSymbol={token0.symbol}
                                    onSuccess={refetchBalance0}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <input
                                type="number"
                                value={amount0}
                                onChange={(e) => setAmount0(e.target.value)}
                                placeholder="0.0"
                                className="bg-transparent text-2xl font-bold text-white placeholder-text-secondary/30 outline-none w-full"
                            />
                            <button
                                onClick={() => { setSelectingField('token0'); setIsTokenSelectorOpen(true); }}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 font-bold shrink-0"
                            >
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                                    {token0.logo}
                                </div>
                                {token0.symbol}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center -my-2 relative z-10">
                        <div className="bg-[#0A0E27] p-1 rounded-full border border-white/10">
                            <PlusIcon />
                        </div>
                    </div>

                    {/* Token 1 Input */}
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-text-secondary">Input</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-text-secondary">Balance: {parseFloat(balance1).toFixed(4)}</span>
                                <Faucet
                                    tokenAddress={token1.address}
                                    tokenSymbol={token1.symbol}
                                    onSuccess={refetchBalance1}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <input
                                type="number"
                                value={amount1}
                                onChange={(e) => setAmount1(e.target.value)}
                                placeholder="0.0"
                                className="bg-transparent text-2xl font-bold text-white placeholder-text-secondary/30 outline-none w-full"
                            />
                            <button
                                onClick={() => { setSelectingField('token1'); setIsTokenSelectorOpen(true); }}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 font-bold shrink-0"
                            >
                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs">
                                    {token1.logo}
                                </div>
                                {token1.symbol}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {needsApproval0 && (
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={approve0}
                            isLoading={isApproving0 || isConfirmingApprove0}
                            disabled={!poolAddress}
                        >
                            Approve {token0.symbol}
                        </Button>
                    )}
                    {needsApproval1 && (
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={approve1}
                            isLoading={isApproving1 || isConfirmingApprove1}
                            disabled={!poolAddress}
                        >
                            Approve {token1.symbol}
                        </Button>
                    )}

                    <Button
                        className="w-full"
                        glow
                        onClick={handleAddLiquidity}
                        isLoading={isAdding || isConfirmingAdd}
                        disabled={!poolAddress || !amount0 || !amount1 || !!needsApproval0 || !!needsApproval1}
                    >
                        {isAdding || isConfirmingAdd ? 'Adding Liquidity...' : 'Add Liquidity'}
                    </Button>
                </div>
            </Card>

            <TokenSelector
                isOpen={isTokenSelectorOpen}
                onClose={() => setIsTokenSelectorOpen(false)}
                onSelect={handleTokenSelect}
                selectedToken={selectingField === 'token0' ? token0 : token1}
            />
        </div>
    );
};

const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);
