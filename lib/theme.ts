export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_KEY = 'theme';

let systemQuery: MediaQueryList | null = null;
let systemListener: (() => void) | null = null;

function applySystemTheme() {
  if (typeof document === 'undefined') return;
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
}

function cleanupSystemListener() {
  if (systemQuery && systemListener) {
    systemQuery.removeEventListener('change', systemListener);
    systemQuery = null;
    systemListener = null;
  }
}

/**
 * Apply theme to the document (Tailwind class-based dark mode).
 * Use "system" to follow OS preference and react to changes.
 */
export function applyTheme(theme: ThemePreference): void {
  if (typeof document === 'undefined') return;
  cleanupSystemListener();
  switch (theme) {
    case 'dark':
      document.documentElement.classList.add('dark');
      break;
    case 'light':
      document.documentElement.classList.remove('dark');
      break;
    case 'system':
      applySystemTheme();
      systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
      systemListener = () => applySystemTheme();
      systemQuery.addEventListener('change', systemListener);
      break;
  }
}

/**
 * Read stored theme preference. Safe to call on server (returns 'light').
 */
export function getTheme(): ThemePreference {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
  return 'light';
}

/**
 * Persist theme and apply it.
 */
export function setTheme(theme: ThemePreference): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}
