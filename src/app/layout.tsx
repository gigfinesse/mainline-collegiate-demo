import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { AppProvider } from '@/lib/context/AppProvider';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mainline Collegiate',
  description: 'The social event calendar for college campuses',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-dark-950 text-gray-100">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center bg-dark-900">
              <div className="text-gray-400">Loading...</div>
            </div>
          }
        >
          <AppProvider>{children}</AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
