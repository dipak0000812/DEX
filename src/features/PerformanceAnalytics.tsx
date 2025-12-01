import { GlassCard } from '../components/ui/GlassCard';
import { Activity, PieChart, TrendingUp, Zap, Clock } from 'lucide-react';

export const PerformanceAnalytics = () => {
    // Mock data - in production this would come from a hook
    const stats = {
        strategy: 'Balanced',
        peakHour: '14:00',
        favoritePair: 'SWIFT/BOLT',
        winRate: 68,
        streak: 12,
        riskLevel: 3,
        totalVolume: '$124,500',
        pnl: '+$12,450'
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Performance Analytics
                </h3>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                    LIVE
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Execution Strategy */}
                <GlassCard className="p-4 border-blue-500/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Zap className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm text-gray-400">Execution Strategy</span>
                    </div>
                    <p className="text-xl font-bold text-white">{stats.strategy}</p>
                </GlassCard>

                {/* Peak Activity */}
                <GlassCard className="p-4 border-blue-500/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                            <Clock className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-sm text-gray-400">Peak Activity</span>
                    </div>
                    <p className="text-xl font-bold text-white">{stats.peakHour} UTC</p>
                </GlassCard>

                {/* Success Rate */}
                <GlassCard className="p-4 border-blue-500/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-sm text-gray-400">Success Rate</span>
                    </div>
                    <p className="text-xl font-bold text-green-400">{stats.winRate}%</p>
                </GlassCard>

                {/* Risk Profile */}
                <GlassCard className="p-4 border-blue-500/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <PieChart className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-sm text-gray-400">Risk Profile</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 w-full rounded-full ${i < stats.riskLevel ? 'bg-blue-500' : 'bg-gray-700/50'
                                    }`}
                            />
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Volume Metrics */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Volume Metrics</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total Volume Traded</span>
                        <span className="font-mono font-bold text-white">{stats.totalVolume}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Net PnL (Est.)</span>
                        <span className="font-mono font-bold text-green-400">{stats.pnl}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

