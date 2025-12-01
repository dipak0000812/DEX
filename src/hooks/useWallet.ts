import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi';
import { hardhatLocal } from '../config/wagmi';

export function useWallet() {
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { switchChain } = useSwitchChain();

    const { data: balance } = useBalance({
        address: address,
    });

    const connectWallet = () => {
        // Try to find MetaMask specifically, or fallback to any injected connector
        const connector = connectors.find(c => c.name === 'MetaMask' || c.id === 'io.metamask' || c.id === 'metaMask' || c.id === 'injected');

        if (connector) {
            connect({ connector });
        } else {
            console.error("No suitable wallet connector found. Available connectors:", connectors);
            alert("No wallet found. Please install MetaMask.");
        }
    };

    const disconnectWallet = () => {
        disconnect();
    };

    const switchToHardhat = () => {
        switchChain({ chainId: hardhatLocal.id });
    };

    const isWrongNetwork = isConnected && chain?.id !== hardhatLocal.id;

    // MOCK DATA: If connected but balance is 0, show mock balance for demo
    const isMockMode = isConnected && (!balance || balance.value === 0n);
    const displayBalance = isMockMode ? 10000000000000000000n : (balance?.value || 0n); // 10 ETH
    const displayFormatted = isMockMode ? '10.0' : (balance?.formatted || '0');

    return {
        address,
        isConnected,
        chain,
        balance: displayBalance,
        balanceFormatted: displayFormatted,
        connectWallet,
        disconnectWallet,
        switchToHardhat,
        isWrongNetwork,
    };
}
