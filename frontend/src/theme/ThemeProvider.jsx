import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { THEME_STORAGE_KEY, themes } from './themes.js';

const ThemeContext = createContext(null);

function resolveInitialTheme() {
  if (typeof window === 'undefined') {
    return themes[0].id;
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return themes.some((theme) => theme.id === savedTheme) ? savedTheme : themes[0].id;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(resolveInitialTheme);

  useEffect(() => {
    const selectedTheme = themes.find((item) => item.id === theme) ?? themes[0];
    const root = document.documentElement;

    root.dataset.theme = selectedTheme.id;
    Object.entries(selectedTheme.tokens).forEach(([token, value]) => {
      root.style.setProperty(token, value);
    });

    window.localStorage.setItem(THEME_STORAGE_KEY, selectedTheme.id);
  }, [theme]);

  const value = useMemo(() => {
    const currentTheme = themes.find((item) => item.id === theme) ?? themes[0];
    return {
      theme: currentTheme,
      themes,
      setTheme,
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
