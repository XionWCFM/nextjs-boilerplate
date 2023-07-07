import React from 'react';
import '@/styles/globals.css';
import '@/styles/animation.css';
import '@/styles/style.css';

import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';

const notosanskr = Noto_Sans_KR({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kr">
      <body className={notosanskr.className}>{children}</body>
    </html>
  );
}
