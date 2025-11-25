'use client';

import { QueryClient, QueryCache, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { logError } from '@/common/utils/logError';
import { DM_Sans } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';


const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#155DFC',
    },
    secondary: {
      main: '#000000',
    }
  },
  typography: {
    fontFamily: dmSans.style.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: '0.5rem',
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      logError({
        error: error?.message || error,
        location: 'React Query',
        when: `fetching data for query key: ${query.queryKey}`,
      });
    }
  })
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
