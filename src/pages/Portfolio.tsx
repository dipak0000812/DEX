import { Wallet, TrendingUp, PieChart, History, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useWallet } from '../hooks/useWallet';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useUserPositions } from '../hooks/useUserPositions';
import { TOKENS } from '../contracts/addresses';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PerformanceAnalytics } from '../features/PerformanceAnalytics';
import { MilestonePopup, MILESTONES } from '../features/TradingMilestones';
import { useState, useEffect } from 'react';

const Portfolio = () => {
    const { address, isConnected, connectWallet, balanceFormatted } = useWallet();
    const [showMilestone, setShowMilestone] = useState(false);

    // Demo: Trigger milestone popup on mount
    useEffect(() => {
        if (isConnected) {
            const timer = setTimeout(() => setShowMilestone(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [isConnected]);

    // Fetch balances for all tokens
    const { balanceFormatted: balanceSwift } = useTokenBalance(TOKENS.SWIFT.address, address);
    const { balanceFormatted: balanceBolt } = useTokenBalance(TOKENS.BOLT.address, address);
    const { balanceFormatted: balanceFlash } = useTokenBalance(TOKENS.FLASH.address, address);

    const { data: positions } = useUserPositions(address);

    // Calculate total value (Mock prices for demo)
    const priceETH = 1800;
    const priceSwift = 10;
    const priceBolt = 20;
    const priceFlash = 15;

    const valueETH = parseFloat(balanceFormatted) * priceETH;
    const valueSwift = parseFloat(balanceSwift) * priceSwift;
    const valueBolt = parseFloat(balanceBolt) * priceBolt;
    const valueFlash = parseFloat(balanceFlash) * priceFlash;

    // Mock position value
    const valuePositions = (positions?.length || 0) * 1000; // Placeholder

    const totalValue = valueETH + valueSwift + valueBolt + valueFlash + valuePositions;

    const assets = [
        { symbol: 'ETH', name: 'Ethereum', balance: balanceFormatted, value: valueETH, color: '#627EEA' },
        { symbol: 'SWIFT', name: 'Swift Protocol', balance: balanceSwift, value: valueSwift, color: '#0EA5E9' },
        { symbol: 'BOLT', name: 'Bolt Network', balance: balanceBolt, value: valueBolt, color: '#06B6D4' },
        { symbol: 'FLASH', name: 'Flash Finance', balance: balanceFlash, value: valueFlash, color: '#22D3EE' },
    ].filter(a => parseFloat(a.balance) > 0);

    // MOCK DATA: If portfolio is empty, show some fake assets for demo purposes
    const displayAssets = assets.length > 0 ? assets : [
        { symbol: 'BTC', name: 'Bitcoin (Mock)', balance: '0.45', value: 15430.50, color: '#F7931A' },
        { symbol: 'ETH', name: 'Ethereum (Mock)', balance: '4.2', value: 7560.00, color: '#627EEA' },
        { symbol: 'USDT', name: 'Tether (Mock)', balance: '5430.00', value: 5430.00, color: '#26A17B' },
    ];

    const displayTotalValue = assets.length > 0 ? totalValue : displayAssets.reduce((acc, curr) => acc + curr.value, 0);

    const allocationData = displayAssets.map(a => ({ name: a.symbol, value: a.value }));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <AnimatePresence>
                {showMilestone && (
                    <MilestonePopup
                        milestone={MILESTONES[0]}
                        onClose={() => setShowMilestone(false)}
                    />
                )}
            </AnimatePresence>

            {!isConnected ? (
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <GlassCard className="p-12 max-w-lg w-full flex flex-col items-center border-blue-500/20">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-8 animate-float shadow-[0_0_30px_rgba(14,165,233,0.2)]">
                            <Wallet className="w-12 h-12 text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Connect your wallet</h1>
                        <p className="text-gray-400 mb-8 text-lg">
                            Connect your wallet to access institutional-grade analytics and manage your positions.
                        </p>
                        <Button size="lg" glow onClick={connectWallet} className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-cyan-400 border-none">Connect Wallet</Button>
                    </GlassCard>
                </div>
            ) : (
                <div className="relative z-10 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Portfolio</h1>
                            <div className="flex items-center gap-2 text-gray-400">
                                <CreditCard className="w-4 h-4" />
                                <span>Net Worth Overview</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-cyan-400 drop-shadow-lg">
                                ${displayTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-green-400 flex items-center justify-end gap-1 text-sm font-medium mt-1 bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20 w-fit ml-auto">
                                <TrendingUp className="w-4 h-4" /> +2.4% (24h)
                            </div>
                        </div>
                    </div>

                    {/* Performance Analytics */}
                    <PerformanceAnalytics />

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Asset Allocation */}
                        <motion.div variants={itemVariants}>
                            <GlassCard className="p-6 h-full border-blue-500/10">
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                    <PieChart className="w-5 h-5 text-blue-400" />
                                    Allocation
                                </h3>
                                <div className="h-[250px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPie>
                                            <Pie
                                                data={allocationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {displayAssets.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(10, 22, 40, 0.9)',
                                                    border: '1px solid rgba(14,165,233,0.1)',
                                                    borderRadius: '12px',
                                                    backdropFilter: 'blur(10px)'
                                                }}
                                                itemStyle={{ color: '#fff' }}
                                                formatter={(value: number) => `$${value.toFixed(2)}`}
                                            />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                    {/* Center Text */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                        <div className="text-xs text-gray-400">Total</div>
                                        <div className="font-bold text-lg">${displayTotalValue.toLocaleString(undefined, { notation: 'compact' })}</div>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-3">
                                    {displayAssets.map((asset) => (
                                        <div key={asset.symbol} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: asset.color, color: asset.color }} />
                                                <span className="text-gray-400 font-medium">{asset.symbol}</span>
                                            </div>
                                            <div className="font-bold">{((asset.value / displayTotalValue) * 100).toFixed(1)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Assets List */}
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <GlassCard className="p-6 h-full border-blue-500/10">
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                    <Wallet className="w-5 h-5 text-blue-400" />
                                    Your Assets
                                </h3>
                                <div className="space-y-4">
                                    {displayAssets.map((asset) => (
                                        <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-xl shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                                    {asset.symbol[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg group-hover:text-blue-400 transition-colors">{asset.name}</div>
                                                    <div className="text-sm text-gray-400">{parseFloat(asset.balance).toFixed(4)} {asset.symbol}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                                <div className="text-sm text-green-400 flex items-center justify-end gap-1">
                                                    <TrendingUp className="w-3 h-3" /> +0.0%
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {positions?.map((pos) => (
                                        <div key={pos.poolAddress} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/20 hover:border-blue-500/50 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center border-4 border-[#0A1628] text-sm font-bold shadow-lg z-10">
                                                        {pos.token0[0]}
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center border-4 border-[#0A1628] text-sm font-bold shadow-lg">
                                                        {pos.token1[0]}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{pos.poolName} LP</div>
                                                    <div className="text-sm text-gray-400">Liquidity Position</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg">{parseFloat(pos.liquidityFormatted).toFixed(4)} LP</div>
                                                <div className="text-sm text-blue-400 font-medium flex items-center justify-end gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                                    Active
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div variants={itemVariants} className="lg:col-span-3">
                            <GlassCard className="p-6 border-blue-500/10">
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                    <History className="w-5 h-5 text-blue-400" />
                                    Recent Activity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { action: 'Swap', desc: 'SWIFT to BOLT', amount: '100 SWIFT', time: '2 mins ago', status: 'Success', icon: ArrowUpRight, color: 'text-blue-400' },
                                        { action: 'Add Liquidity', desc: 'SWIFT/BOLT Pool', amount: '500 LP', time: '1 hour ago', status: 'Success', icon: TrendingUp, color: 'text-green-400' },
                                        { action: 'Swap', desc: 'ETH to SWIFT', amount: '0.5 ETH', time: '5 hours ago', status: 'Success', icon: ArrowDownRight, color: 'text-purple-400' },
                                    ].map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${tx.color} group-hover:scale-110 transition-transform`}>
                                                    <tx.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{tx.action}</div>
                                                    <div className="text-xs text-gray-400">{tx.desc}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold">{tx.amount}</div>
                                                <div className="text-xs text-gray-400">{tx.time}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
