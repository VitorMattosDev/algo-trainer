import type { Language } from '../content/types';
import { storageGet, storageSet, storageKeys } from './storage';

export type ExerciseStatus = 'untouched' | 'attempted' | 'solved';

export interface ExerciseProgress {
  status: ExerciseStatus;
  attempts: number;
  code: Partial<Record<Language, string>>;
  solvedAt?: number;
  lastTouchedAt?: number;
}

const EXERCISE_KEY_PREFIX = 'exercise:';

export const EMPTY_PROGRESS: ExerciseProgress = { status: 'untouched', attempts: 0, code: {} };

/** Evento disparado a cada gravação para que hooks re-leiam o progresso. */
export const PROGRESS_EVENT = 'algo-trainer:progress-changed';

function notifyChange(): void {
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function getExerciseProgress(id: string): ExerciseProgress {
  return storageGet<ExerciseProgress>(EXERCISE_KEY_PREFIX + id, EMPTY_PROGRESS);
}

export function getAllProgress(): Record<string, ExerciseProgress> {
  const all: Record<string, ExerciseProgress> = {};
  for (const key of storageKeys()) {
    if (key.startsWith(EXERCISE_KEY_PREFIX)) {
      all[key.slice(EXERCISE_KEY_PREFIX.length)] = storageGet<ExerciseProgress>(key, EMPTY_PROGRESS);
    }
  }
  return all;
}

function saveExerciseProgress(id: string, progress: ExerciseProgress): void {
  storageSet(EXERCISE_KEY_PREFIX + id, progress);
  notifyChange();
}

/** Registra uma tentativa de execução (Executar ou Submeter). */
export function recordAttempt(id: string): ExerciseProgress {
  const current = getExerciseProgress(id);
  const updated: ExerciseProgress = {
    ...current,
    attempts: current.attempts + 1,
    status: current.status === 'solved' ? 'solved' : 'attempted',
    lastTouchedAt: Date.now(),
  };
  saveExerciseProgress(id, updated);
  return updated;
}

/** Marca como resolvido (todos os testes do Submeter passaram). */
export function markSolved(id: string): ExerciseProgress {
  const current = getExerciseProgress(id);
  const updated: ExerciseProgress = {
    ...current,
    status: 'solved',
    solvedAt: current.solvedAt ?? Date.now(),
    lastTouchedAt: Date.now(),
  };
  saveExerciseProgress(id, updated);
  return updated;
}

/** Persiste o código digitado, por exercício e por linguagem. */
export function saveCode(id: string, language: Language, code: string): void {
  const current = getExerciseProgress(id);
  saveExerciseProgress(id, {
    ...current,
    code: { ...current.code, [language]: code },
    lastTouchedAt: Date.now(),
  });
}
