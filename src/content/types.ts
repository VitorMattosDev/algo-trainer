export type Language = 'typescript' | 'javascript' | 'python';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TestCase {
  /** Argumentos passados à função do usuário, na ordem. */
  input: unknown[];
  /** Saída esperada, comparada via deep equal. */
  expected: unknown;
  /** Casos ocultos não exibem input/esperado/recebido na UI. */
  hidden?: boolean;
  /**
   * Quando true, arrays são comparados como multiconjuntos (ordem ignorada),
   * recursivamente em todos os níveis — ex.: 3Sum e Group Anagrams.
   */
  unordered?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  /** Slug de um dos 14 padrões fixos (ver patterns.ts). */
  pattern: string;
  difficulty: Difficulty;
  /**
   * Nome da função que o test runner chama — idêntico nas duas linguagens,
   * seguindo o padrão do LeetCode (ex.: twoSum).
   */
  functionName: string;
  leetcodeUrl?: string;
  /** Enunciado em markdown, em português brasileiro. */
  statement: string;
  /** Exatamente 3 dicas progressivas, reveladas uma a uma. */
  hints: [string, string, string];
  starterCode: Record<Language, string>;
  solution: Record<Language, string>;
  /** Explicação da abordagem + complexidade Big-O, em markdown. */
  solutionExplanation: string;
  testCases: TestCase[];
}

export interface Pattern {
  slug: string;
  name: string;
  description: string;
}
