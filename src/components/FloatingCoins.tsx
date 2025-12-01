import { motion } from 'framer-motion';
import { TOKENS } from '../contracts/addresses';
import { useEffect, useState } from 'react';

const FloatingCoins = () => {
    const [coins, setCoins] = useState<Array<{
        id: number;
        x: number;
        y: number;
        scale: number;
        duration: number;
        delay: number;
        logo: string;
        blur: number;
    }>>([]);

    useEffect(() => {
        // Generate random coins
        const tokenLogos = [TOKENS.TKA.logo, TOKENS.TKB.logo, TOKENS.TKC.logo, '🦄', '💎', '🚀', '⚡', '🔥'];
        const newCoins = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: Math.random() * 100, // percentage
            scale: Math.random() * 1.5 + 0.5,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5,
            logo: tokenLogos[Math.floor(Math.random() * tokenLogos.length)],
            blur: Math.random() * 4 + 1 // blur amount in px
        }));
        setCoins(newCoins);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {coins.map((coin) => (
                <motion.div
                    key={coin.id}
                    className="absolute text-6xl select-none"
                    initial={{
                        x: `${coin.x}vw`,
                        y: `${coin.y}vh`,
                        opacity: 0,
                        scale: coin.scale,
                        filter: `blur(${coin.blur}px)`
                    }}
                    animate={{
                        y: [
                            `${coin.y}vh`,
                            `${coin.y - 20}vh`,
                            `${coin.y + 10}vh`,
                            `${coin.y}vh`
                        ],
                        x: [
                            `${coin.x}vw`,
                            `${coin.x + 10}vw`,
                            `${coin.x - 5}vw`,
                            `${coin.x}vw`
                        ],
                        rotate: [0, 180, 360],
                        opacity: [0, 0.4, 0.4, 0]
                    }}
                    transition={{
                        duration: coin.duration,
                        repeat: Infinity,
                        delay: coin.delay,
                        ease: "easeInOut"
                    }}
                    style={{
                        textShadow: '0 0 20px rgba(255,255,255,0.1)'
                    }}
                >
                    {coin.logo}
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingCoins;
