import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import { Marked } from 'marked';

// Registramos apenas as linguagens do projeto para manter o bundle leve.
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);

const marked = new Marked({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : undefined;
      const highlighted = language
        ? hljs.highlight(text, { language }).value
        : escapeHtml(text);
      return `<pre><code class="hljs${language ? ` language-${language}` : ''}">${highlighted}</code></pre>\n`;
    },
  },
});

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Converte markdown (conteúdo do próprio app, confiável) em HTML com highlight. */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false });
}
