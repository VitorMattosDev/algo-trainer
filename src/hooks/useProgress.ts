import { useCallback, useEffect, useState } from 'react';
import {
  EMPTY_PROGRESS,
  PROGRESS_EVENT,
  getAllProgress,
  type ExerciseProgress,
} from '../lib/progress';

/**
 * Progresso de todos os exercícios, re-lido a cada gravação
 * (evento PROGRESS_EVENT disparado por lib/progress.ts).
 */
export function useProgress(): {
  progressById: Record<string, ExerciseProgress>;
  getProgress: (id: string) => ExerciseProgress;
} {
  const [progressById, setProgressById] = useState<Record<string, ExerciseProgress>>(() =>
    getAllProgress(),
  );

  useEffect(() => {
    const reload = () => setProgressById(getAllProgress());
    window.addEventListener(PROGRESS_EVENT, reload);
    // Sincroniza também entre abas.
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, []);

  const getProgress = useCallback(
    (id: string) => progressById[id] ?? EMPTY_PROGRESS,
    [progressById],
  );

  return { progressById, getProgress };
}
