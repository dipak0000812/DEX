import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKENS, type Token } from '../contracts/addresses';
import { GlassCard } from './ui/GlassCard';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface TokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (token: Token) => void;
    selectedToken?: Token;
}

export const TokenSelector = ({ isOpen, onClose, onSelect, selectedToken }: TokenSelectorProps) => {
    const tokens = Object.values(TOKENS);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTokens = tokens.filter(token =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && createPortal(
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
                    >
                        <GlassCard className="overflow-hidden border-white/10 shadow-2xl">
                            <div className="p-6 border-b border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold">Select Token</h3>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                    >
                                        <X className="w-5 h-5 text-text-secondary" />
                                    </button>
                                </div>

                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                                    <input
                                        type="text"
                                        placeholder="Search name or symbol"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                                <div className="grid gap-2">
                                    {filteredTokens.map((token) => (
                                        <button
                                            key={token.address}
                                            onClick={() => {
                                                onSelect(token);
                                                onClose();
                                            }}
                                            disabled={selectedToken?.address === token.address}
                                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${selectedToken?.address === token.address
                                                ? 'bg-primary/10 border border-primary/20 cursor-default'
                                                : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                                                }`}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                                                {token.logo}
                                            </div>
                                            <div className="text-left flex-1">
                                                <div className="font-bold flex items-center gap-2">
                                                    {token.symbol}
                                                    {selectedToken?.address === token.address && (
                                                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Selected</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-text-secondary">{token.name}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium">0.00</div>
                                                <div className="text-xs text-text-secondary">Balance</div>
                                            </div>
                                        </button>
                                    ))}
                                    {filteredTokens.length === 0 && (
                                        <div className="text-center py-8 text-text-secondary">
                                            No tokens found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </>,
                document.body
            )}
        </AnimatePresence>
    );
};
