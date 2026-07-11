import type { Exercise } from '../types';

export const searchInRotatedSortedArray: Exercise = {
  id: 'search-in-rotated-sorted-array',
  title: 'Search in Rotated Sorted Array',
  pattern: 'binary-search',
  difficulty: 'medium',
  functionName: 'search',
  leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
  statement: `Um array ordenado crescente (com valores **distintos**) foi **rotacionado** num índice desconhecido. Por exemplo, \`[0, 1, 2, 4, 5, 6, 7]\` rotacionado no índice 3 vira \`[4, 5, 6, 7, 0, 1, 2]\`.

Dado o array rotacionado \`nums\` e um inteiro \`target\`, retorne o **índice** de \`target\` (ou \`-1\` se não existir).

Seu algoritmo deve rodar em **O(log n)**.

### Exemplo 1

\`\`\`
Entrada: nums = [4, 5, 6, 7, 0, 1, 2], target = 0
Saída: 4
\`\`\`

### Exemplo 2

\`\`\`
Entrada: nums = [4, 5, 6, 7, 0, 1, 2], target = 3
Saída: -1
\`\`\`

### Restrições

- \`1 <= nums.length <= 5000\`
- Todos os valores de \`nums\` são distintos.
- \`nums\` foi rotacionado num pivô desconhecido (possivelmente 0).`,
  hints: [
    'O(log n) pede busca binária — mas o array não está totalmente ordenado. O que ainda é verdade sobre as duas metades ao cortar no meio?',
    'Ao dividir um array rotacionado no meio, **pelo menos uma das metades está ordenada**. Compare `nums[esq]` com `nums[meio]` para descobrir qual.',
    'Identifique a metade ordenada e verifique se o target está dentro do intervalo dela: se sim, busque nela; senão, busque na outra. Repita.',
  ],
  starterCode: {
    typescript: `function search(nums: number[], target: number): number {
  // Retorne o índice de target no array rotacionado, ou -1
  return -1;
}
`,
    javascript: `function search(nums, target) {
  // Retorne o índice de target no array rotacionado, ou -1
  return -1;
}
`,
    python: `def search(nums: list[int], target: int) -> int:
    # Retorne o índice de target no array rotacionado, ou -1
    return -1
`,
  },
  solution: {
    typescript: `function search(nums: number[], target: number): number {
  let esq = 0;
  let dir = nums.length - 1;
  while (esq <= dir) {
    const meio = esq + Math.floor((dir - esq) / 2);
    if (nums[meio] === target) return meio;
    if (nums[esq] <= nums[meio]) {
      // Metade esquerda [esq, meio] está ordenada
      if (nums[esq] <= target && target < nums[meio]) {
        dir = meio - 1; // target dentro da metade ordenada
      } else {
        esq = meio + 1; // target só pode estar na outra metade
      }
    } else {
      // Metade direita [meio, dir] está ordenada
      if (nums[meio] < target && target <= nums[dir]) {
        esq = meio + 1; // target dentro da metade ordenada
      } else {
        dir = meio - 1; // target só pode estar na outra metade
      }
    }
  }
  return -1;
}
`,
    javascript: `function search(nums, target) {
  let esq = 0;
  let dir = nums.length - 1;
  while (esq <= dir) {
    const meio = esq + Math.floor((dir - esq) / 2);
    if (nums[meio] === target) return meio;
    if (nums[esq] <= nums[meio]) {
      // Metade esquerda [esq, meio] está ordenada
      if (nums[esq] <= target && target < nums[meio]) {
        dir = meio - 1; // target dentro da metade ordenada
      } else {
        esq = meio + 1; // target só pode estar na outra metade
      }
    } else {
      // Metade direita [meio, dir] está ordenada
      if (nums[meio] < target && target <= nums[dir]) {
        esq = meio + 1; // target dentro da metade ordenada
      } else {
        dir = meio - 1; // target só pode estar na outra metade
      }
    }
  }
  return -1;
}
`,
    python: `def search(nums: list[int], target: int) -> int:
    esq, dir = 0, len(nums) - 1
    while esq <= dir:
        meio = (esq + dir) // 2
        if nums[meio] == target:
            return meio
        if nums[esq] <= nums[meio]:
            # Metade esquerda [esq, meio] está ordenada
            if nums[esq] <= target < nums[meio]:
                dir = meio - 1  # target dentro da metade ordenada
            else:
                esq = meio + 1  # target só pode estar na outra metade
        else:
            # Metade direita [meio, dir] está ordenada
            if nums[meio] < target <= nums[dir]:
                esq = meio + 1  # target dentro da metade ordenada
            else:
                dir = meio - 1  # target só pode estar na outra metade
    return -1
`,
  },
  solutionExplanation: `### Abordagem: busca binária com detecção da metade ordenada

A rotação quebra a ordenação global, mas ao cortar no meio **uma das metades sempre fica ordenada**:

1. Se \`nums[esq] <= nums[meio]\`, a metade esquerda é ordenada; senão, é a direita.
2. Na metade ordenada conseguimos testar em O(1) se o target está no intervalo dela (\`nums[esq] <= target < nums[meio]\`, por exemplo).
3. Se estiver, continuamos nela; caso contrário, o target só pode estar na outra metade.

Assim descartamos metade do array a cada passo, preservando o O(log n) mesmo com a rotação.

- **Tempo:** O(log n).
- **Espaço:** O(1).`,
  testCases: [
    { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
    { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
    { input: [[1], 0], expected: -1 },
    { input: [[3, 1], 1], expected: 1 },
    { input: [[5, 1, 3], 3], expected: 2 },
    { input: [[4, 5, 6, 7, 8, 1, 2, 3], 8], expected: 4 },
    { input: [[6, 7, 0, 1, 2, 4, 5], 0], expected: 2, hidden: true },
    { input: [[2, 3, 4, 5, 6, 0, 1], 0], expected: 5, hidden: true },
  ],
};
