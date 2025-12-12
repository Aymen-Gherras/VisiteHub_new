import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { ToastProvider } from './components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VisiteHub - Révolutionnez votre vente immobilière',
  description:
    "L'agence immobilière nouvelle génération avec visites virtuelles 360°. Réduisez vos visites physiques de 20+ à 3-5 seulement.",
  keywords: 'immobilier, vente, 360, visite virtuelle, Algérie, Oran, maison, appartement',
  authors: [{ name: 'VisiteHub' }],
  openGraph: {
    title: 'VisiteHub - Révolutionnez votre vente immobilière',
    description: "L'agence immobilière nouvelle génération avec visites virtuelles 360°",
    type: 'website',
    locale: 'fr_FR',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://visitehub.com/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* Preconnects */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />

        {/* ✅ Safe Font Awesome load (no onLoad handler) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />

        {/* Optional: load deferred via script (non-blocking) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const fa = document.createElement('link');
              fa.rel = 'stylesheet';
              fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
              fa.media = 'all';
              document.head.appendChild(fa);
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ToastProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </ToastProvider>
      </body>
    </html>
  );
}
