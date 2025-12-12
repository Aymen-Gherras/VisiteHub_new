'use client';

import React, { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

interface TipTapEditorInternalProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sanitizeHTML: (html: string) => string;
  enhanceSEO: (html: string) => string;
}

export default function TipTapEditorInternal({
  value,
  onChange,
  placeholder = 'Rédigez votre contenu ici...',
  sanitizeHTML,
  enhanceSEO,
}: TipTapEditorInternalProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            title: {
              default: null,
            },
          };
        },
      }).configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
        },
      }),
      Color,
      TextStyle,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const sanitized = sanitizeHTML(html);
      const enhanced = enhanceSEO(sanitized);
      onChange(enhanced);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
        'data-placeholder': placeholder,
      },
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = prompt('Entrez l\'URL du lien:', previousUrl);
    
    if (url === null) return;
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    const title = prompt('Entrez le titre du lien (pour SEO - optionnel):') || '';
    
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ 
        href: url,
        ...(title ? { title } : {}),
        target: url.startsWith('http://') || url.startsWith('https://') ? '_blank' : undefined,
        rel: url.startsWith('http://') || url.startsWith('https://') ? 'noopener noreferrer' : undefined,
      })
      .run();
  }, [editor]);

  if (!editor) {
    return <div className="p-4 border border-gray-300 rounded-lg bg-white">Chargement de l'éditeur...</div>;
  }

  return (
    <div className="border border-gray-300 rounded-b-lg bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Gras"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Italique"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Souligné"
          >
            <u>U</u>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Barré"
          >
            <s>S</s>
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 text-sm font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Titre 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Titre 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Titre 3"
          >
            H3
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Liste à puces"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Liste numérotée"
          >
            1.
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Aligner à gauche"
          >
            ⬅
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Centrer"
          >
            ⬌
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Aligner à droite"
          >
            ➡
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Justifier"
          >
            ⬌⬌
          </button>
        </div>

        {/* Other */}
        <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Citation"
          >
            "
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Bloc de code"
          >
            {'</>'}
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-blue-100 text-blue-700' : ''}`}
            title="Lien"
          >
            🔗
          </button>
        </div>

        {/* Table */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Insérer un tableau"
          >
            ⬜
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Nettoyer le formatage"
          >
            🧹
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[400px]" />

      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
          padding: 1rem;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5em;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          background-color: #eff6ff;
          padding: 0.5rem 1rem;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .ProseMirror pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          width: 100%;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
        }
        .ProseMirror table th {
          background-color: #f3f4f6;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

