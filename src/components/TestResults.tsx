import type { RunOutcome } from '../runners/types';

function formatValue(value: unknown): string {
  if (value === undefined) return 'undefined';
  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
}

export function TestResults({ outcome }: { outcome: RunOutcome }) {
  if (outcome.status === 'timeout') {
    return (
      <div className="card border-red-500/40 p-3 text-sm font-semibold text-red-500">
        ⏱ {outcome.error ?? 'Time Limit Exceeded'}
      </div>
    );
  }
  if (outcome.status === 'error') {
    return (
      <div className="card border-red-500/40 p-3">
        <p className="mb-1 text-sm font-semibold text-red-500">Erro de execução</p>
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-red-400">
          {outcome.error}
        </pre>
      </div>
    );
  }

  const passed = outcome.results.filter((r) => r.passed).length;
  const total = outcome.results.length;

  return (
    <div className="card p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Testes: {passed}/{total} passaram
      </h3>
      <ul className="space-y-2">
        {outcome.results.map((result) => (
          <li
            key={result.index}
            className={`rounded-md border p-2 font-mono text-xs ${
              result.passed
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            <div className="flex items-center gap-2 font-sans font-semibold">
              <span>{result.passed ? '✅' : '❌'}</span>
              <span>
                Caso {result.index + 1}
                {result.hidden && ' (oculto)'}
              </span>
            </div>
            {!result.hidden && (
              <div className="mt-1 space-y-0.5 text-zinc-600 dark:text-zinc-400">
                <p className="break-all">
                  <span className="text-zinc-500">entrada:</span>{' '}
                  {(result.input ?? []).map(formatValue).join(', ')}
                </p>
                <p className="break-all">
                  <span className="text-zinc-500">esperado:</span> {formatValue(result.expected)}
                </p>
                {!result.passed && result.error === undefined && (
                  <p className="break-all">
                    <span className="text-zinc-500">recebido:</span> {formatValue(result.received)}
                  </p>
                )}
              </div>
            )}
            {result.error !== undefined && (
              <p className="mt-1 break-all text-red-400">{result.error}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
