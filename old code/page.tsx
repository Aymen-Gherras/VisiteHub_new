'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { HeroSection } from './components/home/HeroSection';
import { PropertySearch } from './components/home/PropertySearch';
import { AddProperty } from './components/home/AddProperty';
import { HowItWorks } from './components/home/HowItWorks';
import { Testimonials } from './components/home/Testimonials';
import { AboutUs } from './components/home/AboutUs';
import { Contact } from './components/home/Contact';
import { apiService, Property } from '../api';

export default function HomePage() {

  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <PropertySearch />
      <Testimonials />
      <Contact />
    </main>
  );
}

