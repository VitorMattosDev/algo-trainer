import type { TestCase } from '../content/types';
import { compareResults } from '../lib/deepEqual';
import type { TestResult } from './types';

/** Resultado bruto de um caso, como devolvido pelo worker. */
export interface RawCaseResult {
  index: number;
  received?: unknown;
  error?: string;
}

/**
 * Combina os test cases com os resultados brutos do worker, aplicando
 * deep equal (com suporte a `unordered`) e ocultando dados de casos hidden.
 */
export function buildTestResults(tests: TestCase[], raw: RawCaseResult[]): TestResult[] {
  return tests.map((test, i) => {
    const caseResult = raw.find((r) => r.index === i);
    const visible = !test.hidden;
    const base: TestResult = { index: i, hidden: !!test.hidden, passed: false };
    if (visible) {
      base.input = test.input;
      base.expected = test.expected;
    }
    if (!caseResult) {
      base.error = 'Caso não executado.';
      return base;
    }
    if (caseResult.error !== undefined) {
      base.error = caseResult.error;
      return base;
    }
    base.passed = compareResults(test.expected, caseResult.received, test.unordered);
    if (visible) base.received = caseResult.received;
    return base;
  });
}
