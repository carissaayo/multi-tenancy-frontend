'use client';

import { useEffect } from 'react';
import { getTheme, applyTheme } from '@/lib/theme';

/**
 * Applies saved theme on mount so Tailwind dark mode is correct before paint.
 * Must be inside a client tree (e.g. Providers).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = getTheme();
    applyTheme(theme);
  }, []);
  return <>{children}</>;
}
