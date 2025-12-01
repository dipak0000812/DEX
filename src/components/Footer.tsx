import { BRAND } from '../config/branding';
import { Github, Twitter, MessageCircle, FileText } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-[#0A1628]/50 backdrop-blur-xl mt-20">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-8 h-8 bg-gradient-to-br ${BRAND.logo.gradient} rounded-lg flex items-center justify-center font-bold text-white`}>
                                {BRAND.logo.icon}
                            </div>
                            <span className="text-xl font-bold text-white">{BRAND.name}</span>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-6">
                            {BRAND.description}
                        </p>
                        <div className="flex gap-4">
                            <a href={BRAND.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href={BRAND.social.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href={BRAND.social.discord} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-indigo-400 transition-colors">
                                <MessageCircle className="w-5 h-5" />
                            </a>
                            <a href={BRAND.social.docs} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors">
                                <FileText className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-white mb-4">Protocol</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/swap" className="hover:text-blue-400 transition-colors">Swap</a></li>
                            <li><a href="/pool" className="hover:text-blue-400 transition-colors">Liquidity Pools</a></li>
                            <li><a href="/analytics" className="hover:text-blue-400 transition-colors">Analytics</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Governance</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Bug Bounty</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© 2024 {BRAND.name}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Operational
                        </span>
                        <span>v3.0.1 (Stable)</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
