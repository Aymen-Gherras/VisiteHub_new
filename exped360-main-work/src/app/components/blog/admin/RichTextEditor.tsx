'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';

// Dynamically import TipTap editor to avoid SSR issues
const TipTapEditorInternal = dynamic(
  () => import('./TipTapEditorInternal'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <div className="animate-pulse">Chargement de l'éditeur...</div>
      </div>
    )
  }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Rédigez votre contenu ici...',
  className = '',
}) => {
  const [showSource, setShowSource] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);

  // Update source code when value changes externally
  useEffect(() => {
    if (!showSource) {
      setSourceCode(value);
    }
  }, [value, showSource]);

  // Count words and characters
  const stats = useMemo(() => {
    if (!value) return { words: 0, characters: 0, charactersNoSpaces: 0 };
    
    // Remove HTML tags for accurate counting
    const textContent = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = textContent ? textContent.split(/\s+/).filter(word => word.length > 0).length : 0;
    const characters = textContent.length;
    const charactersNoSpaces = textContent.replace(/\s/g, '').length;
    
    return { words, characters, charactersNoSpaces };
  }, [value]);

  // Sanitize HTML before saving
  const sanitizeHTML = (html: string): string => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's', 'strike',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'div', 'span', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'sub', 'sup', 'del', 'ins'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'title', 'class',
        'style', 'align', 'colspan', 'rowspan', 'data-type'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'iframe'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange'],
    });
  };

  // Ensure links have proper SEO attributes
  const enhanceSEO = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const links = doc.querySelectorAll('a');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
      // Add title if missing
      if (!link.getAttribute('title') && link.textContent) {
        link.setAttribute('title', link.textContent.trim());
      }
    });
    
    return doc.body.innerHTML;
  };

  const handleSourceToggle = () => {
    if (showSource) {
      // Switching from source to editor - sanitize and update
      const sanitized = sanitizeHTML(sourceCode);
      const enhanced = enhanceSEO(sanitized);
      onChange(enhanced);
      setSourceCode(enhanced);
    } else {
      // Switching to source view - update source code
      setSourceCode(value);
    }
    setShowSource(!showSource);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceCode(e.target.value);
  };

  return (
    <div className={`rich-text-editor-wrapper ${className}`}>
      {/* Toolbar with toggle buttons */}
      <div className="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-t-lg border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSourceToggle}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              showSource
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {showSource ? '📝 Éditeur' : '💻 Code HTML'}
          </button>
          <button
            type="button"
            onClick={() => {
              const sanitized = sanitizeHTML(value);
              const enhanced = enhanceSEO(sanitized);
              onChange(enhanced);
            }}
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            title="Nettoyer et optimiser le HTML"
          >
            🧹 Nettoyer
          </button>
        </div>
        
        {/* Statistics */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>📊 {stats.words} mots</span>
          <span>🔤 {stats.characters.toLocaleString()} caractères</span>
          <span>📝 {stats.charactersNoSpaces.toLocaleString()} sans espaces</span>
        </div>
      </div>

      {/* Editor or Source View */}
      {showSource ? (
        <div className="border border-gray-300 rounded-b-lg">
          <textarea
            value={sourceCode}
            onChange={handleSourceChange}
            className="w-full h-96 p-4 font-mono text-sm border-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Code HTML..."
            style={{ minHeight: '400px' }}
          />
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 rounded-b-lg">
            💡 Modifiez le code HTML directement. Cliquez sur "📝 Éditeur" pour revenir à l'éditeur visuel.
          </div>
        </div>
      ) : (
        <TipTapEditorInternal
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          sanitizeHTML={sanitizeHTML}
          enhanceSEO={enhanceSEO}
        />
      )}

      {/* Live Preview */}
      <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">👁️ Aperçu en direct</h3>
          <span className="text-xs text-gray-500">Mise à jour automatique</span>
        </div>
        <div className="bg-white p-6 prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(value, {
                ALLOWED_TAGS: [
                  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 's',
                  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                  'ul', 'ol', 'li',
                  'blockquote', 'pre', 'code',
                  'a', 'div', 'span', 'hr',
                  'table', 'thead', 'tbody', 'tr', 'th', 'td'
                ],
                ALLOWED_ATTR: ['href', 'target', 'rel', 'title', 'class', 'style', 'align'],
              })
            }}
            className="text-gray-800"
          />
          {!value && (
            <p className="text-gray-400 italic">L'aperçu apparaîtra ici lorsque vous commencerez à rédiger...</p>
          )}
        </div>
      </div>
    </div>
  );
};
