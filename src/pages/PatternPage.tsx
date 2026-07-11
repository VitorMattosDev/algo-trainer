import { Link, useParams } from 'react-router-dom';
import { DifficultyBadge } from '../components/Badge';
import { StatusIcon } from '../components/StatusIcon';
import { getExercisesByPattern } from '../content/exercises';
import { getPattern } from '../content/patterns';
import { useProgress } from '../hooks/useProgress';

export function PatternPage() {
  const { slug } = useParams<{ slug: string }>();
  const pattern = slug ? getPattern(slug) : undefined;
  const { getProgress } = useProgress();

  if (!pattern) {
    return (
      <div>
        <p className="mb-2 text-zinc-500">Padrão não encontrado.</p>
        <Link to="/padroes" className="text-blue-500 underline">
          Ver todos os padrões
        </Link>
      </div>
    );
  }

  const exercises = getExercisesByPattern(pattern.slug);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{pattern.name}</h1>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{pattern.description}</p>

      {exercises.length === 0 ? (
        <p className="text-sm italic text-zinc-500">
          Ainda não há exercícios deste padrão — consulte a{' '}
          <Link to="/cheatsheets/padroes-de-resolucao" className="text-blue-500 underline">
            cheatsheet de padrões
          </Link>{' '}
          enquanto isso.
        </p>
      ) : (
        <ul className="space-y-2">
          {exercises.map((exercise) => {
            const progress = getProgress(exercise.id);
            return (
              <li key={exercise.id}>
                <Link
                  to={`/exercicio/${exercise.id}`}
                  className="card flex items-center gap-3 p-3 transition-colors hover:border-blue-500/50"
                >
                  <StatusIcon status={progress.status} />
                  <span className="font-medium">{exercise.title}</span>
                  <span className="ml-auto flex items-center gap-2">
                    {progress.attempts > 0 && (
                      <span className="font-mono text-xs text-zinc-500">
                        {progress.attempts} tentativa{progress.attempts > 1 ? 's' : ''}
                      </span>
                    )}
                    <DifficultyBadge difficulty={exercise.difficulty} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
