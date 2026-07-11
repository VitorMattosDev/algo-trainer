import { useState } from 'react';
import { MarkdownView } from './MarkdownView';

export function HintsPanel({ hints }: { hints: [string, string, string] }) {
  const [revealed, setRevealed] = useState(0);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Dicas</h3>
      {hints.slice(0, revealed).map((hint, i) => (
        <div key={i} className="card border-amber-500/30 bg-amber-500/5 p-3">
          <p className="mb-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Dica {i + 1}
          </p>
          <MarkdownView markdown={hint} />
        </div>
      ))}
      {revealed < hints.length && (
        <button type="button" className="btn-ghost" onClick={() => setRevealed((r) => r + 1)}>
          💡 Revelar dica {revealed + 1} de {hints.length}
        </button>
      )}
    </div>
  );
}
