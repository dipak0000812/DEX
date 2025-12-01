import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingUp, AlertCircle, BarChart2 } from 'lucide-react';

const TIPS = [
    {
        icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
        title: 'Pro Insight',
        text: 'Always verify price impact before executing large volume trades.'
    },
    {
        icon: <TrendingUp className="w-4 h-4 text-green-400" />,
        title: 'Market Strategy',
        text: 'Providing liquidity during low volatility periods can optimize yield.'
    },
    {
        icon: <AlertCircle className="w-4 h-4 text-blue-400" />,
        title: 'Risk Management',
        text: 'Diversify your liquidity positions across multiple fee tiers.'
    },
    {
        icon: <BarChart2 className="w-4 h-4 text-purple-400" />,
        title: 'Volume Analysis',
        text: 'Market depth typically increases during major session overlaps.'
    }
];

export const TradingTips = () => {
    const [currentTip, setCurrentTip] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % TIPS.length);
        }, 12000); // Rotate every 12 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-blue-500/5 border-y border-blue-500/10 backdrop-blur-sm overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-center">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentTip}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 text-sm"
                    >
                        {TIPS[currentTip].icon}
                        <span className="font-bold text-blue-400">{TIPS[currentTip].title}:</span>
                        <span className="text-gray-400">{TIPS[currentTip].text}</span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
