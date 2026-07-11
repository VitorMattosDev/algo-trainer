import Editor from '@monaco-editor/react';
import { useCallback, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CelebrationToast } from '../components/CelebrationToast';
import { ConsolePanel } from '../components/ConsolePanel';
import { DifficultyBadge, PatternBadge } from '../components/Badge';
import { HintsPanel } from '../components/HintsPanel';
import { LanguageSelect } from '../components/LanguageSelect';
import { MarkdownView } from '../components/MarkdownView';
import { TestResults } from '../components/TestResults';
import { getExercise } from '../content/exercises';
import type { Exercise, Language } from '../content/types';
import { useIsDark } from '../hooks/useTheme';
import { getExerciseProgress, markSolved, recordAttempt, saveCode } from '../lib/progress';
import { getRunner } from '../runners';
import type { RunOutcome, RunnerPhase } from '../runners/types';

export function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const exercise = id ? getExercise(id) : undefined;

  if (!exercise) {
    return (
      <div>
        <p className="mb-2 text-zinc-500">Exercício não encontrado.</p>
        <Link to="/padroes" className="text-blue-500 underline">
          Ver todos os padrões
        </Link>
      </div>
    );
  }

  // key força remontagem (e re-leitura do progresso) ao navegar entre exercícios.
  return <ExerciseView key={exercise.id} exercise={exercise} />;
}

const phaseLabels: Record<RunnerPhase, Record<Language, string>> = {
  'loading-runtime': {
    python: 'Carregando runtime Python (~10 MB)...',
    typescript: 'Carregando compilador TypeScript...',
    javascript: 'Preparando execução...',
  },
  running: {
    python: 'Executando...',
    typescript: 'Executando...',
    javascript: 'Executando...',
  },
};

function ExerciseView({ exercise }: { exercise: Exercise }) {
  const isDark = useIsDark();
  const [language, setLanguage] = useState<Language>('typescript');
  const [codeByLang, setCodeByLang] = useState<Record<Language, string>>(() => {
    const saved = getExerciseProgress(exercise.id).code;
    return {
      typescript: saved.typescript ?? exercise.starterCode.typescript,
      javascript: saved.javascript ?? exercise.starterCode.javascript,
      python: saved.python ?? exercise.starterCode.python,
    };
  });
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<RunnerPhase | null>(null);
  const [attempts, setAttempts] = useState(() => getExerciseProgress(exercise.id).attempts);
  const [solved, setSolved] = useState(() => getExerciseProgress(exercise.id).status === 'solved');
  const [showSolution, setShowSolution] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const code = codeByLang[language];

  const handleCodeChange = (value: string | undefined) => {
    const next = value ?? '';
    setCodeByLang((prev) => ({ ...prev, [language]: next }));
    // Debounce para não gravar no localStorage a cada tecla.
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveCode(exercise.id, language, next), 500);
  };

  const resetCode = () => {
    const starter = exercise.starterCode[language];
    setCodeByLang((prev) => ({ ...prev, [language]: starter }));
    saveCode(exercise.id, language, starter);
  };

  const run = async (includeHidden: boolean) => {
    if (running) return;
    setRunning(true);
    setOutcome(null);
    const updated = recordAttempt(exercise.id);
    setAttempts(updated.attempts);
    const tests = includeHidden
      ? exercise.testCases
      : exercise.testCases.filter((t) => !t.hidden);
    const runner = getRunner(language);
    const result = await runner.runTests(code, exercise.functionName, tests, setPhase);
    setOutcome(result);
    setPhase(null);
    setRunning(false);
    if (includeHidden && result.status === 'ok' && result.results.every((r) => r.passed)) {
      markSolved(exercise.id);
      setSolved(true);
      setCelebrate(true);
      setShowSolution(true);
    }
  };

  const onCelebrationDone = useCallback(() => setCelebrate(false), []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Coluna esquerda: enunciado */}
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{exercise.title}</h1>
            {solved && <span title="Resolvido">✅</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={exercise.difficulty} />
            <PatternBadge slug={exercise.pattern} />
            {exercise.leetcodeUrl && (
              <a
                href={exercise.leetcodeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 underline"
              >
                Ver no LeetCode ↗
              </a>
            )}
          </div>
        </div>

        <div className="card p-4">
          <MarkdownView markdown={exercise.statement} />
        </div>

        <HintsPanel hints={exercise.hints} />

        <div>
          <button
            type="button"
            className="btn-ghost"
            disabled={attempts === 0}
            title={attempts === 0 ? 'Execute o código pelo menos uma vez para liberar' : undefined}
            onClick={() => setShowSolution((s) => !s)}
          >
            {showSolution ? 'Esconder solução' : 'Ver solução'}
          </button>
        </div>

        {showSolution && (
          <div className="card space-y-3 p-4">
            <h2 className="text-lg font-bold">Solução</h2>
            <MarkdownView
              markdown={'```' + language + '\n' + exercise.solution[language] + '\n```'}
            />
            <MarkdownView markdown={exercise.solutionExplanation} />
          </div>
        )}
      </div>

      {/* Coluna direita: editor + testes */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <LanguageSelect value={language} onChange={setLanguage} disabled={running} />
          <button type="button" className="btn-ghost ml-auto" onClick={resetCode} disabled={running}>
            Restaurar starter
          </button>
        </div>

        <div className="card overflow-hidden">
          <Editor
            height="52vh"
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

        <div className="flex items-center gap-2">
          <button type="button" className="btn-primary" onClick={() => run(false)} disabled={running}>
            ▶ Executar
          </button>
          <button type="button" className="btn-success" onClick={() => run(true)} disabled={running}>
            ✓ Submeter
          </button>
          {phase && (
            <span className="text-xs text-zinc-500">{phaseLabels[phase][language]}</span>
          )}
        </div>

        {outcome && <TestResults outcome={outcome} />}
        {outcome && <ConsolePanel logs={outcome.logs} />}
      </div>

      <CelebrationToast show={celebrate} onDone={onCelebrationDone} />
    </div>
  );
}
