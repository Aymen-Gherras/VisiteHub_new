'use client';

import React from 'react';
import DOMPurify from 'dompurify';

interface BlogContentProps {
  content: string;
}

export const BlogContent: React.FC<BlogContentProps> = ({ content }) => {
  // Sanitize content using DOMPurify to prevent XSS attacks
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
      'a', 'img', 'div', 'span', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title', 'alt', 'class',
      'src', 'width', 'height', 'style'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
      {content ? (
        <div 
          className="prose prose-lg max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-800"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />
      ) : (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Contenu non disponible
          </h3>
          <p className="text-gray-600">
            Le contenu de cet article n'a pas pu être chargé.
          </p>
        </div>
      )}
    </div>
  );
};
