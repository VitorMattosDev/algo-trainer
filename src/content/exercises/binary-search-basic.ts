import type { Exercise } from '../types';

export const binarySearchBasic: Exercise = {
  id: 'binary-search',
  title: 'Binary Search',
  pattern: 'binary-search',
  difficulty: 'easy',
  functionName: 'search',
  leetcodeUrl: 'https://leetcode.com/problems/binary-search/',
  statement: `Dado um array de inteiros \`nums\` **ordenado em ordem crescente** e um inteiro \`target\`, retorne o **índice** de \`target\` em \`nums\`. Se ele não existir, retorne \`-1\`.

Seu algoritmo deve rodar em **O(log n)**.

### Exemplo 1

\`\`\`
Entrada: nums = [-1, 0, 3, 5, 9, 12], target = 9
Saída: 4
\`\`\`

### Exemplo 2

\`\`\`
Entrada: nums = [-1, 0, 3, 5, 9, 12], target = 2
Saída: -1
\`\`\`

### Restrições

- \`1 <= nums.length <= 10^4\`
- Todos os elementos de \`nums\` são **distintos**.`,
  hints: [
    'O array está ordenado. Olhando para o elemento do meio, o que você descobre sobre onde o target PODE estar?',
    'Se o meio é menor que o target, o target só pode estar à direita; se é maior, só à esquerda. Descarte metade a cada passo com dois limites `esq` e `dir`.',
    'Cuidado com a condição de parada: use `while esq <= dir` (com `<=`, para não pular o caso de um único elemento) e atualize os limites com `meio + 1` / `meio - 1`.',
  ],
  starterCode: {
    typescript: `function search(nums: number[], target: number): number {
  // Retorne o índice de target ou -1, em O(log n)
  return -1;
}
`,
    javascript: `function search(nums, target) {
  // Retorne o índice de target ou -1, em O(log n)
  return -1;
}
`,
    python: `def search(nums: list[int], target: int) -> int:
    # Retorne o índice de target ou -1, em O(log n)
    return -1
`,
  },
  solution: {
    typescript: `function search(nums: number[], target: number): number {
  let esq = 0;
  let dir = nums.length - 1;
  // Invariante: se target existe, está em [esq, dir]
  while (esq <= dir) {
    const meio = esq + Math.floor((dir - esq) / 2);
    if (nums[meio] === target) return meio;
    if (nums[meio] < target) {
      esq = meio + 1; // target só pode estar à direita
    } else {
      dir = meio - 1; // target só pode estar à esquerda
    }
  }
  return -1;
}
`,
    javascript: `function search(nums, target) {
  let esq = 0;
  let dir = nums.length - 1;
  // Invariante: se target existe, está em [esq, dir]
  while (esq <= dir) {
    const meio = esq + Math.floor((dir - esq) / 2);
    if (nums[meio] === target) return meio;
    if (nums[meio] < target) {
      esq = meio + 1; // target só pode estar à direita
    } else {
      dir = meio - 1; // target só pode estar à esquerda
    }
  }
  return -1;
}
`,
    python: `def search(nums: list[int], target: int) -> int:
    esq, dir = 0, len(nums) - 1
    # Invariante: se target existe, está em [esq, dir]
    while esq <= dir:
        meio = (esq + dir) // 2
        if nums[meio] == target:
            return meio
        if nums[meio] < target:
            esq = meio + 1  # target só pode estar à direita
        else:
            dir = meio - 1  # target só pode estar à esquerda
    return -1
`,
  },
  solutionExplanation: `### Abordagem: busca binária clássica

Mantemos o intervalo \`[esq, dir]\` onde o target ainda pode estar. A cada passo comparamos com o elemento do meio: igual → achamos; menor que o target → descartamos a metade esquerda; maior → descartamos a direita. O intervalo cai pela metade a cada iteração.

Detalhes que evitam bugs clássicos: laço \`while esq <= dir\` (intervalo fechado), atualização com \`meio ± 1\` (senão loop infinito) e, em linguagens com inteiros de tamanho fixo, calcular o meio como \`esq + (dir - esq) / 2\` para evitar overflow.

- **Tempo:** O(log n).
- **Espaço:** O(1).`,
  testCases: [
    { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    { input: [[5], 5], expected: 0 },
    { input: [[5], -5], expected: -1 },
    { input: [[1, 3], 3], expected: 1 },
    { input: [[2, 4, 6, 8, 10, 12, 14], 14], expected: 6 },
    { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1], expected: 0, hidden: true },
    { input: [[-10, -3, 0, 5, 9], -3], expected: 1, hidden: true },
  ],
};
