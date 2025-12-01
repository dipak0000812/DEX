import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Activity, Shield, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export const MILESTONES = [
    {
        id: 'initiation',
        name: 'Protocol Initiation',
        description: 'Executed first transaction on SwiftSwap Protocol',
        icon: <Activity className="w-6 h-6 text-blue-400" />,
        rarity: 'Standard'
    },
    {
        id: 'high_frequency',
        name: 'High Frequency Trader',
        description: 'Executed 5+ transactions within a single session',
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        rarity: 'Elite'
    },
    {
        id: 'liquidity_provider',
        name: 'Liquidity Provider',
        description: 'Contributed to protocol liquidity depth',
        icon: <TrendingUp className="w-6 h-6 text-green-400" />,
        rarity: 'Standard'
    },
    {
        id: 'institutional_volume',
        name: 'Institutional Volume',
        description: 'Executed a transaction exceeding 10 ETH value',
        icon: <Shield className="w-6 h-6 text-purple-400" />,
        rarity: 'Legendary'
    },
    {
        id: 'early_adopter',
        name: 'Early Adopter',
        description: 'Participated in the protocol launch phase',
        icon: <Clock className="w-6 h-6 text-cyan-400" />,
        rarity: 'Rare'
    }
];

export const MilestonePopup = ({ milestone, onClose }: { milestone: typeof MILESTONES[0], onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50 bg-[#0A1628]/90 backdrop-blur-xl border border-blue-500/20 p-4 rounded-xl shadow-[0_0_30px_rgba(14,165,233,0.2)] flex items-center gap-4 max-w-sm"
        >
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                {milestone.icon}
            </div>
            <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    Milestone Unlocked
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${milestone.rarity === 'Legendary' ? 'border-purple-500/50 text-purple-400 bg-purple-500/10' :
                            milestone.rarity === 'Elite' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                'border-blue-500/50 text-blue-400 bg-blue-500/10'
                        }`}>
                        {milestone.rarity}
                    </span>
                </h4>
                <p className="font-semibold text-blue-400 mt-1">{milestone.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{milestone.description}</p>
            </div>
        </motion.div>
    );
};
