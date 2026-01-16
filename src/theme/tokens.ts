/**
 * Design Tokens for the Gym Workout Tracking App
 * Supports both light and dark modes
 */

export const colors = {
  // Primary Colors (Blue)
  primary: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#91caff',
    300: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff', // Main brand color
    600: '#0958d9',
    700: '#003eb3',
    800: '#002c8c',
    900: '#001d66',
  },

  // Accent Colors
  accent: {
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    purple: '#722ed1',
  },

  // Neutral Colors
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
};

export const gradients = {
  primary: 'linear-gradient(135deg, #1677ff 0%, #722ed1 100%)',
  success: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
  surface: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
  surfaceDark: 'linear-gradient(180deg, #1f1f1f 0%, #141414 100%)',
};

// Light Mode Theme
export const lightTheme = {
  // Background colors
  bg: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
    elevated: '#ffffff',
  },

  // Text colors
  text: {
    primary: '#262626',
    secondary: '#595959',
    tertiary: '#8c8c8c',
    inverse: '#ffffff',
  },

  // Border colors
  border: {
    light: '#f0f0f0',
    default: '#d9d9d9',
    strong: '#8c8c8c',
  },

  // Brand colors
  brand: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
  },

  // Semantic colors
  semantic: {
    success: colors.accent.success,
    warning: colors.accent.warning,
    error: colors.accent.error,
    info: colors.primary[500],
  },

  // Accent color
  accent: colors.accent.purple,

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
};

// Dark Mode Theme
export const darkTheme = {
  // Background colors
  bg: {
    primary: '#1f1f1f',
    secondary: '#262626',
    tertiary: '#434343',
    elevated: '#262626',
  },

  // Text colors
  text: {
    primary: '#fafafa',
    secondary: '#d9d9d9',
    tertiary: '#8c8c8c',
    inverse: '#262626',
  },

  // Border colors
  border: {
    light: '#434343',
    default: '#595959',
    strong: '#8c8c8c',
  },

  // Brand colors (slightly brighter for dark mode)
  brand: {
    primary: colors.primary[400],
    primaryHover: colors.primary[300],
    primaryActive: colors.primary[200],
  },

  // Semantic colors (adjusted for dark mode)
  semantic: {
    success: '#73d13d',
    warning: '#ffc53d',
    error: '#ff7875',
    info: colors.primary[400],
  },

  // Accent color
  accent: '#9254de',

  // Shadows (lighter for dark mode)
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  },
};

// Typography
export const typography = {
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    mono: "'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', monospace",
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// Spacing
export const spacing = {
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
};

// Border Radius
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
};

// Animation
export const animation = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },

  easing: {
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Export combined theme type
export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';
