import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                Poppins: ["var(--font-Poppins)", "sans-serif"],
                Josefin: ["var(--font-Josefin)", "sans-serif"],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'gradient-accent': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            },
            animation: {
                'fadeInUp': 'fadeInUp 0.6s ease-out',
                'slideInLeft': 'slideInLeft 0.8s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'gradient-shift': 'gradient-shift 3s ease infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-50px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)' },
                },
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            screens: {
                "1000px": "1000px",
                "1100px": "1100px",
                "1200px": "1200px",
                "1300px": "1300px",
                "1500px": "1500px",
                "800px": "800px",
                "400px": "400px",
            },
            colors: {
                primary: {
                    50: '#f5f7ff',
                    100: '#ebf0fe',
                    200: '#d6e0fd',
                    300: '#b3c5fb',
                    400: '#8ca5f8',
                    500: '#667eea',
                    600: '#5568d3',
                    700: '#4553b8',
                    800: '#3a4694',
                    900: '#2f3a78',
                },
            },
        },
    },
    plugins: [],
}

export default config;
