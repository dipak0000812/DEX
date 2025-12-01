import { motion } from 'framer-motion';
import { ArrowRight, Zap, Layers, GitMerge, TrendingUp, Activity, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { Link } from 'react-router-dom';

import FloatingCoins from '../components/FloatingCoins';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Elements */}
            <FloatingCoins />
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-accent/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center lg:text-left z-10"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            <span className="text-sm font-medium text-accent tracking-wide">V3 PROTOCOL LIVE</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-6 tracking-tight">
                            Trade Without <br />
                            <span className="text-gradient-primary animate-glow inline-block">Limits.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Experience the next evolution of decentralized trading.
                            Lightning-fast swaps, concentrated liquidity, and zero-slippage routing.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link to="/swap" className="w-full sm:w-auto">
                                <Button size="lg" glow variant="primary" className="w-full sm:w-auto text-lg px-8 h-14">
                                    Launch App
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button variant="glass" size="lg" className="w-full sm:w-auto text-lg px-8 h-14">
                                View Documentation
                            </Button>
                        </motion.div>

                        {/* Stats Ticker */}
                        <motion.div variants={itemVariants} className="mt-20 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <div className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Total Value Locked</div>
                                <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                                    $2.4B<span className="text-accent text-lg">+</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Total Volume</div>
                                <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                                    $450B<span className="text-accent text-lg">+</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Total Users</div>
                                <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                                    1.2M<span className="text-accent text-lg">+</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 3D Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative hidden lg:block h-[600px]"
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            {/* Orbit Rings */}
                            <div className="absolute w-[500px] h-[500px] border border-primary/20 rounded-full animate-spin-slow" />
                            <div className="absolute w-[350px] h-[350px] border border-secondary/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />
                            <div className="absolute w-[200px] h-[200px] border border-accent/20 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-[10%] left-[10%] z-20"
                            >
                                <GlassCard className="p-4 flex items-center gap-3 w-48">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-secondary">Speed</div>
                                        <div className="font-bold text-white">Instant</div>
                                    </div>
                                </GlassCard>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-[20%] right-[10%] z-20"
                            >
                                <GlassCard className="p-4 flex items-center gap-3 w-48">
                                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-secondary">Liquidity</div>
                                        <div className="font-bold text-white">Deep</div>
                                    </div>
                                </GlassCard>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-[30%] right-[5%] z-10"
                            >
                                <GlassCard className="p-4 flex items-center gap-3 w-48">
                                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-text-secondary">Security</div>
                                        <div className="font-bold text-white">Audited</div>
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Central Orb */}
                            <div className="relative z-0 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary blur-md animate-pulse-slow">
                                <div className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-md" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-5xl font-bold mb-6"
                        >
                            Why Choose <span className="text-gradient-secondary">DEX V3?</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-text-secondary max-w-2xl mx-auto text-lg"
                        >
                            Built for professionals, designed for everyone. Experience the next generation of DeFi.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="w-8 h-8 text-primary" />,
                                title: "Lightning Fast Swaps",
                                desc: "Optimized routing algorithm ensures you get the best price with minimal slippage and instant execution."
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8 text-secondary" />,
                                title: "Concentrated Liquidity",
                                desc: "Maximize your capital efficiency by providing liquidity in specific price ranges."
                            },
                            {
                                icon: <GitMerge className="w-8 h-8 text-accent" />,
                                title: "Multi-hop Routing",
                                desc: "Smart order routing splits your trade across multiple pools for the best possible output."
                            }
                        ].map((feature, idx) => (
                            <GlassCard
                                key={idx}
                                hoverEffect
                                gradient
                                className="p-8 group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-primary/20 group-hover:shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-text-secondary leading-relaxed text-lg">
                                    {feature.desc}
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Dashboard Preview */}
            <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background-secondary/50 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <Activity className="w-8 h-8 text-accent" />
                            Live Market Activity
                        </h2>
                        <Link to="/analytics">
                            <Button variant="ghost" className="group">
                                View All Markets
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { pair: "ETH/USDC", price: "$1,850.24", change: "+2.4%", vol: "$125M" },
                            { pair: "BTC/USDC", price: "$34,250.10", change: "-0.5%", vol: "$450M" },
                            { pair: "SOL/USDC", price: "$24.50", change: "+5.8%", vol: "$85M" },
                            { pair: "MATIC/USDC", price: "$0.85", change: "+1.2%", vol: "$45M" },
                        ].map((item, idx) => (
                            <GlassCard key={idx} className="p-6 hover:bg-white/10 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-bold text-lg">{item.pair}</span>
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${item.change.startsWith('+') ? 'bg-accent/10 text-accent' : 'bg-red-500/10 text-red-500'}`}>
                                        {item.change}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold mb-2">{item.price}</div>
                                <div className="text-sm text-text-secondary">Vol: {item.vol}</div>
                                <div className="h-16 mt-6 relative opacity-50">
                                    {/* Fake sparkline */}
                                    <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                                        <path
                                            d={`M0,${30 + Math.random() * 20} Q${20 + Math.random() * 20},${Math.random() * 40} ${40 + Math.random() * 20},${30 + Math.random() * 20} T100,${30 + Math.random() * 20} T200,${30 + Math.random() * 20} T300,${30 + Math.random() * 20}`}
                                            fill="none"
                                            stroke={item.change.startsWith('+') ? '#39FF14' : '#FF3B30'}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
