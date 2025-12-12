import React from 'react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutMission } from '../components/about/AboutMission';
import { AboutServices } from '../components/about/AboutServices';
import { AboutStats } from '../components/about/AboutStats';
import { AboutCTA } from '../components/about/AboutCTA';
import { AboutTeam } from '../components/about/AboutTeam';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <AboutHero />
      <AboutMission />
      <AboutServices />
      <AboutStats />
      <AboutTeam />
      <AboutCTA />
    </div>
  );
}