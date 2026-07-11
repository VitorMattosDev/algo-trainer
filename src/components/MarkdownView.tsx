import { useMemo } from 'react';
import { renderMarkdown } from '../lib/markdown';

/**
 * Renderiza markdown do próprio app (enunciados, cheatsheets, explicações).
 * O conteúdo é confiável (está no repositório), por isso innerHTML é seguro aqui.
 */
export function MarkdownView({ markdown, className }: { markdown: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(markdown), [markdown]);
  return (
    <div
      className={`markdown-body ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
