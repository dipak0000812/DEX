import { useState } from 'react';
import { Plus, TrendingUp, Droplets, ArrowRight, Wallet, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/ui/GlassCard';
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

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Pools</h1>
                            <p className="text-text-secondary mt-1">Provide liquidity and earn fees</p>
                        </div>
                        <Button
                            glow
                            size="lg"
                            onClick={() => setShowAddLiquidity(true)}
                            className="shadow-lg shadow-primary/20"
                        >
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <GlassCard className="p-4">
                            <div className="text-text-secondary text-sm mb-1">Total Value Locked</div>
                            <div className="text-2xl font-bold text-white">$4.2M</div>
                            <div className="text-green-400 text-xs flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" /> +5.2%
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-text-secondary text-sm mb-1">24h Volume</div>
                            <div className="text-2xl font-bold text-white">$1.5M</div>
                            <div className="text-green-400 text-xs flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" /> +12.8%
                            </div>
                        </GlassCard>
                        <GlassCard className="p-4">
                            <div className="text-text-secondary text-sm mb-1">24h Fees</div>
                            <div className="text-2xl font-bold text-white">$4.5K</div>
                            <div className="text-green-400 text-xs flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" /> +8.4%
                            </div>
                        </GlassCard>
                    </div>

                    {/* User Positions */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Your Positions</h2>
                            <div className="flex gap-2">
                                <div className="relative hidden sm:block">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                    <input
                                        type="text"
                                        placeholder="Search pools"
                                        className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>
                                <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                                    <Filter className="w-4 h-4 text-text-secondary" />
                                </button>
                            </div>
                        </div>

                        {!isConnected ? (
                            <GlassCard className="p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-white/5">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                                    <Wallet className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Connect your wallet</h3>
                                <p className="text-text-secondary mb-8 max-w-xs">
                                    Connect your wallet to view your liquidity positions and earn fees.
                                </p>
                                <Button onClick={connectWallet} glow size="lg">Connect Wallet</Button>
                            </GlassCard>
                        ) : isLoading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                                <div className="text-text-secondary">Loading positions...</div>
                            </div>
                        ) : positions?.length === 0 ? (
                            <GlassCard className="p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-white/5">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                    <Droplets className="w-10 h-10 text-text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No active positions</h3>
                                <p className="text-text-secondary mb-8 max-w-xs">
                                    Add liquidity to a pool to start earning trading fees.
                                </p>
                                <Button onClick={() => setShowAddLiquidity(true)} variant="outline">Add Liquidity</Button>
                            </GlassCard>
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-4"
                            >
                                {positions?.map((pos) => (
                                    <motion.div
                                        key={pos.poolAddress}
                                        variants={itemVariants}
                                    >
                                        <GlassCard hoverEffect className="p-6 cursor-pointer group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex -space-x-3">
                                                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center border-4 border-[#0A0E27] shadow-lg z-10">
                                                            {pos.token0[0]}
                                                        </div>
                                                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center border-4 border-[#0A0E27] shadow-lg">
                                                            {pos.token1[0]}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{pos.poolName}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                            <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-xs font-medium border border-green-500/20">0.05%</span>
                                                            <span>•</span>
                                                            <span className="text-green-400 flex items-center gap-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                                Active
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-text-secondary mb-1">Liquidity</div>
                                                    <div className="text-xl font-bold">{parseFloat(pos.liquidityFormatted).toFixed(4)} LP</div>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Top Pools */}
                    <GlassCard className="p-6">
                        <h3 className="font-bold mb-6 flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Top Pools
                        </h3>
                        <div className="space-y-2">
                            {topPools.map((pool, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <span className="text-text-secondary font-mono text-sm w-4">{i + 1}</span>
                                        <div>
                                            <div className="font-bold group-hover:text-primary transition-colors">{pool.pair}</div>
                                            <div className="text-xs text-text-secondary">TVL: {pool.tvl}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-green-400 font-bold">{pool.apr}</div>
                                        <div className="text-xs text-text-secondary">APR</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-sm text-text-secondary hover:text-white">
                            View All Pools
                        </Button>
                    </GlassCard>

                    {/* Learn Card */}
                    <GlassCard gradient className="p-6 border-primary/20">
                        <h3 className="font-bold mb-2 text-lg">Liquidity Provider Rewards</h3>
                        <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                            Liquidity providers earn a 0.05% fee on all trades proportional to their share of the pool. Fees are added to the pool, accruing in real time.
                        </p>
                        <a href="#" className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all">
                            Read Documentation <ArrowRight className="w-4 h-4" />
                        </a>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default Pool;
