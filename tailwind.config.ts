export default {
    darkMode: 'class', // ✅ Enable manual dark mode
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}', // ✅ Vite + React file matching
    ],
    theme: {
        extend: {
            colors: {
                // Primary colors
                primary: {
                    50: '#e6f4ff',
                    100: '#bae0ff',
                    200: '#91caff',
                    300: '#69b1ff',
                    400: '#4096ff',
                    500: '#1677ff',
                    600: '#0958d9',
                    700: '#003eb3',
                    800: '#002c8c',
                    900: '#001d66',
                },
                // Accent colors
                accent: {
                    success: '#52c41a',
                    warning: '#faad14',
                    error: '#ff4d4f',
                    purple: '#722ed1',
                },
                // Neutral colors
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e8e8e8',
                    300: '#d9d9d9',
                    400: '#bfbfbf',
                    500: '#8c8c8c',
                    600: '#595959',
                    700: '#434343',
                    800: '#262626',
                    900: '#1f1f1f',
                    950: '#141414',
                },
                // Background colors (CSS variables)
                'bg-primary': 'var(--bg-primary)',
                'bg-secondary': 'var(--bg-secondary)',
                'bg-tertiary': 'var(--bg-tertiary)',
                'bg-elevated': 'var(--bg-elevated)',
                'bg-base': 'var(--bg-base)',
                // Text colors (CSS variables)
                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-tertiary': 'var(--text-tertiary)',
                // Border colors (CSS variables)
                'border-light': 'var(--border-light)',
                'border-default': 'var(--border-default)',
                'border-strong': 'var(--border-strong)',
                // Brand colors (CSS variables)
                'brand-primary': 'var(--brand-primary)',
                'brand-primary-hover': 'var(--brand-primary-hover)',
                // Semantic colors (CSS variables)
                'semantic-success': 'var(--semantic-success)',
                'semantic-error': 'var(--semantic-error)',
                'semantic-warning': 'var(--semantic-warning)',
                'semantic-info': 'var(--semantic-info)',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                mono: ['SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
            },
            fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem',
                '4xl': '2.25rem',
            },
            spacing: {
                1: '0.25rem',
                2: '0.5rem',
                3: '0.75rem',
                4: '1rem',
                5: '1.25rem',
                6: '1.5rem',
                8: '2rem',
                10: '2.5rem',
                12: '3rem',
                16: '4rem',
                20: '5rem',
            },
            borderRadius: {
                sm: '4px',
                DEFAULT: '8px',
                md: '8px',
                lg: '12px',
                xl: '16px',
                '2xl': '20px',
                full: '9999px',
            },
            boxShadow: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
                // CSS variable shadows
                'var-sm': 'var(--shadow-sm)',
                'var-md': 'var(--shadow-md)',
                'var-lg': 'var(--shadow-lg)',
                'var-xl': 'var(--shadow-xl)',
            },
            transitionDuration: {
                fast: '150ms',
                DEFAULT: '250ms',
                normal: '250ms',
                slow: '350ms',
            },
            transitionTimingFunction: {
                in: 'cubic-bezier(0.4, 0, 1, 1)',
                out: 'cubic-bezier(0, 0, 0.2, 1)',
                'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
                spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
                'gradient-success': 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                'gradient-surface': 'linear-gradient(180deg, #f5f5f7 0%, #e8e8ed 100%)',
                'gradient-surface-dark': 'linear-gradient(180deg, #1f1f1f 0%, #141414 100%)',
            },
        },
    },
    plugins: [],
}