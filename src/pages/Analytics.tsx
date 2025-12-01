import { BarChart3, DollarSign, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGlobalStats } from '../hooks/useGlobalStats';
import { useRecentSwaps } from '../hooks/useRecentSwaps';
import numeral from 'numeral';

const Analytics = () => {
    const { data: stats } = useGlobalStats();
    const { swaps } = useRecentSwaps();

    // MOCK DATA: Fallback if no real data
    const displayStats = stats || {
        tvl: 1250000,
        volume24h: 450000,
        fees24h: 1200,
        totalPools: 12,
        activePairs: 8
    };

    const mockSwaps = [
        { type: 'buy', pool: 'SWIFT-BOLT', amount0: '100', timestamp: Date.now() - 100000, hash: '0x1234567890' },
        { type: 'sell', pool: 'ETH-USDT', amount0: '0.5', timestamp: Date.now() - 200000, hash: '0xabcdef1234' },
        { type: 'buy', pool: 'BOLT-FLASH', amount0: '500', timestamp: Date.now() - 300000, hash: '0x7890123456' },
        { type: 'sell', pool: 'SWIFT-FLASH', amount0: '200', timestamp: Date.now() - 400000, hash: '0x9876543210' },
        { type: 'buy', pool: 'ETH-SWIFT', amount0: '1.2', timestamp: Date.now() - 500000, hash: '0xfedcba0987' },
    ];

    const displaySwaps = swaps.length > 0 ? swaps : mockSwaps;

    // Mock chart data
    const chartData = [
        { name: 'Mon', tvl: 1.1, vol: 0.4 },
        { name: 'Tue', tvl: 1.2, vol: 0.3 },
        { name: 'Wed', tvl: 1.15, vol: 0.6 },
        { name: 'Thu', tvl: 1.3, vol: 0.5 },
        { name: 'Fri', tvl: 1.4, vol: 0.8 },
        { name: 'Sat', tvl: 1.35, vol: 0.4 },
        { name: 'Sun', tvl: 1.5, vol: 0.7 },
    ];

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
                <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Analytics</h1>
                        <p className="text-text-secondary mt-1">Platform statistics and performance metrics</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-text-secondary text-sm font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Last 7 Days
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                            System Operational
                        </div>
                    </div>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <DollarSign className="w-24 h-24 text-primary" />
                            </div>
                            <div className="text-text-secondary text-sm mb-2 font-medium">24h Volume</div>
                            <div className="text-3xl font-bold mb-2 text-white">
                                {numeral(displayStats.volume24h).format('$0.00a')}
                            </div>
                            <div className="text-green-400 text-sm flex items-center gap-1 bg-green-500/10 w-fit px-2 py-0.5 rounded-lg border border-green-500/20">
                                <TrendingUp className="w-3 h-3" /> +8.2%
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6 relative overflow-hidden group hover:border-secondary/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <BarChart3 className="w-24 h-24 text-secondary" />
                            </div>
                            <div className="text-text-secondary text-sm mb-2 font-medium">24h Fees</div>
                            <div className="text-3xl font-bold mb-2 text-white">
                                {numeral(displayStats.fees24h).format('$0.00a')}
                            </div>
                            <div className="text-green-400 text-sm flex items-center gap-1 bg-green-500/10 w-fit px-2 py-0.5 rounded-lg border border-green-500/20">
                                <TrendingUp className="w-3 h-3" /> +5.7%
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6 relative overflow-hidden group hover:border-blue-400/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <Activity className="w-24 h-24 text-blue-400" />
                            </div>
                            <div className="text-text-secondary text-sm mb-2 font-medium">Total Value Locked</div>
                            <div className="text-3xl font-bold mb-2 text-white">
                                {numeral(displayStats.tvl).format('$0.00a')}
                            </div>
                            <div className="text-green-400 text-sm flex items-center gap-1 bg-green-500/10 w-fit px-2 py-0.5 rounded-lg border border-green-500/20">
                                <TrendingUp className="w-3 h-3" /> +2.4%
                            </div>
                        </GlassCard>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <GlassCard className="p-6 relative overflow-hidden group hover:border-purple-400/30 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <Activity className="w-24 h-24 text-purple-400" />
                            </div>
                            <div className="text-text-secondary text-sm mb-2 font-medium">Total Pools</div>
                            <div className="text-3xl font-bold mb-2 text-white">
                                {displayStats.totalPools}
                            </div>
                            <div className="text-text-secondary text-sm flex items-center gap-1 bg-white/5 w-fit px-2 py-0.5 rounded-lg border border-white/10">
                                {'activePairs' in displayStats ? displayStats.activePairs : 0} Active Pairs
                            </div>
                        </GlassCard>
                    </motion.div>
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <GlassCard className="lg:col-span-2 p-6 border-white/10">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="font-bold text-xl text-white">TVL & Volume</h3>
                                <p className="text-sm text-text-secondary">Platform performance over time</p>
                            </div>
                            <div className="flex gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
                                <button className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium shadow-sm transition-all">1W</button>
                                <button className="px-3 py-1.5 rounded-lg text-text-secondary text-sm font-medium hover:text-white hover:bg-white/5 transition-all">1M</button>
                                <button className="px-3 py-1.5 rounded-lg text-text-secondary text-sm font-medium hover:text-white hover:bg-white/5 transition-all">1Y</button>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7000FF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7000FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}M`}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(10, 14, 39, 0.9)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="tvl"
                                        stroke="#00F5FF"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorTvl)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="vol"
                                        stroke="#7000FF"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorVol)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 border-white/10 flex flex-col">
                        <h3 className="font-bold text-xl mb-6 text-white">Recent Swaps</h3>
                        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                            {displaySwaps.length > 0 ? (
                                displaySwaps.map((swap, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/5 shadow-inner ${swap.type === 'buy' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {swap.type === 'buy' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-white group-hover:text-primary transition-colors">
                                                    {swap.type === 'buy' ? 'Buy' : 'Sell'} {swap.pool}
                                                </div>
                                                <div className="text-xs text-text-secondary">
                                                    {new Date(swap.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm text-white">${Math.abs(parseFloat(swap.amount0)).toFixed(2)}</div>
                                            <div className="text-xs text-text-secondary font-mono bg-black/20 px-1.5 py-0.5 rounded ml-auto w-fit">{swap.hash.slice(0, 6)}...</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-text-secondary py-12 flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                                        <Activity className="w-6 h-6 opacity-50" />
                                    </div>
                                    No recent swaps detected
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
                            View All Transactions
                        </button>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
