import { Wallet, TrendingUp, PieChart, History } from 'lucide-react';
import { Card } from '../components/ui/Card';
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {!isConnected ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-float">
                        <Wallet className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Connect your wallet</h1>
                    <p className="text-text-secondary mb-8 max-w-md">
                        Connect your wallet to view your portfolio, track your assets, and manage your liquidity positions.
                    </p>
                    <Button size="lg" glow onClick={connectWallet}>Connect Wallet</Button>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
                            <div className="flex items-center gap-2 text-text-secondary">
                                <span>Net Worth</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                ${displayTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-green-400 flex items-center justify-end gap-1 text-sm font-medium">
                                <TrendingUp className="w-4 h-4" /> +2.4% (24h)
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Asset Allocation */}
                        <Card className="p-6">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
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
                                        >
                                            {displayAssets.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.1)" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0A0E27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value: number) => `$${value.toFixed(2)}`}
                                        />
                                    </RechartsPie>
                                </ResponsiveContainer>
                                {/* Center Text */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <div className="text-xs text-text-secondary">Total</div>
                                    <div className="font-bold">${displayTotalValue.toLocaleString(undefined, { notation: 'compact' })}</div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                {displayAssets.map((asset) => (
                                    <div key={asset.symbol} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                                            <span className="text-text-secondary">{asset.symbol}</span>
                                        </div>
                                        <div className="font-medium">{((asset.value / displayTotalValue) * 100).toFixed(1)}%</div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Assets List */}
                        <Card className="lg:col-span-2 p-6">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-primary" />
                                Your Assets
                            </h3>
                            <div className="space-y-4">
                                {displayAssets.map((asset) => (
                                    <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-bold text-lg">
                                                {asset.symbol[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold">{asset.name}</div>
                                                <div className="text-sm text-text-secondary">{parseFloat(asset.balance).toFixed(4)} {asset.symbol}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                            <div className="text-sm text-green-400">+0.0%</div>
                                        </div>
                                    </div>
                                ))}
                                {positions?.map((pos) => (
                                    <div key={pos.poolAddress} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-primary/20">
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-[#0A0E27] text-xs">
                                                    {pos.token0[0]}
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center border-2 border-[#0A0E27] text-xs">
                                                    {pos.token1[0]}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{pos.poolName} LP</div>
                                                <div className="text-sm text-text-secondary">Liquidity Position</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">{parseFloat(pos.liquidityFormatted).toFixed(4)} LP</div>
                                            <div className="text-sm text-primary">Active</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="p-6">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <History className="w-5 h-5 text-primary" />
                                Recent Activity
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { action: 'Swap', desc: 'TKA to TKB', amount: '100 TKA', time: '2 mins ago', status: 'Success' },
                                    { action: 'Add Liquidity', desc: 'TKA/TKB Pool', amount: '500 LP', time: '1 hour ago', status: 'Success' },
                                    { action: 'Swap', desc: 'ETH to TKA', amount: '0.5 ETH', time: '5 hours ago', status: 'Success' },
                                ].map((tx, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <TrendingUp className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{tx.action}</div>
                                                <div className="text-xs text-text-secondary">{tx.desc}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{tx.amount}</div>
                                            <div className="text-xs text-green-400">{tx.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Portfolio;
