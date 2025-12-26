'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useInViewOnce } from '@/app/hooks/useInViewOnce';

const TeamMemberCard = dynamic(
  () => import('./TeamMemberCard'),
  { ssr: false }
);

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Fesraoui Yacine',
    role: 'Fondateur & CEO',
    description: 'Visionnaire et leader de l\'équipe, apportant une expertise approfondie dans le domaine.',
    image: '/yacine.webp',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  },
  {
    name: 'Gherras Aymen',
    role: 'Full stack developer',
    description: 'Développement frontend et backend, intégration API, et amélioration continue de la plateforme.',
    image: '/gherras-aymen.png',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  },
  {
    name: 'Meftah Bilel',
    role: 'Responsable Technique',
    description: 'Expert en développement et gestion des technologies avancées de la plateforme.',
    image: '/meftahBilel.jpg',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  },
  {
    name: 'Rouz Sarah',
    role: 'Service Client',
    description: 'Dévouée à fournir une expérience client exceptionnelle et à répondre à tous vos besoins.',
    image: 'https://ui-avatars.com/api/?name=Rouz+Sarah&background=8b5cf6&color=fff&size=200',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  }
  
];

export const AboutTeam = () => {
  const { ref: headerRef, isInView: headerInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Animation: scroll-reveal (section intro) */}
      <div
        ref={headerRef}
        className={[
          'text-center mb-16 transition-all duration-500 ease-out motion-reduce:transition-none',
          headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        ].join(' ')}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
          Notre Équipe
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Une équipe passionnée d&apos;experts immobiliers et de techniciens dédiés à votre satisfaction
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} member={member} revealDelayMs={index * 90} />
        ))}
      </div>
    </div>
  );
};