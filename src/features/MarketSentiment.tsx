import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MarketSentiment = () => {
    // Mock sentiment data (0 to 1)
    const sentiment = 0.75; // Bullish

    const getSentimentData = () => {
        if (sentiment > 0.7) return {
            icon: <TrendingUp className="w-6 h-6" />,
            text: 'Strong Buy',
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            borderColor: 'border-green-500/20'
        };
        if (sentiment > 0.5) return {
            icon: <TrendingUp className="w-6 h-6" />,
            text: 'Buy',
            color: 'text-green-400',
            bg: 'bg-green-500/10',
            borderColor: 'border-green-500/20'
        };
        if (sentiment > 0.3) return {
            icon: <Minus className="w-6 h-6" />,
            text: 'Neutral',
            color: 'text-yellow-400',
            bg: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/20'
        };
        return {
            icon: <TrendingDown className="w-6 h-6" />,
            text: 'Sell',
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            borderColor: 'border-red-500/20'
        };
    };

    const data = getSentimentData();

    return (
        <div className={`p-4 rounded-xl border ${data.borderColor} ${data.bg} backdrop-blur-sm`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-black/20 ${data.color}`}>
                        {data.icon}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Market Sentiment</p>
                        <p className={`text-lg font-bold ${data.color}`}>
                            {data.text}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">{(sentiment * 100).toFixed(0)}<span className="text-sm text-gray-400">%</span></p>
                    <p className="text-xs text-gray-400">Confidence</p>
                </div>
            </div>

            {/* Sentiment Bar */}
            <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${data.color.replace('text-', 'bg-')}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${sentiment * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
};
