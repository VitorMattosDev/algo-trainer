/**
 * Código-fonte do Web Worker que executa JS do usuário (via Blob URL).
 * O `new Function` abaixo roda DENTRO do worker — nunca na thread principal.
 *
 * Protocolo:
 *  entrada: { mode: 'tests' | 'free', code, functionName?, tests?: { input }[] }
 *  saída:   { type: 'log', text } | { type: 'done', results?, error? }
 */
export const jsWorkerSource = String.raw`
'use strict';

function formatArg(arg) {
  if (typeof arg === 'string') return arg;
  if (arg === undefined) return 'undefined';
  try {
    var json = JSON.stringify(arg);
    return json === undefined ? String(arg) : json;
  } catch (e) {
    return String(arg);
  }
}

function log() {
  var text = Array.prototype.slice.call(arguments).map(formatArg).join(' ');
  self.postMessage({ type: 'log', text: text });
}

console.log = log;
console.info = log;
console.warn = log;
console.error = log;
console.debug = log;

function sanitize(value) {
  try {
    structuredClone(value);
    return value;
  } catch (e) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (e2) {
      return String(value);
    }
  }
}

function errorMessage(err) {
  return err && err.message ? String(err.message) : String(err);
}

self.onmessage = async function (event) {
  var data = event.data;
  // Shim de módulo CommonJS: a transpilação de TS emite "exports.f = f".
  var prelude = 'var exports = {}; var module = { exports: exports };\n';
  try {
    if (data.mode === 'free') {
      var run = new Function(prelude + data.code);
      await run();
      self.postMessage({ type: 'done', results: [] });
      return;
    }
    var factory = new Function(
      prelude +
        data.code +
        '\n;return (typeof ' +
        data.functionName +
        ' !== "undefined") ? ' +
        data.functionName +
        ' : module.exports[' +
        JSON.stringify(data.functionName) +
        '];'
    );
    var fn = factory();
    if (typeof fn !== 'function') {
      self.postMessage({
        type: 'done',
        error:
          'Função "' +
          data.functionName +
          '" não encontrada. Não renomeie a função do starter code.'
      });
      return;
    }
    var results = [];
    for (var i = 0; i < data.tests.length; i++) {
      try {
        // Clona os argumentos para que um teste não veja mutações do anterior.
        var args = structuredClone(data.tests[i].input);
        var received = await fn.apply(null, args);
        results.push({ index: i, received: sanitize(received) });
      } catch (err) {
        results.push({ index: i, error: errorMessage(err) });
      }
    }
    self.postMessage({ type: 'done', results: results });
  } catch (err) {
    self.postMessage({ type: 'done', error: errorMessage(err) });
  }
};
`;
