import type { TestCase } from '../content/types';
import { buildTestResults, type RawCaseResult } from './buildResults';
import {
  EXECUTION_TIMEOUT_MS,
  TIMEOUT_MESSAGE,
  type CodeRunner,
  type FreeRunOutcome,
  type OnPhase,
  type RunOutcome,
} from './types';
import { jsWorkerSource } from './workerSource';

interface WorkerDoneMessage {
  type: 'done';
  results?: RawCaseResult[];
  error?: string;
}

interface WorkerLogMessage {
  type: 'log';
  text?: string;
}

type WorkerMessage = WorkerDoneMessage | WorkerLogMessage;

interface ExecOutcome {
  status: 'ok' | 'timeout' | 'error';
  results: RawCaseResult[];
  error?: string;
}

/**
 * Executa um payload num Web Worker novo (criado via Blob URL) com timeout
 * de 5 s. Um worker por execução: após TLE o worker é terminado e o próximo
 * run cria outro — nunca reutilizamos um worker possivelmente travado.
 */
function executeInWorker(
  payload: Record<string, unknown>,
  onLog: (text: string) => void,
  onPhase?: OnPhase,
): Promise<ExecOutcome> {
  const blob = new Blob([jsWorkerSource], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  onPhase?.('running');

  return new Promise((resolve) => {
    const finish = (outcome: ExecOutcome) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(outcome);
    };
    const timer = setTimeout(
      () => finish({ status: 'timeout', results: [], error: TIMEOUT_MESSAGE }),
      EXECUTION_TIMEOUT_MS,
    );
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.type === 'log') {
        onLog(message.text ?? '');
      } else if (message.type === 'done') {
        finish({ status: message.error ? 'error' : 'ok', results: message.results ?? [], error: message.error });
      }
    };
    worker.onerror = (event) => {
      finish({ status: 'error', results: [], error: event.message || 'Erro inesperado no worker.' });
    };
    worker.postMessage(payload);
  });
}

/** Roda test cases contra código JavaScript já transpilado. */
export async function runJsTests(
  jsCode: string,
  functionName: string,
  tests: TestCase[],
  onPhase?: OnPhase,
): Promise<RunOutcome> {
  const logs: string[] = [];
  const exec = await executeInWorker(
    {
      mode: 'tests',
      code: jsCode,
      functionName,
      // Só os inputs cruzam a fronteira do worker; comparação fica na main thread.
      tests: tests.map((t) => ({ input: t.input })),
    },
    (text) => logs.push(text),
    onPhase,
  );
  return {
    status: exec.status,
    results: exec.status === 'ok' ? buildTestResults(tests, exec.results) : [],
    logs,
    error: exec.error,
  };
}

/** Execução livre (playground) de código JavaScript. */
export async function runJsFree(jsCode: string, onPhase?: OnPhase): Promise<FreeRunOutcome> {
  const logs: string[] = [];
  const exec = await executeInWorker({ mode: 'free', code: jsCode }, (text) => logs.push(text), onPhase);
  return { status: exec.status, logs, error: exec.error };
}

/** Runner de JavaScript puro: executa direto no worker, sem transpilação. */
export const jsRunner: CodeRunner = {
  language: 'javascript',
  runTests: runJsTests,
  runFree: runJsFree,
};
