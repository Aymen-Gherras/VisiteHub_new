'use client';

import React from 'react';

interface TeamMemberCardProps {
  member: {
    name: string;
    role: string;
    description: string;
    image: string;
    bgColor: string;
    textColor: string;
  };
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
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
