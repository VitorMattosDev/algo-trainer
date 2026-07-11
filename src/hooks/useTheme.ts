import { useCallback, useEffect, useState } from 'react';
import { storageGet, storageSet } from '../lib/storage';

export type Theme = 'dark' | 'light';

/**
 * Observa a classe `dark` no <html> — útil para componentes (ex.: Monaco)
 * reagirem ao toggle de tema sem acoplar estado entre instâncias do hook.
 */
export function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains('dark')),
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

/** Tema escuro por padrão; escolha persistida em `algo-trainer:theme`. */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const [theme, setTheme] = useState<Theme>(() => storageGet<Theme>('theme', 'dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storageSet('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
