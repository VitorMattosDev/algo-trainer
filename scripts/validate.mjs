/**
 * Valida as soluções oficiais em TypeScript e JavaScript: transpila cada
 * exercício e sua solução com o pacote `typescript` e roda todos os test
 * cases via Node. Uso: node scripts/validate.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exercisesDir = path.join(root, 'src', 'content', 'exercises');

function transpile(code) {
  return ts.transpileModule(code, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  }).outputText;
}

/** Avalia um módulo TS transpilado e devolve seu objeto `exports`. */
function evalModule(tsCode, filename) {
  const js = transpile(tsCode);
  const module = { exports: {} };
  const context = { module, exports: module.exports, console, structuredClone };
  vm.runInNewContext(js, context, { filename });
  return module.exports;
}

// Reaproveita o deepEqual real do app para comparar resultados.
const deepEqualSource = readFileSync(path.join(root, 'src', 'lib', 'deepEqual.ts'), 'utf8');
const { compareResults } = evalModule(deepEqualSource, 'deepEqual.ts');

const files = readdirSync(exercisesDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
let failures = 0;

for (const file of files) {
  const source = readFileSync(path.join(exercisesDir, file), 'utf8');
  const moduleExports = evalModule(source, file);
  const exercise = Object.values(moduleExports)[0];
  if (!exercise || !exercise.id) {
    console.error(`✖ ${file}: não exporta um objeto Exercise`);
    failures++;
    continue;
  }

  for (const [language, tag] of [
    ['typescript', 'TS'],
    ['javascript', 'JS'],
  ]) {
    const source = exercise.solution[language];
    if (!source) {
      console.error(`✖ ${exercise.id}: sem solução ${tag}`);
      failures++;
      continue;
    }
    const solutionExports = evalModule(
      source + `\n;module.exports.__fn = typeof ${exercise.functionName} !== 'undefined' ? ${exercise.functionName} : exports['${exercise.functionName}'];`,
      `${exercise.id}-solution-${language}.ts`,
    );
    const fn = solutionExports.__fn;
    if (typeof fn !== 'function') {
      console.error(`✖ ${exercise.id}: função ${exercise.functionName} não encontrada na solução ${tag}`);
      failures++;
      continue;
    }

    let allPassed = true;
    exercise.testCases.forEach((test, i) => {
      let received;
      try {
        received = fn(...structuredClone(test.input));
      } catch (err) {
        console.error(`✖ ${exercise.id} [${tag}] caso ${i + 1}: exceção ${err.message}`);
        allPassed = false;
        failures++;
        return;
      }
      if (!compareResults(test.expected, received, test.unordered)) {
        console.error(
          `✖ ${exercise.id} [${tag}] caso ${i + 1}: esperado ${JSON.stringify(test.expected)}, recebido ${JSON.stringify(received)}`,
        );
        allPassed = false;
        failures++;
      }
    });
    if (allPassed) {
      console.log(`✔ ${exercise.id} [${tag}] ${exercise.testCases.length} casos OK`);
    }
  }
}

if (failures > 0) {
  console.error(`\nFalhas: ${failures}`);
  process.exit(1);
}
console.log('\nTodas as soluções TypeScript e JavaScript passaram.');
