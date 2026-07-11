import { Link } from 'react-router-dom';
import { ProgressBar } from '../components/ProgressBar';
import { getExercisesByPattern } from '../content/exercises';
import { patterns } from '../content/patterns';
import { useProgress } from '../hooks/useProgress';

export function PatternsPage() {
  const { getProgress } = useProgress();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Padrões de resolução</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => {
          const exercises = getExercisesByPattern(pattern.slug);
          const solved = exercises.filter((e) => getProgress(e.id).status === 'solved').length;
          return (
            <Link
              key={pattern.slug}
              to={`/padroes/${pattern.slug}`}
              className="card block p-4 transition-colors hover:border-blue-500/50"
            >
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <h2 className="font-semibold">{pattern.name}</h2>
                <span className="whitespace-nowrap font-mono text-xs text-zinc-500">
                  {solved}/{exercises.length}
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {pattern.description}
              </p>
              {exercises.length > 0 ? (
                <ProgressBar value={solved} max={exercises.length} />
              ) : (
                <p className="text-xs italic text-zinc-400 dark:text-zinc-600">
                  Exercícios em breve — veja a cheatsheet de padrões.
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
