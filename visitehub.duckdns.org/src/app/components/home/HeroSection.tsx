'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { apiService } from '../../../api';

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const defaultSlides = [
    {
      image: "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1280&dpr=1",
      title: "Villa moderne avec piscine",
      location: "Alger, Hydra"
    },
    {
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1280&dpr=1",
      title: "Appartement lumineux centre-ville",
      location: "Oran, Centre"
    },
    {
      image: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1280&dpr=1",
      title: "Penthouse avec terrasse",
      location: "Constantine, Plateau"
    }
  ];

  const [slides, setSlides] = useState<{ image: string; title?: string; location?: string; mediaType?: 'image' | 'video' }[]>(defaultSlides);

  useEffect(() => {
    // Fetch public carousel; if none, keep defaultSlides
    apiService
      .getPublicCarousel()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data.map((d) => ({ 
            image: d.imageUrl, 
            title: d.altText || undefined,
            mediaType: d.mediaType || 'image'
          })));
        }
      })
      .catch(() => {});

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentSlide];

  return (
<section className="
  relative 
  min-h-[70vh] md:min-h-[85vh] 
  flex items-start md:items-center justify-center 
  overflow-hidden 
  pt-28 md:pt-0
">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {activeSlide && (
          <div key={currentSlide} className="absolute inset-0 animate-fadeIn">
            {activeSlide.mediaType === 'video' ? (
              <video
                src={activeSlide.image}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Image
                src={activeSlide.image}
                alt={activeSlide.title || 'Slide'}
                fill
                priority={currentSlide === 0}
                quality={70}
                sizes="(max-width: 768px) 100vw, 1920px"
                style={{ objectFit: 'cover' }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">


          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Visitez avant de
            <br />
            <span className="text-emerald-400">vous déplacer</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-6 max-w-4xl mx-auto">
            Vendez sans effort. Trouvez votre bien idéal grâce à la visite virtuelle 360°.
            <br className="hidden md:block" />
            Une nouvelle expérience immobilière en Algérie.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
            <Link href="/properties" className="group bg-emerald-500 text-white px-7 py-3 rounded-xl text-lg font-semibold hover:bg-emerald-600 transition-colors duration-300 shadow-xl flex items-center">
              <i className="fas fa-search mr-2"></i>
              Je cherche un bien
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </Link>
            <a href="/vendre-louer" className="group border-2 bg-white border-white text-black px-7 py-3 rounded-xl text-lg font-semibold hover:bg-white hover:text-slate-800 transition-colors duration-300 flex items-center">
              <i className="fas fa-home mr-2"></i>
              Je veux vendre/louer
              <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>


        </div>
      </div>

      {/* Slide Indicators removed to reduce visual clutter and empty space */}

    </section>
  );
};