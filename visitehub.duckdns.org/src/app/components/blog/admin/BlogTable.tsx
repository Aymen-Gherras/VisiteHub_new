'use client';

import React, { useState } from 'react';
import { BlogPost, BlogPostStatus } from '@/lib/blogTypes';

interface BlogTableProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: BlogPostStatus) => void;
  loading?: boolean;
}

export const BlogTable: React.FC<BlogTableProps> = ({
  posts,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false,
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getStatusBadge = (status: BlogPostStatus) => {
    const statusConfig = {
      [BlogPostStatus.DRAFT]: {
        label: 'Brouillon',
        className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: '📝',
      },
      [BlogPostStatus.PUBLISHED]: {
        label: 'Publié',
        className: 'bg-green-100 text-green-800 border border-green-200',
        icon: '✅',
      },
      [BlogPostStatus.ARCHIVED]: {
        label: 'Archivé',
        className: 'bg-red-100 text-red-800 border border-red-200',
        icon: '🗄️',
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${config.className}`}>
        <span className="mr-1.5">{config.icon}</span>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Aucun article de blog
          </h3>
          <p className="text-gray-600">
            Commencez par créer votre premier article de blog.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Auteur
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Statistiques
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                <td className="px-6 py-5">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {post.featuredImage ? (
                        <div className="h-16 w-16 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                          <img
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                            src={post.featuredImage}
                            alt={post.title}
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center">
                          <span className="text-2xl text-gray-400">📷</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                          /{post.slug}
                        </span>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium mr-3">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{post.author}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {getStatusBadge(post.status)}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {formatDate(post.publishedAt)}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-gray-500 mr-2">👁️</span>
                      <span className="font-semibold text-gray-900">{post.viewCount}</span>
                    </div>
                    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-gray-500 mr-2">❤️</span>
                      <span className="font-semibold text-gray-900">{post.likeCount}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onEdit(post)}
                      className="inline-flex items-center px-3 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100 hover:border-blue-400 transition-colors duration-200"
                    >
                      <span className="mr-1.5">✏️</span>
                      Modifier
                    </button>
                    
                    <select
                      value={post.status}
                      onChange={(e) => onStatusChange(post.id, e.target.value as BlogPostStatus)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value={BlogPostStatus.DRAFT}>Brouillon</option>
                      <option value={BlogPostStatus.PUBLISHED}>Publié</option>
                      <option value={BlogPostStatus.ARCHIVED}>Archivé</option>
                    </select>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-red-700 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100 hover:border-red-400 transition-colors duration-200"
                    >
                      <span className="mr-1.5">🗑️</span>
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
