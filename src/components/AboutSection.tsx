import { GlassCard } from './ui/GlassCard';
import { Shield, Zap, Lock, Globe } from 'lucide-react';
import { BRAND } from '../config/branding';

export const AboutSection = () => {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto">
                <GlassCard className="p-8 md:p-12 border-blue-500/10 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Founder/Brand Identity */}
                        <div className="shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-4xl shadow-lg shadow-blue-500/20">
                                {BRAND.logo.icon}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Engineered for Performance</h2>
                                <p className="text-blue-400 font-medium">The SwiftSwap Protocol Architecture</p>
                            </div>

                            <div className="prose prose-invert max-w-none text-gray-300 space-y-4">
                                <p className="text-lg leading-relaxed">
                                    In a landscape saturated with generic automated market makers, SwiftSwap emerges as a purpose-built solution for serious traders. We identified the critical latency and slippage issues plaguing existing decentralized exchanges and re-engineered the core experience.
                                </p>

                                <p>
                                    Our mission is simple: <strong>Institutional-grade execution on a decentralized infrastructure.</strong>
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                    <div className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white">Zero-Latency Matching</h4>
                                            <p className="text-sm text-gray-400">Optimized routing algorithms for instant execution.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-blue-400 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white">Audited Security</h4>
                                            <p className="text-sm text-gray-400">Rigorous smart contract verification standards.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Lock className="w-5 h-5 text-purple-400 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white">Non-Custodial</h4>
                                            <p className="text-sm text-gray-400">Complete control over your assets at all times.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Globe className="w-5 h-5 text-cyan-400 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-white">Global Liquidity</h4>
                                            <p className="text-sm text-gray-400">Deep pools aggregated from multiple sources.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-white/5 flex gap-4">
                                <a href={BRAND.social.docs} target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">
                                    Read Whitepaper
                                </a>
                                <a href={BRAND.social.github} target="_blank" rel="noopener noreferrer" className="px-6 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-colors text-sm font-medium">
                                    View Source Code
                                </a>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
};
