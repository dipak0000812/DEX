import { useState, useEffect } from 'react';
import { Settings, ArrowDown, Info, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TokenSelector } from '../components/TokenSelector';
import { Faucet } from '../components/Faucet';
import { useWallet } from '../hooks/useWallet';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useTokenApproval } from '../hooks/useTokenApproval';
import { useSwap } from '../hooks/useSwap';
import { TOKENS, POOLS, type Token } from '../contracts/addresses';
import { useReadContract } from 'wagmi';
import { ERC20_ABI } from '../contracts/abis/ERC20ABI';
import { formatUnits, parseUnits } from 'viem';


const Swap = () => {
    const { address, isConnected, connectWallet } = useWallet();

    // State with explicit type
    const [fromToken, setFromToken] = useState<Token>(TOKENS.TKA);
    const [toToken, setToToken] = useState<Token>(TOKENS.TKB);
    const [fromAmount, setFromAmount] = useState('');
    const [slippage] = useState(0.5); // 0.5%

    // Token Selection State
    const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false);
    const [selectingField, setSelectingField] = useState<'from' | 'to'>('from');

    const openTokenSelector = (field: 'from' | 'to') => {
        setSelectingField(field);
        setIsTokenSelectorOpen(true);
    };

    const handleTokenSelect = (token: Token) => {
        if (selectingField === 'from') {
            if (token.address === toToken.address) {
                setToToken(fromToken);
            }
            setFromToken(token);
        } else {
            if (token.address === fromToken.address) {
                setFromToken(toToken);
            }
            setToToken(token);
        }
    };

    // Balances
    const { balanceFormatted: fromBalance, refetch: refetchFrom } = useTokenBalance(fromToken.address, address);
    const { balanceFormatted: toBalance, refetch: refetchTo } = useTokenBalance(toToken.address, address);

    // Find Pool
    let poolAddress = '';
    const pair1 = `${fromToken.symbol}-${toToken.symbol}`;
    const pair2 = `${toToken.symbol}-${fromToken.symbol}`;

    // Use type assertion or check keys safely
    if (Object.prototype.hasOwnProperty.call(POOLS, pair1)) {
        poolAddress = POOLS[pair1 as keyof typeof POOLS];
    } else if (Object.prototype.hasOwnProperty.call(POOLS, pair2)) {
        poolAddress = POOLS[pair2 as keyof typeof POOLS];
    }

    // Quote
    const { data: quoteAmount, isLoading: isQuoteLoading } = useReadContract({
        address: poolAddress as `0x${string}`,
        abi: [
            {
                inputs: [
                    { name: "tokenIn", type: "address" },
                    { name: "amountIn", type: "uint256" }
                ],
                name: "getQuote",
                outputs: [{ name: "amountOut", type: "uint256" }],
                stateMutability: "view",
                type: "function"
            }
        ],
        functionName: 'getQuote',
        args: poolAddress && fromAmount ? [fromToken.address as `0x${string}`, parseUnits(fromAmount, 18)] : undefined,
        query: {
            enabled: !!poolAddress && !!fromAmount && parseFloat(fromAmount) > 0,
            refetchInterval: 5000
        }
    });

    const quoteFormatted = quoteAmount ? formatUnits(quoteAmount as bigint, 18) : '';

    // Approval
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: fromToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: address ? [address as `0x${string}`, poolAddress as `0x${string}`] : undefined,
        query: {
            enabled: !!address && !!poolAddress,
        }
    });

    const { approve, isPending: isApprovePending, isConfirming: isApproveConfirming, isSuccess: isApproveSuccess } = useTokenApproval(
        fromToken.address,
        poolAddress,
        fromAmount
    );

    // Swap
    const { executeSwap, isPending: isSwapPending, isConfirming: isSwapConfirming, isSuccess: isSwapSuccess } = useSwap();

    // Effects
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    useEffect(() => {
        if (isSwapSuccess) {
            setFromAmount('');
            refetchFrom();
            refetchTo();
        }
    }, [isSwapSuccess, refetchFrom, refetchTo]);

    // Handlers
    const handleSwap = () => {
        if (!quoteFormatted) return;

        // Calculate min output with slippage
        const amountOutMin = (BigInt(quoteAmount as bigint) * BigInt((100 - slippage) * 100)) / 10000n;

        executeSwap(
            poolAddress,
            fromToken.address,
            fromAmount,
            formatUnits(amountOutMin, 18)
        );
    };

    const needsApproval = allowance !== undefined && fromAmount && allowance < parseUnits(fromAmount, 18);
    const isLoading = isQuoteLoading || isApprovePending || isApproveConfirming || isSwapPending || isSwapConfirming;

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-[60px] rounded-full pointer-events-none" />

                <Card className="relative backdrop-blur-xl border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Swap</h2>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Settings className="w-5 h-5 text-text-secondary" />
                            </Button>
                        </div>
                    </div>

                    {/* From Input */}
                    <div className="bg-black/20 rounded-2xl p-4 mb-2 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-text-secondary">From</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-text-secondary">
                                    Balance: {parseFloat(fromBalance).toFixed(4)}
                                </span>
                                <Faucet
                                    tokenAddress={fromToken.address}
                                    tokenSymbol={fromToken.symbol}
                                    onSuccess={refetchFrom}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <input
                                type="number"
                                placeholder="0.0"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                className="bg-transparent text-3xl font-bold text-white placeholder-text-secondary/30 outline-none w-full"
                            />
                            <button
                                onClick={() => openTokenSelector('from')}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 font-bold shrink-0"
                            >
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                                    {fromToken.logo}
                                </div>
                                {fromToken.symbol}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex justify-between mt-2">
                            <div className="text-sm text-text-secondary">≈ $0.00</div>
                            <button
                                onClick={() => setFromAmount(fromBalance)}
                                className="text-xs text-primary hover:text-primary/80 font-medium"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    {/* Swap Direction Button */}
                    <div className="relative h-2">
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <button
                                onClick={() => {
                                    const temp = fromToken;
                                    setFromToken(toToken);
                                    setToToken(temp);
                                    setFromAmount('');
                                }}
                                className="bg-[#1a1f3d] border border-white/10 p-2 rounded-xl hover:scale-110 transition-transform cursor-pointer group"
                            >
                                <ArrowDown className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* To Input */}
                    <div className="bg-black/20 rounded-2xl p-4 mt-2 mb-6 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-text-secondary">To</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-text-secondary">
                                    Balance: {parseFloat(toBalance).toFixed(4)}
                                </span>
                                <Faucet
                                    tokenAddress={toToken.address}
                                    tokenSymbol={toToken.symbol}
                                    onSuccess={refetchTo}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center">
                            <input
                                type="number"
                                placeholder="0.0"
                                value={quoteFormatted}
                                readOnly
                                className="bg-transparent text-3xl font-bold text-white placeholder-text-secondary/30 outline-none w-full"
                            />
                            <button
                                onClick={() => openTokenSelector('to')}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 font-bold shrink-0"
                            >
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs">
                                    {toToken.logo}
                                </div>
                                {toToken.symbol}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-sm text-text-secondary mt-2">≈ $0.00</div>
                    </div>

                    {/* Swap Details */}
                    {quoteFormatted && (
                        <div className="bg-white/5 rounded-xl p-3 mb-6 text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Rate</span>
                                <span className="font-medium">
                                    1 {fromToken.symbol} = {(parseFloat(quoteFormatted) / parseFloat(fromAmount)).toFixed(4)} {toToken.symbol}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary flex items-center gap-1">
                                    Network Cost <Info className="w-3 h-3" />
                                </span>
                                <span className="font-medium">~$0.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Price Impact</span>
                                <span className="font-medium text-green-400">~0.05%</span>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    {!isConnected ? (
                        <Button
                            size="lg"
                            className="w-full text-lg font-bold py-6"
                            glow
                            onClick={connectWallet}
                        >
                            Connect Wallet
                        </Button>
                    ) : !poolAddress ? (
                        <Button
                            size="lg"
                            className="w-full text-lg font-bold py-6"
                            disabled
                        >
                            Pool Not Found
                        </Button>
                    ) : needsApproval ? (
                        <Button
                            size="lg"
                            className="w-full text-lg font-bold py-6"
                            glow
                            onClick={approve}
                            isLoading={isApprovePending || isApproveConfirming}
                        >
                            {isApprovePending ? 'Approving...' : isApproveConfirming ? 'Confirming Approval...' : `Approve ${fromToken.symbol}`}
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full text-lg font-bold py-6"
                            glow
                            onClick={handleSwap}
                            isLoading={isSwapPending || isSwapConfirming}
                            disabled={!fromAmount || !quoteFormatted || parseFloat(fromAmount) > parseFloat(fromBalance) || isLoading}
                        >
                            {isSwapPending ? 'Swapping...' : isSwapConfirming ? 'Confirming Swap...' : parseFloat(fromAmount) > parseFloat(fromBalance) ? 'Insufficient Balance' : 'Swap'}
                        </Button>
                    )}

                    {/* Success Message */}
                    {isSwapSuccess && (
                        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-2 text-green-400 text-sm">
                            <Info className="w-4 h-4" />
                            Swap successful! View on explorer
                        </div>
                    )}

                </Card>
            </motion.div>

            <TokenSelector
                isOpen={isTokenSelectorOpen}
                onClose={() => setIsTokenSelectorOpen(false)}
                onSelect={handleTokenSelect}
                selectedToken={selectingField === 'from' ? fromToken : toToken}
            />
        </div>
    );
};

export default Swap;
