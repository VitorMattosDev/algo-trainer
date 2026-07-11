import { Link } from 'react-router-dom';
import { DifficultyBadge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { StatusIcon } from '../components/StatusIcon';
import { exercises, getExercise } from '../content/exercises';
import { patterns } from '../content/patterns';
import type { Difficulty } from '../content/types';
import { useProgress } from '../hooks/useProgress';

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export function Dashboard() {
  const { progressById, getProgress } = useProgress();

  const solvedTotal = exercises.filter((e) => getProgress(e.id).status === 'solved').length;

  const recent = Object.entries(progressById)
    .filter(([id, p]) => p.lastTouchedAt !== undefined && getExercise(id))
    .sort(([, a], [, b]) => (b.lastTouchedAt ?? 0) - (a.lastTouchedAt ?? 0))
    .slice(0, 5);

  const continueId = recent.find(([, p]) => p.status === 'attempted')?.[0] ?? recent[0]?.[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {continueId && (
          <Link to={`/exercicio/${continueId}`} className="btn-primary ml-auto">
            ⏵ Continuar de onde parei
          </Link>
        )}
      </div>

      {/* Resumo geral */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">Resolvidos</p>
          <p className="mt-1 font-mono text-3xl font-bold">
            {solvedTotal}
            <span className="text-base font-normal text-zinc-500">/{exercises.length}</span>
          </p>
          <div className="mt-2">
            <ProgressBar value={solvedTotal} max={exercises.length} />
          </div>
        </div>
        {difficulties.map((difficulty) => {
          const all = exercises.filter((e) => e.difficulty === difficulty);
          const solved = all.filter((e) => getProgress(e.id).status === 'solved').length;
          return (
            <div key={difficulty} className="card p-4">
              <DifficultyBadge difficulty={difficulty} />
              <p className="mt-1 font-mono text-3xl font-bold">
                {solved}
                <span className="text-base font-normal text-zinc-500">/{all.length}</span>
              </p>
              <div className="mt-2">
                <ProgressBar value={solved} max={all.length} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Progresso por padrão */}
        <section>
          <h2 className="mb-2 text-lg font-semibold">Progresso por padrão</h2>
          <div className="card divide-y divide-zinc-200 dark:divide-zinc-800">
            {patterns
              .map((pattern) => {
                const all = exercises.filter((e) => e.pattern === pattern.slug);
                const solved = all.filter((e) => getProgress(e.id).status === 'solved').length;
                return { pattern, all, solved };
              })
              .filter(({ all }) => all.length > 0)
              .map(({ pattern, all, solved }) => (
                <Link
                  key={pattern.slug}
                  to={`/padroes/${pattern.slug}`}
                  className="flex items-center gap-3 p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <span className="w-40 truncate text-sm font-medium">{pattern.name}</span>
                  <div className="flex-1">
                    <ProgressBar value={solved} max={all.length} />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-zinc-500">
                    {solved}/{all.length}
                  </span>
                </Link>
              ))}
          </div>
        </section>

        {/* Últimos exercícios tentados */}
        <section>
          <h2 className="mb-2 text-lg font-semibold">Últimos exercícios</h2>
          {recent.length === 0 ? (
            <div className="card p-4 text-sm text-zinc-500">
              Nenhuma atividade ainda.{' '}
              <Link to="/padroes" className="text-blue-500 underline">
                Escolha um padrão
              </Link>{' '}
              para começar!
            </div>
          ) : (
            <div className="card divide-y divide-zinc-200 dark:divide-zinc-800">
              {recent.map(([id, progress]) => {
                const exercise = getExercise(id)!;
                return (
                  <Link
                    key={id}
                    to={`/exercicio/${id}`}
                    className="flex items-center gap-3 p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <StatusIcon status={progress.status} />
                    <span className="text-sm font-medium">{exercise.title}</span>
                    <span className="ml-auto">
                      <DifficultyBadge difficulty={exercise.difficulty} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
