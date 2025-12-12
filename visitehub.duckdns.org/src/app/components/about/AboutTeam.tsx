'use client';

import React from 'react';
import dynamic from 'next/dynamic';

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
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  },
  {
    name: 'Meftah Bilel',
    role: 'Responsable Technique',
    description: 'Expert en développement et gestion des technologies avancées de la plateforme.',
    image: '/meftahBilel.jpg',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  {
    name: 'Rouz Sarah',
    role: 'Service Client',
    description: 'Dévouée à fournir une expérience client exceptionnelle et à répondre à tous vos besoins.',
    image: 'https://ui-avatars.com/api/?name=Rouz+Sarah&background=8b5cf6&color=fff&size=200',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600'
  }
];

export const AboutTeam = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
          Notre Équipe
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Une équipe passionnée d&apos;experts immobiliers et de techniciens dédiés à votre satisfaction
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
};