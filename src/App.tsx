import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './providers/Web3Provider';
import Layout from './components/Layout';
import Home from './pages/Home';
import Swap from './pages/Swap';
import Pool from './pages/Pool';
import Analytics from './pages/Analytics';
import Portfolio from './pages/Portfolio';

import { Footer } from './components/Footer';

import { useKonamiCode } from './hooks/useKonamiCode';
import { AnimatePresence, motion } from 'framer-motion';
import { Zap } from 'lucide-react';

function App() {
  const isKonamiTriggered = useKonamiCode();

  return (
    <Web3Provider>
      <Router>
        <Layout>
          <AnimatePresence>
            {isKonamiTriggered && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              >
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="font-mono text-blue-100 font-bold tracking-wider">SYSTEM OVERRIDE: PERFORMANCE MODE ACTIVE</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/pool" element={<Pool />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
          <Footer />
        </Layout>
      </Router>
    </Web3Provider>
  );
}

export default App;
