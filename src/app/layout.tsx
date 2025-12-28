'use client'

import "./globals.css";
import React from 'react';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import { DM_Sans } from 'next/font/google';

interface RootLayoutProps {
  children: React.ReactNode;
}

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
});

export default function RootLayout({ children }: RootLayoutProps) {

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      // Default to dark if no preference is set
      const isDark = stored ? stored === 'dark' : true;
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  return (
    <html lang="en">
      <body className={dmSans.variable}>
        <Providers>
          {children}
          <ToastContainer position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
