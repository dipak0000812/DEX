/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: '#0A0E27', // Deep space blue
                    secondary: '#141B3D', // Midnight blue
                    card: 'rgba(255, 255, 255, 0.05)',
                },
                primary: {
                    DEFAULT: '#00F5FF', // Cyan
                    glow: '#00F5FF',
                },
                secondary: {
                    DEFAULT: '#B026FF', // Purple
                    glow: '#B026FF',
                },
                accent: {
                    DEFAULT: '#39FF14', // Neon green
                    glow: '#39FF14',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#A0AEC0',
                },
                border: 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s ease-out',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 245, 255, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.6), 0 0 10px rgba(0, 245, 255, 0.4)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
