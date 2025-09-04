import './globals.css';
import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from './providers';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const sora = Sora({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-sora' })

export const metadata: Metadata = {
   title: 'SixPathCast - Intelligent Social Media Management',
   description: 'AI-powered social media management platform for building your personal brand',
   openGraph: {
      title: 'SixPathCast - Intelligent Social Media Management',
      description: 'AI-powered social media management platform for building your personal brand',
      url: 'https://<your-domain>',
      siteName: 'SixPathCast',
      images: [
         {
            url: 'https://<your-domain>/og-image.png', // Must be an absolute URL
            width: 1200,
            height: 630,
         },
      ],
      locale: 'en_US',
      type: 'website',
   },
   twitter: {
      card: 'summary_large_image',
      title: 'SixPathCast - Intelligent Social Media Management',
      description: 'AI-powered social media management platform for building your personal brand',
      creator: '@your_twitter_handle',
      images: ['https://<your-domain>/twitter-image.png'], // Must be an absolute URL
   },
};

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={`${inter.variable} ${sora.variable} font-sans`}>
            <Providers
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               {children}
            </Providers>
            <Toaster />
         </body>
      </html>
   );
}
