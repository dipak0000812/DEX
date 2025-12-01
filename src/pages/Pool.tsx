import { useState } from 'react';
import { Plus, TrendingUp, Droplets, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useWallet } from '../hooks/useWallet';
import { useUserPositions } from '../hooks/useUserPositions';
import { AddLiquidityModal } from '../components/AddLiquidityModal';

const Pool = () => {
    const { isConnected, connectWallet, address } = useWallet();
    const { data: realPositions, isLoading, refetch } = useUserPositions(address);
    const [showAddLiquidity, setShowAddLiquidity] = useState(false);

    // MOCK DATA: Show fake positions if real ones are empty
    const mockPositions = [
        {
            poolAddress: '0xMockPool1',
            token0: 'TKA',
            token1: 'TKB',
            liquidity: 123456789000000000000n,
            liquidityFormatted: '123.4567',
            poolName: 'TKA-TKB'
        },
        {
            poolAddress: '0xMockPool2',
            token0: 'TKB',
            token1: 'TKC',
            liquidity: 98765432100000000000n,
            liquidityFormatted: '98.7654',
            poolName: 'TKB-TKC'
        }
    ];

    const positions = (realPositions?.length || 0) > 0 ? realPositions : mockPositions;

    // Mock data for top pools (since we don't have a subgraph)
    const topPools = [
        { pair: 'TKA/TKB', tvl: '$1.2M', vol: '$450K', apr: '12.5%' },
        { pair: 'TKB/TKC', tvl: '$850K', vol: '$120K', apr: '8.2%' },
        { pair: 'TKA/TKC', tvl: '$2.1M', vol: '$980K', apr: '24.8%' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Pools</h1>
                        <Button glow onClick={() => setShowAddLiquidity(true)}>
                            <Plus className="w-5 h-5 mr-2" />
                            New Position
                        </Button>
                    </div>

                    {/* Add Liquidity Modal */}
                    <AddLiquidityModal
                        isOpen={showAddLiquidity}
                        onClose={() => setShowAddLiquidity(false)}
                        onSuccess={refetch}
                    />

                    {/* User Positions */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-text-secondary">Your Positions</h2>

                        {!isConnected ? (
                            <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Droplets className="w-8 h-8 text-text-secondary" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">Connect your wallet</h3>
                                <p className="text-text-secondary mb-6 max-w-xs">
                                    Connect your wallet to view your liquidity positions and earn fees.
                                </p>
                                <Button onClick={connectWallet}>Connect Wallet</Button>
                            </Card>
                        ) : isLoading ? (
                            <div className="text-center py-12 text-text-secondary">Loading positions...</div>
                        ) : positions?.length === 0 ? (
                            <Card className="p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Droplets className="w-8 h-8 text-text-secondary" />
                                </div>
                                <h3 className="text-lg font-medium mb-2">No active positions</h3>
                                <p className="text-text-secondary mb-6 max-w-xs">
                                    Add liquidity to a pool to start earning trading fees.
                                </p>
                                <Button onClick={() => setShowAddLiquidity(true)}>Add Liquidity</Button>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {positions?.map((pos) => (
                                    <motion.div
                                        key={pos.poolAddress}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Card className="p-6 hover:border-primary/30 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-2">
                                                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-[#0A0E27]">
                                                            {pos.token0[0]}
                                                        </div>
                                                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center border-2 border-[#0A0E27]">
                                                            {pos.token1[0]}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{pos.poolName}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">0.05%</span>
                                                            <span>•</span>
                                                            <span className="text-green-400">Active</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-text-secondary mb-1">Liquidity</div>
                                                    <div className="text-xl font-bold">{parseFloat(pos.liquidityFormatted).toFixed(4)} LP</div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Top Pools */}
                    <Card className="p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Top Pools
                        </h3>
                        <div className="space-y-4">
                            {topPools.map((pool, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <span className="text-text-secondary font-mono text-sm">{i + 1}</span>
                                        <div>
                                            <div className="font-medium">{pool.pair}</div>
                                            <div className="text-xs text-text-secondary">TVL: {pool.tvl}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-green-400 font-medium">{pool.apr}</div>
                                        <div className="text-xs text-text-secondary">APR</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Learn Card */}
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                        <h3 className="font-bold mb-2">Liquidity Provider Rewards</h3>
                        <p className="text-sm text-text-secondary mb-4">
                            Liquidity providers earn a 0.05% fee on all trades proportional to their share of the pool. Fees are added to the pool, accruing in real time and can be claimed by withdrawing your liquidity.
                        </p>
                        <a href="#" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                            Read more <ArrowRight className="w-4 h-4" />
                        </a>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Pool;
