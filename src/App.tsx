import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './providers/Web3Provider';
import Layout from './components/Layout';
import Home from './pages/Home';
import Swap from './pages/Swap';
import Pool from './pages/Pool';
import Analytics from './pages/Analytics';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/pool" element={<Pool />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </Layout>
      </Router>
    </Web3Provider>
  );
}

export default App;
