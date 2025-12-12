import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/ui/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VisiteHub - Révolutionnez votre vente immobilière',
  description: 'L\'agence immobilière nouvelle génération avec visites virtuelles 360°. Réduisez vos visites physiques de 20+ à 3-5 seulement.',
  keywords: 'immobilier, vente, 360, visite virtuelle, Algérie, Oran, maison, appartement',
  authors: [{ name: 'VisiteHub' }],
  openGraph: {
    title: 'VisiteHub - Révolutionnez votre vente immobilière',
    description: 'L\'agence immobilière nouvelle génération avec visites virtuelles 360°',
    type: 'website',
    locale: 'fr_FR',
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
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}