'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img
                  src="/logoblack.png"
                  alt="VisiteHub logo"
                  width={160}
                  height={50}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>

          {/* Tablet/iPad Condensed Navigation (md to xl) - Shows 3 key links */}
          <nav className="hidden md:flex xl:hidden items-center space-x-4 lg:space-x-6">
            <Link href="/" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200 text-sm lg:text-base">
              Accueil
            </Link>
            <Link href="/properties" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200 text-sm lg:text-base">
              Propriétés
            </Link>
            <Link href="/vendre-louer" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200 text-sm lg:text-base">
              Vendre/Louer
            </Link>
          </nav>

          {/* Desktop Full Navigation (xl and above - 1280px+) - Shows all links */}
          <nav className="hidden xl:block">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200">
                Accueil
              </Link>
              <Link href="/properties" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200">
                Propriétés
              </Link>
              <Link href="/vendre-louer" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200">
                Vendre/Louer
              </Link>
              <Link href="/blog" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200">
                Blog
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200">
                À propos
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-emerald-500 transition-colors duration-200">
                Contact
              </Link>
            </div>
          </nav>

          {/* Right Side: CTA + Hamburger */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Desktop CTA - Only shows on xl screens and above (1280px+) */}
            <div className="hidden xl:flex">
              <Link
                href="/vendre-louer"
                className="inline-flex items-center bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors duration-200 whitespace-nowrap"
              >
                Mettre mon bien en ligne
              </Link>
            </div>

            {/* Tablet/iPad CTA - Shows on md to xl */}
            <div className="hidden md:flex xl:hidden">
              <Link
                href="/vendre-louer"
                className="inline-flex items-center bg-emerald-500 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-full hover:bg-emerald-600 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap"
              >
                Publier
              </Link>
            </div>

            {/* Hamburger Menu Button - Shows on mobile and tablets only (hidden on xl+) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden text-slate-700 hover:text-emerald-500 p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Menu - Works on ALL screen sizes with different content */}
      {isMobileMenuOpen && (
        <div className="bg-white border-t shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile (< md): Show all links */}
            <div className="md:hidden space-y-1">
              <Link 
                href="/" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="/properties" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Propriétés
              </Link>
              <Link 
                href="/vendre-louer" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vendre/Louer
              </Link>
              <Link 
                href="/blog" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="px-3 pt-2">
                <Link 
                  href="/vendre-louer"
                  className="block w-full text-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mettre mon bien en ligne
                </Link>
              </div>
            </div>

            {/* Tablet/iPad (md to xl): Show only links NOT in main nav */}
            <div className="hidden md:block xl:hidden space-y-1">
              <Link 
                href="/blog" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {/* Desktop (xl+): Show secondary/utility links */}
            <div className="hidden xl:block space-y-1">
              <Link 
                href="/about" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                À propos
              </Link>
              <Link 
                href="/contact" 
                className="block px-3 py-2 text-slate-700 hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="border-t my-2"></div>
              <Link 
                href="/faq" 
                className="block px-3 py-2 text-slate-600 text-sm hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                href="/support" 
                className="block px-3 py-2 text-slate-600 text-sm hover:text-emerald-500 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}