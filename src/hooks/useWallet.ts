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

    return {
        address,
        isConnected,
        chain,
        balance: balance?.value || 0n,
        balanceFormatted: balance?.formatted || '0',
        connectWallet,
        disconnectWallet,
        switchToHardhat,
        isWrongNetwork,
    };
}
