'use client';

import React from 'react';
import { BlogAnalytics as BlogAnalyticsType } from '@/lib/blogTypes';

interface BlogAnalyticsProps {
  analytics: BlogAnalyticsType;
  loading?: boolean;
}

export const BlogAnalytics: React.FC<BlogAnalyticsProps> = ({ analytics, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Total des articles',
      value: analytics.totalPosts,
      icon: '📝',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Articles publiés',
      value: analytics.publishedPosts,
      icon: '✅',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Brouillons',
      value: analytics.draftPosts,
      icon: '📋',
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    {
      label: 'Archivés',
      value: analytics.archivedPosts,
      icon: '🗄️',
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
    },
    {
      label: 'Total des vues',
      value: analytics.totalViews,
      displayValue: analytics.totalViews.toLocaleString(),
      icon: '👁️',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      label: 'Total des likes',
      value: analytics.totalLikes,
      displayValue: analytics.totalLikes.toLocaleString(),
      icon: '❤️',
      gradient: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-xl text-white text-2xl mr-4 shadow-lg`}>
              {stat.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {stat.displayValue || stat.value}
              </p>
            </div>
          </div>
          
          {/* Progress bar for visual appeal */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${stat.gradient} h-2 rounded-full transition-all duration-500`}
                style={{ 
                  width: `${Math.min((stat.value / Math.max(...stats.map(s => s.value))) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
