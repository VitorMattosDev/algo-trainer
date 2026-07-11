import type { Exercise } from '../types';

export const threeSum: Exercise = {
  id: '3sum',
  title: '3Sum',
  pattern: 'two-pointers',
  difficulty: 'medium',
  functionName: 'threeSum',
  leetcodeUrl: 'https://leetcode.com/problems/3sum/',
  statement: `Dado um array de inteiros \`nums\`, retorne **todas as triplas** \`[nums[i], nums[j], nums[k]]\` tais que \`i\`, \`j\` e \`k\` são índices distintos e \`nums[i] + nums[j] + nums[k] == 0\`.

A resposta **não pode conter triplas duplicadas**. A ordem das triplas (e dos elementos dentro de cada tripla) não importa.

### Exemplo 1

\`\`\`
Entrada: nums = [-1, 0, 1, 2, -1, -4]
Saída: [[-1, -1, 2], [-1, 0, 1]]
\`\`\`

### Exemplo 2

\`\`\`
Entrada: nums = [0, 1, 1]
Saída: []
\`\`\`

### Exemplo 3

\`\`\`
Entrada: nums = [0, 0, 0]
Saída: [[0, 0, 0]]
\`\`\`

### Restrições

- \`3 <= nums.length <= 3000\`
- \`-10^5 <= nums[i] <= 10^5\``,
  hints: [
    'Força bruta é O(n³) e ainda gera duplicatas. O que acontece se você **ordenar** o array primeiro?',
    'Com o array ordenado, fixe o primeiro número e o problema vira um Two Sum no restante: encontre dois números que somem o oposto do fixado. Faça isso com dois ponteiros.',
    'Para evitar duplicatas: pule valores repetidos tanto ao escolher o número fixo quanto ao mover os ponteiros depois de encontrar uma tripla válida.',
  ],
  starterCode: {
    typescript: `function threeSum(nums: number[]): number[][] {
  // Retorne todas as triplas únicas que somam zero
  return [];
}
`,
    javascript: `function threeSum(nums) {
  // Retorne todas as triplas únicas que somam zero
  return [];
}
`,
    python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Retorne todas as triplas únicas que somam zero
    return []
`,
  },
  solution: {
    typescript: `function threeSum(nums: number[]): number[][] {
  // Ordena para poder usar dois ponteiros e pular duplicatas
  const ordenado = [...nums].sort((a, b) => a - b);
  const resultado: number[][] = [];
  for (let i = 0; i < ordenado.length - 2; i++) {
    // Pula valores repetidos do número fixado
    if (i > 0 && ordenado[i] === ordenado[i - 1]) continue;
    let esq = i + 1;
    let dir = ordenado.length - 1;
    while (esq < dir) {
      const soma = ordenado[i] + ordenado[esq] + ordenado[dir];
      if (soma < 0) {
        esq++;
      } else if (soma > 0) {
        dir--;
      } else {
        resultado.push([ordenado[i], ordenado[esq], ordenado[dir]]);
        // Pula duplicatas dos dois lados antes de continuar
        while (esq < dir && ordenado[esq] === ordenado[esq + 1]) esq++;
        while (esq < dir && ordenado[dir] === ordenado[dir - 1]) dir--;
        esq++;
        dir--;
      }
    }
  }
  return resultado;
}
`,
    javascript: `function threeSum(nums) {
  // Ordena para poder usar dois ponteiros e pular duplicatas
  const ordenado = [...nums].sort((a, b) => a - b);
  const resultado = [];
  for (let i = 0; i < ordenado.length - 2; i++) {
    // Pula valores repetidos do número fixado
    if (i > 0 && ordenado[i] === ordenado[i - 1]) continue;
    let esq = i + 1;
    let dir = ordenado.length - 1;
    while (esq < dir) {
      const soma = ordenado[i] + ordenado[esq] + ordenado[dir];
      if (soma < 0) {
        esq++;
      } else if (soma > 0) {
        dir--;
      } else {
        resultado.push([ordenado[i], ordenado[esq], ordenado[dir]]);
        // Pula duplicatas dos dois lados antes de continuar
        while (esq < dir && ordenado[esq] === ordenado[esq + 1]) esq++;
        while (esq < dir && ordenado[dir] === ordenado[dir - 1]) dir--;
        esq++;
        dir--;
      }
    }
  }
  return resultado;
}
`,
    python: `def threeSum(nums: list[int]) -> list[list[int]]:
    # Ordena para poder usar dois ponteiros e pular duplicatas
    ordenado = sorted(nums)
    resultado = []
    for i in range(len(ordenado) - 2):
        # Pula valores repetidos do número fixado
        if i > 0 and ordenado[i] == ordenado[i - 1]:
            continue
        esq, dir = i + 1, len(ordenado) - 1
        while esq < dir:
            soma = ordenado[i] + ordenado[esq] + ordenado[dir]
            if soma < 0:
                esq += 1
            elif soma > 0:
                dir -= 1
            else:
                resultado.append([ordenado[i], ordenado[esq], ordenado[dir]])
                # Pula duplicatas dos dois lados antes de continuar
                while esq < dir and ordenado[esq] == ordenado[esq + 1]:
                    esq += 1
                while esq < dir and ordenado[dir] == ordenado[dir - 1]:
                    dir -= 1
                esq += 1
                dir -= 1
    return resultado
`,
  },
  solutionExplanation: `### Abordagem: ordenar + fixar um número + dois ponteiros

1. Ordenamos o array — O(n log n).
2. Para cada índice \`i\` (o número "fixo"), procuramos no restante dois números que somem \`-nums[i]\` usando dois ponteiros convergentes: soma pequena move o esquerdo, soma grande move o direito.
3. Duplicatas são evitadas pulando valores repetidos, tanto no laço externo quanto após registrar uma tripla.

A ordenação é o que permite ambas as otimizações: a busca com dois ponteiros e o salto de duplicatas.

- **Tempo:** O(n²) — n iterações externas com varredura linear interna (a ordenação O(n log n) fica dominada).
- **Espaço:** O(1) extra, ignorando a saída (O(n) se contar a cópia ordenada).`,
  testCases: [
    {
      input: [[-1, 0, 1, 2, -1, -4]],
      expected: [[-1, -1, 2], [-1, 0, 1]],
      unordered: true,
    },
    { input: [[0, 1, 1]], expected: [], unordered: true },
    { input: [[0, 0, 0]], expected: [[0, 0, 0]], unordered: true },
    {
      input: [[-2, 0, 1, 1, 2]],
      expected: [[-2, 0, 2], [-2, 1, 1]],
      unordered: true,
    },
    { input: [[1, 2, -2, -1]], expected: [], unordered: true },
    { input: [[0, 0, 0, 0]], expected: [[0, 0, 0]], unordered: true, hidden: true },
    {
      input: [[-4, -2, -2, 0, 1, 2, 2, 3, 4]],
      expected: [[-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]],
      unordered: true,
      hidden: true,
    },
  ],
};
