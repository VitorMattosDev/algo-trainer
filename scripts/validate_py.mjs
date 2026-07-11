/**
 * Valida as soluções oficiais em Python: gera um script temporário por
 * exercício (solução + runner) e o executa com o Python local, comparando
 * os resultados no Node com o mesmo deepEqual do app.
 * Uso: node scripts/validate_py.mjs
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exercisesDir = path.join(root, 'src', 'content', 'exercises');
const tmpDir = path.join(root, 'scripts', '.tmp');

function evalModule(tsCode, filename) {
  const js = ts.transpileModule(tsCode, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(js, { module, exports: module.exports, console, structuredClone }, { filename });
  return module.exports;
}

const deepEqualSource = readFileSync(path.join(root, 'src', 'lib', 'deepEqual.ts'), 'utf8');
const { compareResults } = evalModule(deepEqualSource, 'deepEqual.ts');

const pythonCmd = process.env.PYTHON ?? 'python';
mkdirSync(tmpDir, { recursive: true });

const files = readdirSync(exercisesDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
let failures = 0;

for (const file of files) {
  const source = readFileSync(path.join(exercisesDir, file), 'utf8');
  const exercise = Object.values(evalModule(source, file))[0];

  const runner = [
    exercise.solution.python,
    '',
    'if __name__ == "__main__":',
    '    import json as __json',
    '    import sys as __sys',
    '    __tests = __json.loads(__sys.stdin.read())',
    `    __out = [${exercise.functionName}(*__args) for __args in __tests]`,
    '    print(__json.dumps(__out))',
    '',
  ].join('\n');

  const scriptPath = path.join(tmpDir, `${exercise.id}.py`);
  writeFileSync(scriptPath, runner, 'utf8');

  const proc = spawnSync(pythonCmd, [scriptPath], {
    input: JSON.stringify(exercise.testCases.map((t) => t.input)),
    encoding: 'utf8',
  });
  if (proc.status !== 0) {
    console.error(`✖ ${exercise.id} [PY]: script falhou\n${proc.stderr}`);
    failures++;
    continue;
  }

  let receivedList;
  try {
    receivedList = JSON.parse(proc.stdout);
  } catch {
    console.error(`✖ ${exercise.id} [PY]: saída não é JSON: ${proc.stdout}`);
    failures++;
    continue;
  }

  let allPassed = true;
  exercise.testCases.forEach((test, i) => {
    if (!compareResults(test.expected, receivedList[i], test.unordered)) {
      console.error(
        `✖ ${exercise.id} [PY] caso ${i + 1}: esperado ${JSON.stringify(test.expected)}, recebido ${JSON.stringify(receivedList[i])}`,
      );
      allPassed = false;
      failures++;
    }
  });
  if (allPassed) {
    console.log(`✔ ${exercise.id} [PY] ${exercise.testCases.length} casos OK`);
  }
}

rmSync(tmpDir, { recursive: true, force: true });

if (failures > 0) {
  console.error(`\nFalhas: ${failures}`);
  process.exit(1);
}
console.log('\nTodas as soluções Python passaram.');
