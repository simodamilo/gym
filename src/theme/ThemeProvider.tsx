import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { lightTheme, darkTheme, type Theme, type ThemeMode } from './tokens';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Check for saved theme preference or use system preference
  const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  };

  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);
  const [theme, setThemeObject] = useState<Theme>(mode === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    // Update theme object when mode changes
    setThemeObject(mode === 'dark' ? darkTheme : lightTheme);

    // Save to localStorage
    localStorage.setItem('theme', mode);

    // Update HTML class for CSS variables
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);

    // Update meta theme-color for PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        mode === 'dark' ? darkTheme.bg.primary : lightTheme.bg.primary
      );
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
