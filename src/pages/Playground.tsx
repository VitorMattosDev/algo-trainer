import Editor from '@monaco-editor/react';
import { useRef, useState } from 'react';
import { ConsolePanel } from '../components/ConsolePanel';
import { LanguageSelect } from '../components/LanguageSelect';
import type { Language } from '../content/types';
import { useIsDark } from '../hooks/useTheme';
import { storageGet, storageSet } from '../lib/storage';
import { getRunner } from '../runners';
import type { FreeRunOutcome, RunnerPhase } from '../runners/types';

const defaultSnippets: Record<Language, string> = {
  typescript: `// Playground TypeScript — o console.log aparece no painel abaixo.

const nums = [5, 3, 8, 1];
const sorted = [...nums].sort((a, b) => a - b);
console.log('ordenado:', sorted);
`,
  javascript: `// Playground JavaScript — o console.log aparece no painel abaixo.

const frequencias = {};
for (const c of 'banana') {
  frequencias[c] = (frequencias[c] ?? 0) + 1;
}
console.log(frequencias);
`,
  python: `# Playground Python — o print aparece no painel abaixo.
from collections import Counter

print(Counter("banana"))
`,
};

const phaseLabels: Record<RunnerPhase, Record<Language, string>> = {
  'loading-runtime': {
    python: 'Carregando runtime Python (~10 MB)...',
    typescript: 'Carregando compilador TypeScript...',
    javascript: 'Preparando execução...',
  },
  running: { python: 'Executando...', typescript: 'Executando...', javascript: 'Executando...' },
};

export function Playground() {
  const isDark = useIsDark();
  const [language, setLanguage] = useState<Language>('typescript');
  const [codeByLang, setCodeByLang] = useState<Record<Language, string>>(() => ({
    typescript: storageGet('playground:typescript', defaultSnippets.typescript),
    javascript: storageGet('playground:javascript', defaultSnippets.javascript),
    python: storageGet('playground:python', defaultSnippets.python),
  }));
  const [outcome, setOutcome] = useState<FreeRunOutcome | null>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<RunnerPhase | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const code = codeByLang[language];

  const handleCodeChange = (value: string | undefined) => {
    const next = value ?? '';
    setCodeByLang((prev) => ({ ...prev, [language]: next }));
    clearTimeout(saveTimer.current);
    const key = `playground:${language}`;
    saveTimer.current = setTimeout(() => storageSet(key, next), 500);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setOutcome(null);
    const result = await getRunner(language).runFree(code, setPhase);
    setOutcome(result);
    setPhase(null);
    setRunning(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold">Playground</h1>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSelect value={language} onChange={setLanguage} disabled={running} />
          <button type="button" className="btn-primary" onClick={run} disabled={running}>
            ▶ Executar
          </button>
        </div>
      </div>
      {phase && <p className="text-xs text-zinc-500">{phaseLabels[phase][language]}</p>}

      <div className="card overflow-hidden">
        <Editor
          height="55vh"
          language={language}
          theme={isDark ? 'vs-dark' : 'light'}
          value={code}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: '"JetBrains Mono", monospace',
            scrollBeyondLastLine: false,
            tabSize: language === 'python' ? 4 : 2,
          }}
        />
      </div>

      <ConsolePanel
        logs={outcome?.logs ?? []}
        error={outcome?.status !== 'ok' ? outcome?.error : undefined}
      />
    </div>
  );
}
