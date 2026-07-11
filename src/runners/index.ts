import type { Language } from '../content/types';
import { jsRunner } from './jsRunner';
import { pyRunner } from './pyRunner';
import { tsRunner } from './tsRunner';
import type { CodeRunner } from './types';

const runners: Record<Language, CodeRunner> = {
  typescript: tsRunner,
  javascript: jsRunner,
  python: pyRunner,
};

/** Ponto único de acesso da UI ao motor de execução. */
export function getRunner(language: Language): CodeRunner {
  return runners[language];
}

export * from './types';
