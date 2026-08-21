'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

export interface AdminRichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  minHeight?: string;
}

export default function AdminRichTextEditor({
  label,
  value,
  onChange,
  containerClassName = '',
  placeholder = 'اكتب الشرح التوثيقي والتفاصيل هنا...',
  required,
  error,
  minHeight = '180px'
}: AdminRichTextEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);

  // Normalize initial value (if plain text without HTML tags, wrap lines into <p>)
  const formatInitialContent = (rawContent: string) => {
    if (!rawContent) return '';
    if (/<[a-z][\s\S]*>/i.test(rawContent)) {
      return rawContent;
    }
    return rawContent
      .split('\n\n')
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'right',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-600 underline font-abyan-title hover:text-[#10b981] transition-colors',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-slate-400 before:float-right before:pointer-events-none',
      }),
    ],
    content: formatInitialContent(value),
    editorProps: {
      attributes: {
        class: `w-full px-4 py-3 outline-none font-abyan-body text-sm text-slate-800 leading-relaxed text-right dir-rtl prose prose-slate max-w-none focus:outline-none min-h-[${minHeight}]`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html === '<p></p>') {
        onChange('');
      } else {
        onChange(html);
      }
    },
  });

  // Sync editor content when external value changes
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHtml = editor.getHTML();
      const normalizedIncoming = formatInitialContent(value);
      if (value !== currentHtml && normalizedIncoming !== currentHtml) {
        if (!value) {
          editor.commands.setContent('');
        } else {
          editor.commands.setContent(normalizedIncoming);
        }
      }
    }
  }, [value, editor]);

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('أدخل رابط المصدر أو المرجع (URL):', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {/* Top Header & Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="font-abyan-title text-[13px] text-slate-800">
          {label} {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setIsSourceMode(!isSourceMode)}
          className="text-xs font-abyan-title text-slate-500 hover:text-[#10b981] bg-transparent border-none cursor-pointer transition-colors"
        >
          {isSourceMode ? 'العودة للمحرر المرئي' : 'محرر الكود (HTML)'}
        </button>
      </div>

      {/* Editor Container */}
      <div
        className={`rounded-xl border transition-all overflow-hidden ${
          error
            ? 'border-red-500 bg-red-50/5'
            : 'border-slate-200 focus-within:border-[#10b981] bg-white'
        }`}
      >
        {isSourceMode ? (
          <textarea
            rows={8}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="اكتب كود HTML المباشر هنا..."
            className="w-full p-4 font-mono text-xs text-slate-800 bg-slate-50 outline-none resize-y min-h-[180px] border-none"
            dir="ltr"
          />
        ) : (
          <>
            {/* Rich Toolbar */}
            {editor && (
              <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/80 border-b border-slate-200 select-none">
                {/* 1. Headings Group */}
                <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('paragraph')
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="نص عادي"
                  >
                    فقرة
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('heading', { level: 2 })
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="عنوان رئيسي (H2)"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('heading', { level: 3 })
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="عنوان فرعي (H3)"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('heading', { level: 4 })
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="عنوان محوري (H4)"
                  >
                    H4
                  </button>
                </div>

                <div className="w-px h-5 bg-slate-200 mx-0.5" />

                {/* 2. Text Styles Group */}
                <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`w-7 h-7 flex items-center justify-center text-xs rounded font-bold transition-colors ${
                      editor.isActive('bold')
                        ? 'bg-[#10b981] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="عريض (Bold)"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`w-7 h-7 flex items-center justify-center text-xs rounded italic transition-colors ${
                      editor.isActive('italic')
                        ? 'bg-[#10b981] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="مائل (Italic)"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`w-7 h-7 flex items-center justify-center text-xs rounded underline transition-colors ${
                      editor.isActive('underline')
                        ? 'bg-[#10b981] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="تسطير (Underline)"
                  >
                    U
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`w-7 h-7 flex items-center justify-center text-xs rounded line-through transition-colors ${
                      editor.isActive('strike')
                        ? 'bg-[#10b981] text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="يتوسطه خط (Strike)"
                  >
                    S
                  </button>
                </div>

                <div className="w-px h-5 bg-slate-200 mx-0.5" />

                {/* 3. Lists & Structure Group */}
                <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('bulletList')
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="قائمة نقطية"
                  >
                    • قائمة
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('orderedList')
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="قائمة مرقمة"
                  >
                    1. قائمة
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('blockquote')
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="اقتباس توثيقي"
                  >
                    « اقتباس »
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className="px-2 py-1 text-xs rounded font-abyan-title text-slate-700 hover:bg-slate-100 transition-colors"
                    title="فاصل أفقي"
                  >
                    ― فاصل
                  </button>
                </div>

                <div className="w-px h-5 bg-slate-200 mx-0.5" />

                {/* 4. Text Alignment Group */}
                <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`px-1.5 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive({ textAlign: 'right' })
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="محاذاة لليمين"
                  >
                    يمين
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`px-1.5 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive({ textAlign: 'center' })
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="توسيط"
                  >
                    وسط
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`px-1.5 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive({ textAlign: 'left' })
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="محاذاة لليسار"
                  >
                    يسار
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={`px-1.5 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive({ textAlign: 'justify' })
                        ? 'bg-[#10b981] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    title="ضبط متوازن"
                  >
                    ضبط
                  </button>
                </div>

                <div className="w-px h-5 bg-slate-200 mx-0.5" />

                {/* 5. Links & Utilities Group */}
                <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={setLink}
                    className={`px-2 py-1 text-xs rounded font-abyan-title transition-colors ${
                      editor.isActive('link')
                        ? 'bg-sky-600 text-white font-bold'
                        : 'text-sky-600 hover:bg-sky-50'
                    }`}
                    title="إدراج أو تعديل رابط"
                  >
                    رابط ↗
                  </button>
                  {editor.isActive('link') && (
                    <button
                      type="button"
                      onClick={() => editor.chain().focus().unsetLink().run()}
                      className="px-2 py-1 text-xs rounded font-abyan-title text-red-500 hover:bg-red-50 transition-colors"
                      title="إلغاء الرابط"
                    >
                      إلغاء الرابط
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                    className="px-2 py-1 text-xs rounded font-abyan-title text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="مسح التنسيق"
                  >
                    مسح التنسيق
                  </button>
                </div>

                {/* 6. History Group */}
                <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-200 mr-auto">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="px-2 py-1 text-xs rounded font-abyan-title text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="تراجع"
                  >
                    تراجع
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="px-2 py-1 text-xs rounded font-abyan-title text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="إعادة"
                  >
                    إعادة
                  </button>
                </div>
              </div>
            )}

            {/* Editable Content Area */}
            <div className="min-h-[160px] cursor-text bg-white">
              <EditorContent editor={editor} />
            </div>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-abyan-body mt-0.5">{error}</p>}
    </div>
  );
}
