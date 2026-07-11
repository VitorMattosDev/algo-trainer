import type { Language, TestCase } from '../content/types';

export interface TestResult {
  index: number;
  hidden: boolean;
  passed: boolean;
  /** Ausentes em casos hidden (a UI mostra só ✅/❌). */
  input?: unknown[];
  expected?: unknown;
  received?: unknown;
  /** Mensagem de erro de runtime daquele caso, se houver. */
  error?: string;
}

export type RunStatus = 'ok' | 'timeout' | 'error';

export interface RunOutcome {
  status: RunStatus;
  results: TestResult[];
  logs: string[];
  /** Erro global (sintaxe, função não encontrada, etc.). */
  error?: string;
}

export interface FreeRunOutcome {
  status: RunStatus;
  logs: string[];
  error?: string;
}

/** Estados intermediários reportados à UI durante uma execução. */
export type RunnerPhase = 'loading-runtime' | 'running';

export type OnPhase = (phase: RunnerPhase) => void;

/**
 * Abstração comum de execução de código. A UI depende apenas desta
 * interface — adicionar uma linguagem (ex.: Go) é criar outra implementação.
 */
export interface CodeRunner {
  language: Language;
  /** Roda os test cases contra a função `functionName` definida em `code`. */
  runTests(
    code: string,
    functionName: string,
    tests: TestCase[],
    onPhase?: OnPhase,
  ): Promise<RunOutcome>;
  /** Execução livre (playground): roda o código e captura a saída. */
  runFree(code: string, onPhase?: OnPhase): Promise<FreeRunOutcome>;
}

/** Limite de execução por run — estourou, o worker é terminado. */
export const EXECUTION_TIMEOUT_MS = 5000;

export const TIMEOUT_MESSAGE = 'Time Limit Exceeded — execução excedeu 5 segundos.';
