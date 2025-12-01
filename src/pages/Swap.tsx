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
    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [slippage, setSlippage] = useState(0.5);
    const [deadline, setDeadline] = useState(20); // minutes
    const [expertMode, setExpertMode] = useState(false);
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
                        <GlassCard className="h-[600px] p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs border-2 border-background z-10">{fromToken.logo}</div>
                                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs border-2 border-background">{toToken.logo}</div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            {fromToken.symbol}/{toToken.symbol}
                                            <span className="text-sm font-normal text-text-secondary bg-white/5 px-2 py-0.5 rounded">V3</span>
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-bold text-2xl">1,850.24</span>
                                            <span className="text-green-400">+2.4%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                                    {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
                                        <button key={tf} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${tf === '1D' ? 'bg-white/10 text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}>
                                            {tf}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Mock Chart */}
                            <div className="flex-1 w-full bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-white/5 relative overflow-hidden group">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
                                    {[...Array(24)].map((_, i) => (
                                        <div key={i} className="border-r border-b border-white/5" />
                                    ))}
                                </div>

                                {/* Candles (Mock) */}
                                <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
                                    {[...Array(20)].map((_, i) => {
                                        const height = Math.random() * 60 + 20;
                                        const isGreen = Math.random() > 0.4;
                                        return (
                                            <div key={i} className="flex flex-col items-center gap-1 w-2 group/candle">
                                                <div className={`w-[1px] h-full ${isGreen ? 'bg-green-500/50' : 'bg-red-500/50'}`} style={{ height: `${height + 20}%` }} />
                                                <div
                                                    className={`w-full rounded-sm ${isGreen ? 'bg-green-500' : 'bg-red-500'}`}
                                                    style={{ height: `${height}%` }}
                                                />
                                                {/* Tooltip */}
                                                <div className="absolute top-4 opacity-0 group-hover/candle:opacity-100 bg-black/80 text-[10px] p-1 rounded text-white whitespace-nowrap z-10 pointer-events-none transition-opacity">
                                                    Open: 1840.2<br />Close: 1850.5
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Current Price Line */}
                                <div className="absolute top-[30%] left-0 right-0 border-t border-dashed border-primary/50 flex items-center">
                                    <div className="absolute right-0 bg-primary text-black text-xs font-bold px-1 rounded-l">1850.24</div>
                                </div>
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
                        <div className="flex gap-2 relative">
                            <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
                                <RefreshCw className="w-4 h-4 text-text-secondary" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full w-10 h-10 p-0 ${isSettingsOpen ? 'bg-white/10 text-white' : ''}`}
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            >
                                <Settings className="w-5 h-5 text-text-secondary" />
                            </Button>

                            {/* Settings Dropdown */}
                            <AnimatePresence>
                                {isSettingsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute top-12 right-0 w-72 bg-[#0A0E27] border border-white/10 rounded-2xl shadow-xl p-4 z-50"
                                    >
                                        <h3 className="text-sm font-bold mb-4">Transaction Settings</h3>

                                        {/* Slippage */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="text-xs text-text-secondary">Slippage Tolerance</span>
                                                <Info className="w-3 h-3 text-text-secondary" />
                                            </div>
                                            <div className="flex gap-2 mb-2">
                                                {[0.1, 0.5, 1.0].map((val) => (
                                                    <button
                                                        key={val}
                                                        onClick={() => setSlippage(val)}
                                                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${slippage === val ? 'bg-primary text-black' : 'bg-white/5 hover:bg-white/10'}`}
                                                    >
                                                        {val}%
                                                    </button>
                                                ))}
                                                <div className="relative flex-1">
                                                    <input
                                                        type="number"
                                                        value={slippage}
                                                        onChange={(e) => setSlippage(parseFloat(e.target.value))}
                                                        className="w-full h-full bg-white/5 rounded-lg px-2 text-right text-sm outline-none border border-transparent focus:border-primary/50"
                                                    />
                                                    <span className="absolute right-7 top-1.5 text-xs text-text-secondary">%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Deadline */}
                                        <div className="mb-4">
                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="text-xs text-text-secondary">Transaction Deadline</span>
                                                <Info className="w-3 h-3 text-text-secondary" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={deadline}
                                                    onChange={(e) => setDeadline(parseInt(e.target.value))}
                                                    className="w-20 bg-white/5 rounded-lg px-3 py-1.5 text-right text-sm outline-none border border-transparent focus:border-primary/50"
                                                />
                                                <span className="text-sm text-text-secondary">minutes</span>
                                            </div>
                                        </div>

                                        {/* Expert Mode */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-sm font-medium">Expert Mode</span>
                                            <button
                                                onClick={() => setExpertMode(!expertMode)}
                                                className={`w-10 h-6 rounded-full transition-colors relative ${expertMode ? 'bg-primary' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${expertMode ? 'left-5' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
