/**
 * Comparação estrutural profunda usada pelo test runner.
 * Cobre primitivos, arrays e objetos "planos" (o que test cases produzem).
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a === 'number' && typeof b === 'number') {
    // Object.is já tratou NaN; aqui só resta -0 vs 0, que consideramos iguais.
    return a === b;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(
      (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]),
    );
  }
  return false;
}

/**
 * Igualdade ignorando ordem: arrays são comparados como multiconjuntos,
 * recursivamente em todos os níveis. [[1,2],[3]] equivale a [[3],[2,1]].
 */
export function unorderedEqual(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    const remaining = [...b];
    return a.every((item) => {
      const idx = remaining.findIndex((candidate) => unorderedEqual(item, candidate));
      if (idx === -1) return false;
      remaining.splice(idx, 1);
      return true;
    });
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(
      (key) => Object.prototype.hasOwnProperty.call(b, key) && unorderedEqual(a[key], b[key]),
    );
  }
  return deepEqual(a, b);
}

/** Compara resultado de teste respeitando a flag `unordered` do test case. */
export function compareResults(expected: unknown, received: unknown, unordered?: boolean): boolean {
  return unordered ? unorderedEqual(expected, received) : deepEqual(expected, received);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
