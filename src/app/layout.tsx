import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
};

export const metadata: Metadata = {
  title: 'Money Manager India - Smart Personal Finance Management',
  description:
    'Track your income, expenses, and investments with Money Manager India. Get insights into your spending patterns, plan budgets, and achieve your financial goals with our powerful finance management tool built for Indians.',
  applicationName: 'Money Manager India',
  keywords: [
    'finance management',
    'budget planner',
    'expense tracker',
    'personal finance',
    'investment tracking',
    'tax calculator',
    'India',
    'financial planning',
  ],
  authors: [{ name: 'Money Manager India' }],
  creator: 'Money Manager India',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://moneymanagerindia.com',
    title: 'Money Manager India - Smart Personal Finance Management',
    description:
      'Track your income, expenses, and investments with Money Manager India. Get insights into your spending patterns, plan budgets, and achieve your financial goals.',
    siteName: 'Money Manager India',
    images: [
      {
        url: 'https://moneymanagerindia.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Money Manager India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Money Manager India - Smart Personal Finance Management',
    description:
      'Track your income, expenses, and investments with Money Manager India.',
    images: ['https://moneymanagerindia.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
