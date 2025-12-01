import { motion } from 'framer-motion';
import { ArrowRight, Zap, Layers, GitMerge, TrendingUp, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';

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
        <div className="relative">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center lg:text-left z-10"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span className="text-sm font-medium text-accent">V3 Protocol Live</span>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-bold leading-tight mb-6">
                            Trade Without <br />
                            <span className="text-gradient-primary animate-glow">Limits.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Experience the future of decentralized trading with lightning-fast swaps,
                            concentrated liquidity, and seamless multi-chain routing.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link to="/swap">
                                <Button size="lg" glow className="w-full sm:w-auto text-lg px-8">
                                    Launch App
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button variant="glass" size="lg" className="w-full sm:w-auto text-lg px-8">
                                Learn More
                            </Button>
                        </motion.div>

                        {/* Stats Ticker */}
                        <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <div className="text-text-secondary text-sm mb-1">Total Value Locked</div>
                                <div className="text-2xl font-bold text-white">$2.4B+</div>
                            </div>
                            <div>
                                <div className="text-text-secondary text-sm mb-1">Total Volume</div>
                                <div className="text-2xl font-bold text-white">$450B+</div>
                            </div>
                            <div>
                                <div className="text-text-secondary text-sm mb-1">Total Users</div>
                                <div className="text-2xl font-bold text-white">1.2M+</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 3D Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                            {/* Floating Elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[100px] animate-pulse-slow" />

                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/4 left-1/4 w-32 h-32 glass-card rounded-2xl flex items-center justify-center z-20 border-primary/30"
                            >
                                <Zap className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-1/4 right-1/4 w-40 h-40 glass-card rounded-2xl flex items-center justify-center z-10 border-secondary/30"
                            >
                                <Layers className="w-20 h-20 text-secondary drop-shadow-[0_0_15px_rgba(176,38,255,0.5)]" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute top-1/3 right-1/4 w-24 h-24 glass-card rounded-2xl flex items-center justify-center z-30 border-accent/30"
                            >
                                <GitMerge className="w-12 h-12 text-accent drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]" />
                            </motion.div>

                            {/* Central Orb */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.2)] animate-spin-slow" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose DEX V3?</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Built for professionals, designed for everyone. Experience the next generation of DeFi.
                        </p>
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
                            <Card key={idx} gradient className="group hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    {feature.desc}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Dashboard Preview */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Activity className="w-6 h-6 text-accent" />
                            Live Market Activity
                        </h2>
                        <Link to="/analytics" className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { pair: "ETH/USDC", price: "$1,850.24", change: "+2.4%", vol: "$125M" },
                            { pair: "BTC/USDC", price: "$34,250.10", change: "-0.5%", vol: "$450M" },
                            { pair: "SOL/USDC", price: "$24.50", change: "+5.8%", vol: "$85M" },
                            { pair: "MATIC/USDC", price: "$0.85", change: "+1.2%", vol: "$45M" },
                        ].map((item, idx) => (
                            <Card key={idx} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold">{item.pair}</span>
                                    <span className={item.change.startsWith('+') ? 'text-accent' : 'text-red-500'}>
                                        {item.change}
                                    </span>
                                </div>
                                <div className="text-2xl font-bold mb-1">{item.price}</div>
                                <div className="text-xs text-text-secondary">Vol: {item.vol}</div>
                                <div className="h-10 mt-4 bg-white/5 rounded-lg overflow-hidden relative">
                                    {/* Fake sparkline */}
                                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                        <path
                                            d={`M0,${20 + Math.random() * 20} Q${10 + Math.random() * 10},${Math.random() * 40} ${20 + Math.random() * 10},${20 + Math.random() * 20} T100,${20 + Math.random() * 20}`}
                                            fill="none"
                                            stroke={item.change.startsWith('+') ? '#39FF14' : '#FF3B30'}
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
