'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostHogProvider } from './PostHogProvider';

const queryClient = new QueryClient();

export function Providers({ children, ...props }: ThemeProviderProps) {
   return (
      <QueryClientProvider client={queryClient}>
         <PostHogProvider>
            <NextThemesProvider {...props}>{children}</NextThemesProvider>
         </PostHogProvider>
      </QueryClientProvider>
   );
}
