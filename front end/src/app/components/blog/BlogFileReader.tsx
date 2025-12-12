'use client';

import React, { useState, useEffect } from 'react';

interface BlogFile {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featuredImage?: string;
  filename: string;
}

interface BlogFileReaderProps {
  onBlogsLoaded: (blogs: BlogFile[]) => void;
}

export const BlogFileReader: React.FC<BlogFileReaderProps> = ({ onBlogsLoaded }) => {
  const [blogs, setBlogs] = useState<BlogFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogFiles();
  }, []);

  const loadBlogFiles = async () => {
    try {
      // This will be replaced with actual file system reading
      // For now, we'll simulate reading from a blog files directory
      const mockBlogFiles: BlogFile[] = [
        {
          id: 'blog-1',
          title: 'Comment bien vendre sa propriété en 2024',
          excerpt: 'Découvrez les meilleures stratégies pour vendre votre bien immobilier rapidement et au meilleur prix.',
          content: `
            <h2>Introduction</h2>
            <p>Vendre une propriété en 2024 nécessite une approche stratégique et une bonne compréhension du marché immobilier actuel.</p>
            
            <h2>1. Préparer sa propriété</h2>
            <p>La première étape consiste à préparer votre bien pour la vente :</p>
            <ul>
              <li>Nettoyer et ranger tous les espaces</li>
              <li>Effectuer les petites réparations nécessaires</li>
              <li>Dépersonnaliser les pièces</li>
            </ul>
          `,
          author: 'Équipe VisiteHub',
          publishedAt: '2024-01-15',
          tags: ['Vente', 'Conseils', 'Immobilier'],
          filename: 'comment-vendre-propriete-2024.html'
        },
        {
          id: 'blog-2',
          title: 'Les avantages de la visite virtuelle 360°',
          excerpt: 'Pourquoi la visite virtuelle révolutionne la vente immobilière.',
          content: `
            <h2>Révolution dans l'immobilier</h2>
            <p>La visite virtuelle 360° transforme complètement la façon dont les acheteurs découvrent les propriétés.</p>
            
            <h2>Avantages pour les vendeurs</h2>
            <ul>
              <li>Réduction du nombre de visites physiques</li>
              <li>Attraction d'acheteurs plus qualifiés</li>
              <li>Différenciation de la concurrence</li>
            </ul>
          `,
          author: 'Équipe VisiteHub',
          publishedAt: '2024-01-10',
          tags: ['Visite virtuelle', 'Technologie', 'Innovation'],
          filename: 'avantages-visite-virtuelle-360.html'
        }
      ];

      setBlogs(mockBlogFiles);
      onBlogsLoaded(mockBlogFiles);
      setLoading(false);
    } catch (error) {
      console.error('Error loading blog files:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des articles...</p>
      </div>
    );
  }

  return null; // This component just loads data, doesn't render UI
};
