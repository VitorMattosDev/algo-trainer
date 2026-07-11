import { useRef, useState } from 'react';
import { PROGRESS_EVENT } from '../lib/progress';
import { clearAllData, exportAllData, importAllData } from '../lib/storage';

export function SettingsPage() {
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const blob = new Blob([exportAllData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `algo-trainer-progresso-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage({ kind: 'ok', text: 'Progresso exportado.' });
  };

  const handleImport = async (file: File) => {
    try {
      importAllData(await file.text());
      window.dispatchEvent(new Event(PROGRESS_EVENT));
      setMessage({ kind: 'ok', text: 'Progresso importado com sucesso.' });
    } catch (err) {
      setMessage({
        kind: 'error',
        text: err instanceof Error ? err.message : 'Falha ao importar o arquivo.',
      });
    }
  };

  const handleClear = () => {
    if (window.confirm('Apagar TODO o progresso salvo? Esta ação não pode ser desfeita.')) {
      clearAllData();
      window.dispatchEvent(new Event(PROGRESS_EVENT));
      setMessage({ kind: 'ok', text: 'Progresso apagado.' });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <section className="card space-y-3 p-4">
        <h2 className="font-semibold">Progresso</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Todo o progresso fica no localStorage deste navegador. Use exportar/importar para migrar
          de máquina.
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={handleExport}>
            ⬇ Exportar progresso (JSON)
          </button>
          <button type="button" className="btn-ghost" onClick={() => fileInput.current?.click()}>
            ⬆ Importar progresso
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImport(file);
              e.target.value = '';
            }}
          />
        </div>
      </section>

      <section className="card space-y-3 border-red-500/30 p-4">
        <h2 className="font-semibold text-red-500">Zona de perigo</h2>
        <button type="button" className="btn bg-red-600 text-white hover:bg-red-500" onClick={handleClear}>
          Apagar todo o progresso
        </button>
      </section>

      {message && (
        <p
          className={`text-sm font-medium ${
            message.kind === 'ok' ? 'text-emerald-500' : 'text-red-500'
          }`}
          role="status"
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
