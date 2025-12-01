import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOKENS, type Token } from '../contracts/addresses';


interface TokenSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (token: Token) => void;
    selectedToken?: Token;
}

export const TokenSelector = ({ isOpen, onClose, onSelect, selectedToken }: TokenSelectorProps) => {
    const tokens = Object.values(TOKENS);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
                    >
                        <div className="bg-[#0A0E27] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                                <h3 className="text-lg font-bold">Select Token</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>
                            </div>

                            <div className="p-2 max-h-[400px] overflow-y-auto">
                                {tokens.map((token) => (
                                    <button
                                        key={token.address}
                                        onClick={() => {
                                            onSelect(token);
                                            onClose();
                                        }}
                                        disabled={selectedToken?.address === token.address}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedToken?.address === token.address
                                            ? 'bg-primary/10 opacity-50 cursor-default'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                                            {token.logo}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">{token.symbol}</div>
                                            <div className="text-sm text-text-secondary">{token.name}</div>
                                        </div>
                                        {selectedToken?.address === token.address && (
                                            <div className="ml-auto text-primary text-sm font-medium">
                                                Selected
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
