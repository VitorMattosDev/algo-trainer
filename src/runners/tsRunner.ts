import type { TestCase } from '../content/types';
import { runJsFree, runJsTests } from './jsRunner';
import type { CodeRunner, FreeRunOutcome, OnPhase, RunOutcome } from './types';

/**
 * Runner de TypeScript: transpila no browser com `ts.transpileModule`
 * (pacote `typescript` em chunk lazy — decisão documentada no README:
 * mais leve e mais simples que baixar o wasm do esbuild via rede) e
 * delega a execução ao worker de JavaScript.
 *
 * Observação: transpileModule remove tipos mas NÃO faz type-checking —
 * erros de tipo não são reportados, apenas erros de sintaxe/runtime.
 */
let tsModulePromise: Promise<typeof import('typescript')> | null = null;

async function loadTypescript(onPhase?: OnPhase): Promise<typeof import('typescript')> {
  if (!tsModulePromise) {
    onPhase?.('loading-runtime');
    tsModulePromise = import('typescript');
  }
  return tsModulePromise;
}

async function transpile(code: string, onPhase?: OnPhase): Promise<string> {
  const mod = await loadTypescript(onPhase);
  // Interop CJS: no build o módulo vem em `default`, nos types é o namespace.
  const ts = (mod as { default?: typeof mod }).default ?? mod;
  const output = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.CommonJS,
    },
  });
  return output.outputText;
}

export const tsRunner: CodeRunner = {
  language: 'typescript',
  async runTests(
    code: string,
    functionName: string,
    tests: TestCase[],
    onPhase?: OnPhase,
  ): Promise<RunOutcome> {
    let jsCode: string;
    try {
      jsCode = await transpile(code, onPhase);
    } catch (err) {
      return {
        status: 'error',
        results: [],
        logs: [],
        error: `Erro ao transpilar TypeScript: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
    return runJsTests(jsCode, functionName, tests, onPhase);
  },
  async runFree(code: string, onPhase?: OnPhase): Promise<FreeRunOutcome> {
    let jsCode: string;
    try {
      jsCode = await transpile(code, onPhase);
    } catch (err) {
      return {
        status: 'error',
        logs: [],
        error: `Erro ao transpilar TypeScript: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
    return runJsFree(jsCode, onPhase);
  },
};
