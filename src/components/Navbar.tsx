import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Wallet, Menu, X, ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useWallet } from '../hooks/useWallet';

const Navbar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { address, isConnected, connectWallet, disconnectWallet, balanceFormatted, chain, isWrongNetwork, switchToHardhat } = useWallet();

    const navLinks = [
        { name: 'Swap', path: '/swap' },
        { name: 'Pool', path: '/pool' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Portfolio', path: '/portfolio' },
    ];

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0A0E27]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 group-hover:to-primary transition-all duration-300">
                                DEX V3
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "text-sm font-medium transition-all duration-200 hover:text-primary relative py-1",
                                        location.pathname === link.path ? "text-primary" : "text-text-secondary"
                                    )}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-[0_0_10px_#00F5FF]" />
                                    )}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Network Display */}
                            {isConnected && (
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors",
                                    isWrongNetwork
                                        ? "bg-red-500/10 border-red-500/50 text-red-400"
                                        : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10"
                                )}>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        isWrongNetwork ? "bg-red-500 shadow-[0_0_5px_#ef4444]" : "bg-green-500 shadow-[0_0_5px_#22c55e]"
                                    )} />
                                    {isWrongNetwork ? 'Wrong Network' : (chain?.name || 'Unknown')}
                                    {isWrongNetwork && <ChevronDown className="w-4 h-4" />}
                                </div>
                            )}

                            {/* Wallet Button */}
                            {isConnected ? (
                                <div className="flex items-center gap-2">
                                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium">
                                        {parseFloat(balanceFormatted).toFixed(4)} ETH
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={disconnectWallet}
                                        className="min-w-[140px]"
                                    >
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            {truncateAddress(address!)}
                                        </span>
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={connectWallet}
                                    glow
                                    className="min-w-[140px]"
                                >
                                    <span className="flex items-center gap-2">
                                        <Wallet className="w-4 h-4" />
                                        Connect Wallet
                                    </span>
                                </Button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg text-text-secondary hover:bg-white/10 transition-colors"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A0E27] border-b border-white/10 animate-slide-up">
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "block px-4 py-3 rounded-xl text-base font-medium transition-colors",
                                        location.pathname === link.path
                                            ? "bg-primary/10 text-primary"
                                            : "text-text-secondary hover:bg-white/5"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10 space-y-4">
                                {isConnected && (
                                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5">
                                        <span className="text-text-secondary">Balance</span>
                                        <div className="text-white font-medium">
                                            {parseFloat(balanceFormatted).toFixed(4)} ETH
                                        </div>
                                    </div>
                                )}
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={isConnected ? disconnectWallet : connectWallet}
                                >
                                    {isConnected ? truncateAddress(address!) : 'Connect Wallet'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Wrong Network Warning Banner */}
            {isWrongNetwork && (
                <div className="fixed top-20 left-0 right-0 z-40 bg-red-500/10 border-b border-red-500/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">
                                Wrong Network. Please switch to Hardhat Local (Chain ID: 31337)
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={switchToHardhat}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                            Switch Network
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
