export function ConsolePanel({ logs, error }: { logs: string[]; error?: string }) {
  const empty = logs.length === 0 && !error;
  return (
    <div className="card p-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Console</h3>
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed">
        {empty && <span className="text-zinc-500">— sem saída —</span>}
        {logs.join('\n')}
        {error && (
          <>
            {logs.length > 0 && '\n'}
            <span className="text-red-500">{error}</span>
          </>
        )}
      </pre>
    </div>
  );
}
