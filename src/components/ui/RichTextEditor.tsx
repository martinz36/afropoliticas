'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import { useEffect } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-amber-400 underline hover:text-amber-300',
        },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none focus:outline-none min-h-[160px] p-4 text-xs text-slate-100 placeholder-slate-500',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === '<p></p>' ? '' : html);
    },
    immediatelyRender: false,
  });

  // Sync external value changes if needed
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 animate-pulse flex items-center justify-center text-xs text-slate-500">
        Cargando editor de texto...
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Introduce la URL del enlace:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-amber-500/80 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-950/70 border-b border-slate-800 text-slate-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('bold') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''
          }`}
          title="Negrita"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('italic') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''
          }`}
          title="Cursiva"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : ''
          }`}
          title="Título Principal (H1)"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : ''
          }`}
          title="Subtítulo (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : ''
          }`}
          title="Sección (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('bulletList') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''
          }`}
          title="Lista con viñetas"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('orderedList') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('blockquote') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''
          }`}
          title="Cita"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={setLink}
          disabled={disabled}
          className={`p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
            editor.isActive('link') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''
          }`}
          title="Insertar Enlace"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-800 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors disabled:opacity-40"
          title="Deshacer"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          className="p-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors disabled:opacity-40"
          title="Rehacer"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
