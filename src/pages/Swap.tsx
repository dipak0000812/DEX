import { useState, useEffect } from 'react';
import { Settings, ArrowDown, Info, ChevronDown, RefreshCw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
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
    const [showChart, setShowChart] = useState(false);

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
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 min-h-[80vh] px-4 pt-12">

            {/* Chart Section (Toggleable) */}
            <AnimatePresence>
                {showChart && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 'auto' }}
                        exit={{ opacity: 0, x: -20, width: 0 }}
                        className="hidden lg:block w-full max-w-2xl overflow-hidden"
                    >
                        <GlassCard className="h-[600px] p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs border-2 border-background z-10">{fromToken.logo}</div>
                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs border-2 border-background">{toToken.logo}</div>
                                    </div>
                                    <h3 className="text-xl font-bold">{fromToken.symbol}/{toToken.symbol}</h3>
                                </div>
                                <div className="flex gap-2">
                                    {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
                                        <button key={tf} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${tf === '1D' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}>
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mock Chart Area */}
                            <div className="w-full h-[450px] bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-center justify-center text-text-secondary/30 font-medium">
                                    Interactive Chart Coming Soon
                                </div>
                                {/* Animated Line */}
                                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                    <path
                                        d="M0,400 C100,350 200,420 300,300 C400,180 500,250 600,200 C700,150 800,100 900,120"
                                        fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="3"
                                        className="drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#00F5FF" />
                                            <stop offset="100%" stopColor="#B026FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-[60px] rounded-full pointer-events-none" />

                <GlassCard className="relative backdrop-blur-xl border-white/10 shadow-2xl p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-bold">Swap</h2>
                            <button
                                onClick={() => setShowChart(!showChart)}
                                className={`p-2 rounded-lg transition-colors ${showChart ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-text-secondary'}`}
                            >
                                <TrendingUp className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                                <RefreshCw className="w-4 h-4 text-text-secondary" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                                <Settings className="w-5 h-5 text-text-secondary" />
                            </Button>
                        </div>
                    </div>

                    {/* From Input */}
                    <div className="bg-black/40 rounded-2xl p-4 mb-2 border border-white/5 hover:border-white/10 transition-colors group focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(0,245,255,0.1)]">
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
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 font-bold shrink-0 border border-white/5"
                            >
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs shadow-lg">
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
                                className="text-xs text-primary hover:text-primary/80 font-bold bg-primary/10 px-2 py-1 rounded-md transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                    </div>

                    {/* Swap Direction Button */}
                    <div className="relative h-4 -my-2 z-10">
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <button
                                onClick={() => {
                                    const temp = fromToken;
                                    setFromToken(toToken);
                                    setToToken(temp);
                                    setFromAmount('');
                                }}
                                className="bg-[#0A0E27] border-4 border-[#0A0E27] p-2 rounded-xl hover:scale-110 hover:rotate-180 transition-all duration-500 cursor-pointer group shadow-lg"
                            >
                                <div className="bg-white/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <ArrowDown className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* To Input */}
                    <div className="bg-black/40 rounded-2xl p-4 mt-2 mb-6 border border-white/5 hover:border-white/10 transition-colors group focus-within:border-secondary/50 focus-within:shadow-[0_0_20px_rgba(176,38,255,0.1)]">
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
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 font-bold shrink-0 border border-white/5"
                            >
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs shadow-lg">
                                    {toToken.logo}
                                </div>
                                {toToken.symbol}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-sm text-text-secondary mt-2">≈ $0.00</div>
                    </div>

                    {/* Swap Details */}
                    <AnimatePresence>
                        {quoteFormatted && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white/5 rounded-xl p-4 mb-6 text-sm space-y-3 border border-white/5"
                            >
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Rate</span>
                                    <span className="font-medium flex items-center gap-1">
                                        1 {fromToken.symbol} = {(parseFloat(quoteFormatted) / parseFloat(fromAmount)).toFixed(4)} {toToken.symbol}
                                        <RefreshCw className="w-3 h-3 text-text-secondary" />
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
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                            className="w-full text-lg font-bold py-6 bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
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
                            variant="primary"
                            onClick={handleSwap}
                            isLoading={isSwapPending || isSwapConfirming}
                            disabled={!fromAmount || !quoteFormatted || parseFloat(fromAmount) > parseFloat(fromBalance) || isLoading}
                        >
                            {isSwapPending ? 'Swapping...' : isSwapConfirming ? 'Confirming Swap...' : parseFloat(fromAmount) > parseFloat(fromBalance) ? 'Insufficient Balance' : 'Swap'}
                        </Button>
                    )}

                    {/* Success Message */}
                    <AnimatePresence>
                        {isSwapSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-2 text-green-400 text-sm"
                            >
                                <Info className="w-4 h-4" />
                                Swap successful! View on explorer
                            </motion.div>
                        )}
                    </AnimatePresence>

                </GlassCard>
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
