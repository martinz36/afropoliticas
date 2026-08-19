'use client';

import React, { useEffect } from 'react';

interface ThemeProviderProps {
  palette?: string;
  children: React.ReactNode;
}

export function ThemeProvider({ palette = 'amber', children }: ThemeProviderProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', palette);
    }
  }, [palette]);

  return <>{children}</>;
}
