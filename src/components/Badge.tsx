import { Link } from 'react-router-dom';
import type { Difficulty } from '../content/types';
import { getPattern } from '../content/patterns';

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  hard: 'bg-red-500/15 text-red-600 dark:text-red-400',
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${difficultyStyles[difficulty]}`}
    >
      {difficultyLabels[difficulty]}
    </span>
  );
}

export function PatternBadge({ slug }: { slug: string }) {
  const pattern = getPattern(slug);
  return (
    <Link
      to={`/padroes/${slug}`}
      className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-semibold text-blue-600 hover:bg-blue-500/25 dark:text-blue-400"
    >
      {pattern?.name ?? slug}
    </Link>
  );
}
