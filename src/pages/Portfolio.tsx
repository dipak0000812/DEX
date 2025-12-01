import { Wallet, TrendingUp, PieChart, History, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useWallet } from '../hooks/useWallet';
import { useTokenBalance } from '../hooks/useTokenBalance';
import { useUserPositions } from '../hooks/useUserPositions';
import { TOKENS } from '../contracts/addresses';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Portfolio = () => {
    const { address, isConnected, connectWallet, balanceFormatted } = useWallet();

    // Fetch balances for all tokens
    const { balanceFormatted: balanceA } = useTokenBalance(TOKENS.TKA.address, address);
    const { balanceFormatted: balanceB } = useTokenBalance(TOKENS.TKB.address, address);
    const { balanceFormatted: balanceC } = useTokenBalance(TOKENS.TKC.address, address);

    const { data: positions } = useUserPositions(address);

    // Calculate total value (Mock prices for demo)
    const priceETH = 1800;
    const priceA = 10;
    const priceB = 20;
    const priceC = 15;

    const valueETH = parseFloat(balanceFormatted) * priceETH;
    const valueA = parseFloat(balanceA) * priceA;
    const valueB = parseFloat(balanceB) * priceB;
    const valueC = parseFloat(balanceC) * priceC;

    // Mock position value
    const valuePositions = (positions?.length || 0) * 1000; // Placeholder

    const totalValue = valueETH + valueA + valueB + valueC + valuePositions;

    const assets = [
        { symbol: 'ETH', name: 'Ethereum', balance: balanceFormatted, value: valueETH, color: '#627EEA' },
        { symbol: 'TKA', name: 'Token A', balance: balanceA, value: valueA, color: '#3B82F6' },
        { symbol: 'TKB', name: 'Token B', balance: balanceB, value: valueB, color: '#8B5CF6' },
        { symbol: 'TKC', name: 'Token C', balance: balanceC, value: valueC, color: '#EC4899' },
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
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            {!isConnected ? (
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <GlassCard className="p-12 max-w-lg w-full flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-8 animate-float shadow-[0_0_30px_rgba(0,245,255,0.2)]">
                            <Wallet className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Connect your wallet</h1>
                        <p className="text-text-secondary mb-8 text-lg">
                            Connect your wallet to view your portfolio, track your assets, and manage your liquidity positions.
                        </p>
                        <Button size="lg" glow onClick={connectWallet} className="w-full text-lg py-6">Connect Wallet</Button>
                    </GlassCard>
                </div>
            ) : (
                <div className="relative z-10 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Portfolio</h1>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <CreditCard className="w-4 h-4" />
                                <span>Net Worth Overview</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary drop-shadow-lg">
                                ${displayTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-green-400 flex items-center justify-end gap-1 text-sm font-medium mt-1 bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20 w-fit ml-auto">
                                <TrendingUp className="w-4 h-4" /> +2.4% (24h)
                            </div>
                        </div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Asset Allocation */}
                        <motion.div variants={itemVariants}>
                            <GlassCard className="p-6 h-full">
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                    <PieChart className="w-5 h-5 text-primary" />
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
                                                    backgroundColor: 'rgba(10, 14, 39, 0.9)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
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
                                        <div className="text-xs text-text-secondary">Total</div>
                                        <div className="font-bold text-lg">${displayTotalValue.toLocaleString(undefined, { notation: 'compact' })}</div>
                                    </div>
                                </div>
                                <div className="mt-6 space-y-3">
                                    {displayAssets.map((asset) => (
                                        <div key={asset.symbol} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: asset.color, color: asset.color }} />
                                                <span className="text-text-secondary font-medium">{asset.symbol}</span>
                                            </div>
                                            <div className="font-bold">{((asset.value / displayTotalValue) * 100).toFixed(1)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Assets List */}
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <GlassCard className="p-6 h-full">
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                    <Wallet className="w-5 h-5 text-primary" />
                                    Your Assets
                                </h3>
                                <div className="space-y-4">
                                    {displayAssets.map((asset) => (
                                        <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-xl shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                                    {asset.symbol[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg group-hover:text-primary transition-colors">{asset.name}</div>
                                                    <div className="text-sm text-text-secondary">{parseFloat(asset.balance).toFixed(4)} {asset.symbol}</div>
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
                                        <div key={pos.poolAddress} className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 hover:border-primary/50 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-3">
                                                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center border-4 border-[#0A0E27] text-sm font-bold shadow-lg z-10">
                                                        {pos.token0[0]}
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center border-4 border-[#0A0E27] text-sm font-bold shadow-lg">
                                                        {pos.token1[0]}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg text-white group-hover:text-primary transition-colors">{pos.poolName} LP</div>
                                                    <div className="text-sm text-text-secondary">Liquidity Position</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg">{parseFloat(pos.liquidityFormatted).toFixed(4)} LP</div>
                                                <div className="text-sm text-primary font-medium flex items-center justify-end gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
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
                            <GlassCard className="p-6">
                                <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                                    <History className="w-5 h-5 text-primary" />
                                    Recent Activity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { action: 'Swap', desc: 'TKA to TKB', amount: '100 TKA', time: '2 mins ago', status: 'Success', icon: ArrowUpRight, color: 'text-blue-400' },
                                        { action: 'Add Liquidity', desc: 'TKA/TKB Pool', amount: '500 LP', time: '1 hour ago', status: 'Success', icon: TrendingUp, color: 'text-green-400' },
                                        { action: 'Swap', desc: 'ETH to TKA', amount: '0.5 ETH', time: '5 hours ago', status: 'Success', icon: ArrowDownRight, color: 'text-purple-400' },
                                    ].map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center ${tx.color} group-hover:scale-110 transition-transform`}>
                                                    <tx.icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold">{tx.action}</div>
                                                    <div className="text-xs text-text-secondary">{tx.desc}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold">{tx.amount}</div>
                                                <div className="text-xs text-text-secondary">{tx.time}</div>
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
