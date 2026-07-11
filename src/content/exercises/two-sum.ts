import type { Exercise } from '../types';

export const twoSum: Exercise = {
  id: 'two-sum',
  title: 'Two Sum',
  pattern: 'hashmap',
  difficulty: 'easy',
  functionName: 'twoSum',
  leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
  statement: `Dado um array de inteiros \`nums\` e um inteiro \`target\`, retorne **os índices dos dois números** cuja soma é igual a \`target\`.

Você pode assumir que cada entrada tem **exatamente uma solução**, e não pode usar o mesmo elemento duas vezes. Retorne os índices na ordem em que os elementos aparecem no array.

### Exemplo 1

\`\`\`
Entrada: nums = [2, 7, 11, 15], target = 9
Saída: [0, 1]
Explicação: nums[0] + nums[1] = 2 + 7 = 9
\`\`\`

### Exemplo 2

\`\`\`
Entrada: nums = [3, 2, 4], target = 6
Saída: [1, 2]
\`\`\`

### Restrições

- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- Existe exatamente uma resposta válida.

**Desafio:** consegue resolver em menos de O(n²)?`,
  hints: [
    'A força bruta testa todos os pares em O(n²). Pense: ao olhar para um número `x`, qual valor exato você precisa encontrar no resto do array?',
    'Você precisa encontrar `target - x` (o complemento). Existe alguma estrutura que responde "já vi esse valor? em qual índice?" em O(1)?',
    'Percorra o array uma única vez guardando `valor -> índice` num Map/dict. Antes de guardar o número atual, verifique se o complemento dele já está no mapa.',
  ],
  starterCode: {
    typescript: `function twoSum(nums: number[], target: number): number[] {
  // Retorne os índices dos dois números que somam target
  return [];
}
`,
    javascript: `function twoSum(nums, target) {
  // Retorne os índices dos dois números que somam target
  return [];
}
`,
    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Retorne os índices dos dois números que somam target
    return []
`,
  },
  solution: {
    typescript: `function twoSum(nums: number[], target: number): number[] {
  // Mapa: valor -> índice em que ele apareceu
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complemento = target - nums[i];
    const j = seen.get(complemento);
    // Se o complemento já foi visto, achamos o par
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return []; // nunca acontece: o enunciado garante uma solução
}
`,
    javascript: `function twoSum(nums, target) {
  // Mapa: valor -> índice em que ele apareceu
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complemento = target - nums[i];
    const j = seen.get(complemento);
    // Se o complemento já foi visto, achamos o par
    if (j !== undefined) return [j, i];
    seen.set(nums[i], i);
  }
  return []; // nunca acontece: o enunciado garante uma solução
}
`,
    python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Dicionário: valor -> índice em que ele apareceu
    seen = {}
    for i, n in enumerate(nums):
        complemento = target - n
        # Se o complemento já foi visto, achamos o par
        if complemento in seen:
            return [seen[complemento], i]
        seen[n] = i
    return []  # nunca acontece: o enunciado garante uma solução
`,
  },
  solutionExplanation: `### Abordagem: hash map de complementos

Percorremos o array uma única vez. Para cada número \`x\` no índice \`i\`, calculamos o complemento \`target - x\`. Se ele já estiver no mapa, encontramos o par; caso contrário, guardamos \`x -> i\` e seguimos.

A chave do padrão **hashmap**: trocamos a busca linear pelo par (que custaria O(n) para cada elemento) por uma consulta O(1) na estrutura de hash.

- **Tempo:** O(n) — uma passada, com operações O(1) no mapa.
- **Espaço:** O(n) — no pior caso guardamos todos os elementos no mapa.`,
  testCases: [
    { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { input: [[3, 2, 4], 6], expected: [1, 2] },
    { input: [[3, 3], 6], expected: [0, 1] },
    { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
    { input: [[1, 5, 3, 7], 10], expected: [2, 3] },
    { input: [[0, 4, 3, 0], 0], expected: [0, 3] },
    { input: [[5, 75, 25], 100], expected: [1, 2], hidden: true },
    { input: [[-3, 4, 3, 90], 0], expected: [0, 2], hidden: true },
  ],
};
