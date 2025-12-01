import { useState, useEffect } from 'react';
import { X, ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
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
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
                    >
                        <GlassCard className="w-full p-6 relative border-primary/20 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Add Liquidity</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>
                            </div>

                            {!poolAddress ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <div className="text-sm text-red-200">
                                        Pool not found for this pair. Please select a valid pair (e.g., TKA-TKB).
                                    </div>
                                </div>
                            ) : null}

                            <div className="space-y-6 mb-6">
                                {/* Pair Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs border-2 border-background z-10">{token0.logo}</div>
                                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs border-2 border-background">{token1.logo}</div>
                                        </div>
                                        <span className="font-bold text-lg">{token0.symbol}/{token1.symbol}</span>
                                    </div>
                                    <div className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                                        V3 LP
                                    </div>
                                </div>

                                {/* Fee Tier Selector */}
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-text-secondary">Fee Tier</span>
                                        <span className="text-xs text-text-secondary">The % you will earn in fees</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['0.05%', '0.3%', '1%'].map((tier) => (
                                            <button
                                                key={tier}
                                                className={`p-3 rounded-xl border text-left transition-all ${tier === '0.3%' ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(0,245,255,0.2)]' : 'bg-white/5 border-white/5 text-text-secondary hover:bg-white/10'}`}
                                            >
                                                <div className="font-bold mb-1">{tier}</div>
                                                <div className="text-[10px] opacity-70">
                                                    {tier === '0.05%' ? 'Stable pairs' : tier === '0.3%' ? 'Most pairs' : 'Exotic pairs'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Deposit Amounts */}
                                <div className="space-y-4">
                                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-text-secondary font-medium">Deposit Amount</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-text-secondary">Balance: {parseFloat(balance0).toFixed(4)}</span>
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
                                                className="bg-transparent text-3xl font-bold text-white placeholder-text-secondary/30 outline-none w-full"
                                            />
                                            <button
                                                onClick={() => { setSelectingField('token0'); setIsTokenSelectorOpen(true); }}
                                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2 font-bold shrink-0 border border-white/5"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs shadow-inner">
                                                    {token0.logo}
                                                </div>
                                                {token0.symbol}
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-text-secondary font-medium">Deposit Amount</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-text-secondary">Balance: {parseFloat(balance1).toFixed(4)}</span>
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
                                                className="bg-transparent text-3xl font-bold text-white placeholder-text-secondary/30 outline-none w-full"
                                            />
                                            <button
                                                onClick={() => { setSelectingField('token1'); setIsTokenSelectorOpen(true); }}
                                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2 font-bold shrink-0 border border-white/5"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs shadow-inner">
                                                    {token1.logo}
                                                </div>
                                                {token1.symbol}
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Price Range Selector */}
                                <div>
                                    <div className="flex justify-between mb-4">
                                        <span className="text-sm font-medium text-text-secondary">Set Price Range</span>
                                        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20">Full Range</span>
                                    </div>

                                    {/* Mock Visualizer */}
                                    <div className="h-24 w-full bg-gradient-to-b from-white/5 to-transparent rounded-xl border border-white/5 relative mb-4 overflow-hidden">
                                        <div className="absolute inset-0 flex items-end justify-center px-8 pb-0">
                                            <div className="w-full h-16 bg-primary/20 rounded-t-xl blur-sm transform scale-y-75 origin-bottom" />
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white/20 border-r border-dashed border-white/40" />
                                            <div className="absolute top-2 right-2 text-[10px] text-text-secondary">Current Price: 1850.24</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/20 rounded-xl p-3 border border-white/5 text-center">
                                            <div className="text-xs text-text-secondary mb-1">Min Price</div>
                                            <div className="text-lg font-bold">1600.00</div>
                                            <div className="text-[10px] text-text-secondary">{token1.symbol} per {token0.symbol}</div>
                                            <div className="flex justify-center gap-2 mt-2">
                                                <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm">-</button>
                                                <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm">+</button>
                                            </div>
                                        </div>
                                        <div className="bg-black/20 rounded-xl p-3 border border-white/5 text-center">
                                            <div className="text-xs text-text-secondary mb-1">Max Price</div>
                                            <div className="text-lg font-bold">2100.00</div>
                                            <div className="text-[10px] text-text-secondary">{token1.symbol} per {token0.symbol}</div>
                                            <div className="flex justify-center gap-2 mt-2">
                                                <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm">-</button>
                                                <button className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {needsApproval0 && (
                                    <Button
                                        className="w-full py-6 text-lg"
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
                                        className="w-full py-6 text-lg"
                                        variant="outline"
                                        onClick={approve1}
                                        isLoading={isApproving1 || isConfirmingApprove1}
                                        disabled={!poolAddress}
                                    >
                                        Approve {token1.symbol}
                                    </Button>
                                )}

                                <Button
                                    className="w-full py-6 text-lg font-bold"
                                    glow
                                    onClick={handleAddLiquidity}
                                    isLoading={isAdding || isConfirmingAdd}
                                    disabled={!poolAddress || !amount0 || !amount1 || !!needsApproval0 || !!needsApproval1}
                                >
                                    {isAdding || isConfirmingAdd ? 'Adding Liquidity...' : 'Add Liquidity'}
                                </Button>
                            </div>
                        </GlassCard>
                    </motion.div>
                </>
            )}

            <TokenSelector
                isOpen={isTokenSelectorOpen}
                onClose={() => setIsTokenSelectorOpen(false)}
                onSelect={handleTokenSelect}
                selectedToken={selectingField === 'token0' ? token0 : token1}
            />
        </AnimatePresence>
    );
};
