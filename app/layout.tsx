import Providers from '@/utils/provider';
import './globals.scss';
import type { Metadata } from 'next';
import { Albert_Sans } from 'next/font/google';
import { Suspense } from 'react';
import Loading from './loading';

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-albertSans',
});

export const metadata: Metadata = {
  title: 'Admin Portal',
  description: 'Restricted Admin Portal',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <head>
        <link
          href="/apple-icon-57x57.png"
          rel="apple-touch-icon"
          sizes="57x57"
        />
        <link
          href="/apple-icon-60x60.png"
          rel="apple-touch-icon"
          sizes="60x60"
        />
        <link
          href="/apple-icon-72x72.png"
          rel="apple-touch-icon"
          sizes="72x72"
        />
        <link
          href="/apple-icon-76x76.png"
          rel="apple-touch-icon"
          sizes="76x76"
        />
        <link
          href="/apple-icon-114x114.png"
          rel="apple-touch-icon"
          sizes="114x114"
        />
        <link
          href="/apple-icon-120x120.png"
          rel="apple-touch-icon"
          sizes="120x120"
        />
        <link
          href="/apple-icon-144x144.png"
          rel="apple-touch-icon"
          sizes="144x144"
        />
        <link
          href="/apple-icon-152x152.png"
          rel="apple-touch-icon"
          sizes="152x152"
        />
        <link
          href="/apple-icon-180x180.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/android-icon-192x192.png"
          rel="icon"
          sizes="192x192"
          type="image/png"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-96x96.png"
          rel="icon"
          sizes="96x96"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/manifest.json" rel="manifest" />
        <meta content="#577434" name="msapplication-TileColor" />
        <meta content="/ms-icon-144x144.png" name="msapplication-TileImage" />
        <meta content="#577434" name="theme-color" />
      </head>
      <body className={albertSans.className}>
        <Providers>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
