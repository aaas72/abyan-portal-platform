'use client';

import React from 'react';

export interface RichTextRendererProps {
  content?: string | null;
  className?: string;
}

export default function RichTextRenderer({
  content,
  className = '',
}: RichTextRendererProps) {
  if (!content) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (!isHtml) {
    return (
      <div className={`font-abyan-body text-sm sm:text-base text-slate-800 font-normal leading-relaxed whitespace-pre-line text-justify ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div
      className={`font-abyan-body text-sm sm:text-base text-slate-800 font-normal leading-relaxed text-right dir-rtl abyan-rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
