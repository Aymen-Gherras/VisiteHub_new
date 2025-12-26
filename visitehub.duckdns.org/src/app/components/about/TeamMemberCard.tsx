'use client';

import React from 'react';
import { useInViewOnce } from '@/app/hooks/useInViewOnce';

interface TeamMemberCardProps {
  member: {
    name: string;
    role: string;
    description: string;
    image: string;
    bgColor: string;
    textColor: string;
  };
  /** Animation: stagger delay (ms) for scroll-reveal. */
  revealDelayMs?: number;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, revealDelayMs = 0 }) => {
  const { ref, isInView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${revealDelayMs}ms` }}
      className={[
        // Animation: scroll-reveal (fade + slight upward motion)
        'bg-white rounded-2xl shadow-sm p-8 text-center',
        'transition-all duration-300 ease-out motion-reduce:transition-none',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        // Hover: subtle lift and shadow highlight
        'hover:-translate-y-0.5 hover:shadow-md',
      ].join(' ')}
    >
      {/* Avatar: square as requested */}
      <div className="w-24 h-24 rounded-none overflow-hidden mx-auto mb-4 border border-slate-200">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=8b5cf6&color=fff&size=200`;
          }}
        />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {member.name}
      </h3>
      <p className={`font-semibold mb-4 ${member.textColor}`}>{member.role}</p>
      <p className="text-gray-600">
        {member.description}
      </p>
    </div>
  );
};

export default TeamMemberCard;
