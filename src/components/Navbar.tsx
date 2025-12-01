import { Link, useLocation } from 'react-router-dom';
import { Wallet, Menu, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { BRAND } from '../config/branding';
import { TradingTips } from '../features/TradingTips';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { address, isConnected, connectWallet, disconnectWallet, balanceFormatted, isWrongNetwork } = useWallet();

    const navLinks = [
        { name: 'Swap', path: '/swap' },
        { name: 'Pool', path: '/pool' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Portfolio', path: '/portfolio' },
    ];

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <nav className="border-b border-white/5 bg-[#0A1628]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className={`relative w-10 h-10 flex items-center justify-center bg-gradient-to-br ${BRAND.logo.gradient} rounded-xl group-hover:shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all duration-300`}>
                                <span className="text-white font-bold text-xl">{BRAND.logo.icon}</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                                    {BRAND.name}
                                </span>
                                <p className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">High Performance</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "relative text-sm font-medium transition-colors duration-300",
                                        location.pathname === link.path
                                            ? 'text-blue-400'
                                            : 'text-gray-400 hover:text-white'
                                    )}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-8 left-0 right-0 h-1 bg-blue-400 rounded-t-full shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                                        />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Wallet Connection */}
                        <div className="hidden md:flex items-center gap-4">
                            {isConnected && isWrongNetwork && (
                                <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium animate-pulse flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Wrong Network
                                </div>
                            )}

                            {isConnected ? (
                                <div className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <span className="text-sm font-medium text-white/80">
                                        {balanceFormatted ? parseFloat(balanceFormatted).toFixed(3) : '0.00'} ETH
                                    </span>
                                    <Button
                                        variant="glass"
                                        size="sm"
                                        onClick={disconnectWallet}
                                        className="rounded-full hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 h-8"
                                    >
                                        {formatAddress(address!)}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="primary"
                                    glow
                                    onClick={connectWallet}
                                    className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 border-none"
                                >
                                    <Wallet className="w-4 h-4 mr-2" />
                                    Connect Wallet
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/5 bg-[#0A1628]/95 backdrop-blur-xl overflow-hidden"
                        >
                            <div className="px-4 py-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "block text-lg font-medium",
                                            location.pathname === link.path
                                                ? 'text-blue-400'
                                                : 'text-gray-400'
                                        )}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t border-white/5">
                                    {isConnected ? (
                                        <Button onClick={disconnectWallet} variant="glass" className="w-full justify-center">
                                            Disconnect {formatAddress(address!)}
                                        </Button>
                                    ) : (
                                        <Button onClick={connectWallet} variant="primary" glow className="w-full justify-center bg-gradient-to-r from-blue-500 to-cyan-400 border-none">
                                            Connect Wallet
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <TradingTips />
        </div>
    );
};

export default Navbar;
