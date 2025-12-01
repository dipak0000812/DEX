import { BarChart3, DollarSign, Activity, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
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
        { type: 'buy', pool: 'TKA-TKB', amount0: '100', timestamp: Date.now() - 100000, hash: '0x1234567890' },
        { type: 'sell', pool: 'ETH-USDT', amount0: '0.5', timestamp: Date.now() - 200000, hash: '0xabcdef1234' },
        { type: 'buy', pool: 'TKB-TKC', amount0: '500', timestamp: Date.now() - 300000, hash: '0x7890123456' },
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        System Operational
                    </span>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-16 h-16" />
                    </div>
                    <div className="text-text-secondary text-sm mb-2">24h Volume</div>
                    <div className="text-2xl font-bold mb-1">
                        {numeral(displayStats.volume24h).format('$0.00a')}
                    </div>
                    <div className="text-green-400 text-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +8.2%
                    </div>
                </Card>

                <Card className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart3 className="w-16 h-16" />
                    </div>
                    <div className="text-text-secondary text-sm mb-2">24h Fees</div>
                    <div className="text-2xl font-bold mb-1">
                        {numeral(displayStats.fees24h).format('$0.00a')}
                    </div>
                    <div className="text-green-400 text-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +5.7%
                    </div>
                </Card>

                <Card className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16" />
                    </div>
                    <div className="text-text-secondary text-sm mb-2">Total Pools</div>
                    <div className="text-2xl font-bold mb-1">
                        {displayStats.totalPools}
                    </div>
                    <div className="text-text-secondary text-sm">Active Pairs</div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">TVL & Volume</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg bg-white/10 text-sm hover:bg-white/20 transition-colors">1W</button>
                            <button className="px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm">1M</button>
                            <button className="px-3 py-1 rounded-lg bg-white/10 text-sm hover:bg-white/20 transition-colors">1Y</button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#A0AEC0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}M`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0A0E27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="tvl" stroke="#00F5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorTvl)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-lg mb-6">Recent Swaps</h3>
                    <div className="space-y-4">
                        {displaySwaps.length > 0 ? (
                            displaySwaps.map((swap, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${swap.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {swap.type === 'buy' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">
                                                {swap.type === 'buy' ? 'Buy' : 'Sell'} {swap.pool}
                                            </div>
                                            <div className="text-xs text-text-secondary">
                                                {new Date(swap.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-sm">${Math.abs(parseFloat(swap.amount0)).toFixed(2)}</div>
                                        <div className="text-xs text-text-secondary">{swap.hash.slice(0, 6)}...</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-text-secondary py-8">
                                No recent swaps detected
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
