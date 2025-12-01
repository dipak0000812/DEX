import { useEffect, useState } from 'react';

export const useKonamiCode = () => {
    const [triggered, setTriggered] = useState(false);
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    const [input, setInput] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const newInput = [...input, e.key];
            if (newInput.length > konamiCode.length) {
                newInput.shift();
            }
            setInput(newInput);

            if (newInput.join('') === konamiCode.join('')) {
                setTriggered(true);
                // Reset after a delay so it can be triggered again
                setTimeout(() => setTriggered(false), 5000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, konamiCode]);

    return triggered;
};
