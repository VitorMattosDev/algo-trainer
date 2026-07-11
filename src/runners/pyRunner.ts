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

/**
 * Runner de Python via Pyodide (CDN oficial, versão pinada), carregado sob
 * demanda DENTRO de um Web Worker dedicado e mantido como singleton.
 *
 * Timeout: `pyodide.setInterruptBuffer` exigiria SharedArrayBuffer, que o
 * GitHub Pages não habilita (faltam headers COOP/COEP). Por isso o timeout
 * de 5 s termina o worker inteiro; a execução seguinte recarrega o runtime
 * (~10 MB), com estado de loading visível na UI. Limitação documentada no README.
 */
const PYODIDE_VERSION = '0.26.4';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
/** Guarda extra para o carregamento inicial do runtime (rede lenta). */
const RUNTIME_LOAD_TIMEOUT_MS = 120_000;

const pyWorkerSource = `
importScripts('${PYODIDE_BASE}pyodide.js');

var pyodidePromise = null;

function getPyodide() {
  if (!pyodidePromise) {
    self.postMessage({ type: 'phase', phase: 'loading-runtime' });
    pyodidePromise = self.loadPyodide({ indexURL: '${PYODIDE_BASE}' });
  }
  return pyodidePromise;
}

var RUNNER_DEF = [
  'import json',
  'import traceback',
  '',
  'def __algo_trainer_run(user_code, fn_name, tests_json):',
  '    ns = {}',
  '    try:',
  '        exec(user_code, ns)',
  '    except Exception:',
  '        return json.dumps({"error": traceback.format_exc(limit=2)})',
  '    fn = ns.get(fn_name)',
  '    if not callable(fn):',
  '        return json.dumps({"error": "Função \\'" + fn_name + "\\' não encontrada. Não renomeie a função do starter code."})',
  '    inputs = json.loads(tests_json)',
  '    results = []',
  '    for i, args in enumerate(inputs):',
  '        try:',
  '            received = fn(*json.loads(json.dumps(args)))',
  '            results.append({"index": i, "received": received})',
  '        except Exception as ex:',
  '            results.append({"index": i, "error": type(ex).__name__ + ": " + str(ex)})',
  '    try:',
  '        return json.dumps({"results": results})',
  '    except TypeError:',
  '        return json.dumps({"results": results}, default=str)',
].join('\\n');

function errorMessage(err) {
  return err && err.message ? String(err.message) : String(err);
}

self.onmessage = async function (event) {
  var data = event.data;
  try {
    var pyodide = await getPyodide();
    self.postMessage({ type: 'phase', phase: 'running' });
    pyodide.setStdout({ batched: function (text) { self.postMessage({ type: 'log', text: text }); } });
    pyodide.setStderr({ batched: function (text) { self.postMessage({ type: 'log', text: text }); } });
    if (data.mode === 'free') {
      var dictClass = pyodide.globals.get('dict');
      var ns = dictClass();
      dictClass.destroy();
      try {
        await pyodide.runPythonAsync(data.code, { globals: ns });
      } finally {
        ns.destroy();
      }
      self.postMessage({ type: 'done', results: [] });
      return;
    }
    pyodide.runPython(RUNNER_DEF);
    var runFn = pyodide.globals.get('__algo_trainer_run');
    var resultJson = runFn(data.code, data.functionName, JSON.stringify(data.tests));
    runFn.destroy();
    var parsed = JSON.parse(resultJson);
    self.postMessage({ type: 'done', results: parsed.results, error: parsed.error });
  } catch (err) {
    self.postMessage({ type: 'done', error: errorMessage(err) });
  }
};
`;

interface WorkerState {
  worker: Worker;
  url: string;
}

let state: WorkerState | null = null;
let busy = false;

function getWorker(): WorkerState {
  if (!state) {
    const blob = new Blob([pyWorkerSource], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    state = { worker: new Worker(url), url };
  }
  return state;
}

function destroyWorker(): void {
  if (state) {
    state.worker.terminate();
    URL.revokeObjectURL(state.url);
    state = null;
  }
}

interface ExecOutcome {
  status: 'ok' | 'timeout' | 'error';
  results: RawCaseResult[];
  error?: string;
}

function executeInWorker(
  payload: Record<string, unknown>,
  onLog: (text: string) => void,
  onPhase?: OnPhase,
): Promise<ExecOutcome> {
  if (busy) {
    return Promise.resolve({
      status: 'error',
      results: [],
      error: 'Já existe uma execução Python em andamento.',
    });
  }
  busy = true;
  const { worker } = getWorker();

  return new Promise((resolve) => {
    let runTimer: ReturnType<typeof setTimeout> | undefined;
    // Se o runtime nunca terminar de carregar (rede), não fica preso para sempre.
    let loadTimer: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
      destroyWorker();
      finish({ status: 'error', results: [], error: 'Falha ao carregar o runtime Python. Verifique sua conexão.' });
    }, RUNTIME_LOAD_TIMEOUT_MS);

    const finish = (outcome: ExecOutcome) => {
      clearTimeout(runTimer);
      clearTimeout(loadTimer);
      busy = false;
      resolve(outcome);
    };

    worker.onmessage = (event: MessageEvent) => {
      // `any` na fronteira do worker: dados de postMessage não são tipáveis.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = event.data as any;
      if (message.type === 'phase') {
        if (message.phase === 'running') {
          clearTimeout(loadTimer);
          loadTimer = undefined;
          // O timeout de 5 s só conta o código do usuário, não o download do runtime.
          runTimer = setTimeout(() => {
            destroyWorker();
            finish({ status: 'timeout', results: [], error: TIMEOUT_MESSAGE });
          }, EXECUTION_TIMEOUT_MS);
        }
        onPhase?.(message.phase);
      } else if (message.type === 'log') {
        onLog(String(message.text ?? ''));
      } else if (message.type === 'done') {
        finish({
          status: message.error ? 'error' : 'ok',
          results: message.results ?? [],
          error: message.error,
        });
      }
    };
    worker.onerror = (event) => {
      destroyWorker();
      finish({ status: 'error', results: [], error: event.message || 'Erro inesperado no worker Python.' });
    };
    worker.postMessage(payload);
  });
}

export const pyRunner: CodeRunner = {
  language: 'python',
  async runTests(
    code: string,
    functionName: string,
    tests: TestCase[],
    onPhase?: OnPhase,
  ): Promise<RunOutcome> {
    const logs: string[] = [];
    const exec = await executeInWorker(
      {
        mode: 'tests',
        code,
        functionName,
        // Inputs viajam como JSON; tuplas Python retornadas viram listas.
        tests: tests.map((t) => t.input),
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
  },
  async runFree(code: string, onPhase?: OnPhase): Promise<FreeRunOutcome> {
    const logs: string[] = [];
    const exec = await executeInWorker({ mode: 'free', code }, (text) => logs.push(text), onPhase);
    return { status: exec.status, logs, error: exec.error };
  },
};
