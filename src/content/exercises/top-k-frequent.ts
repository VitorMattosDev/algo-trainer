import type { Exercise } from '../types';

export const topKFrequent: Exercise = {
  id: 'top-k-frequent',
  title: 'Top K Frequent Elements',
  pattern: 'hashmap',
  difficulty: 'medium',
  functionName: 'topKFrequent',
  leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/',
  statement: `Dado um array de inteiros \`nums\` e um inteiro \`k\`, retorne os **k elementos mais frequentes**. A ordem da resposta não importa.

### Exemplo 1

\`\`\`
Entrada: nums = [1, 1, 1, 2, 2, 3], k = 2
Saída: [1, 2]
\`\`\`

### Exemplo 2

\`\`\`
Entrada: nums = [1], k = 1
Saída: [1]
\`\`\`

### Restrições

- \`1 <= nums.length <= 10^5\`
- \`k\` está entre 1 e o número de elementos distintos.
- A resposta é **única** (não há empate que a torne ambígua).

**Desafio:** consegue resolver melhor que O(n log n)?`,
  hints: [
    'Primeiro passo óbvio: contar a frequência de cada elemento com um Map/Counter. E depois, como pegar os k maiores sem ordenar tudo?',
    'Ordenar as frequências custa O(n log n). Um heap de tamanho k melhora para O(n log k). Mas dá para chegar em O(n) percebendo que a frequência máxima possível é n.',
    'Bucket sort: crie um array de "baldes" indexado pela frequência (0..n) e coloque cada número no balde da sua frequência. Percorra os baldes do maior para o menor coletando k elementos.',
  ],
  starterCode: {
    typescript: `function topKFrequent(nums: number[], k: number): number[] {
  // Retorne os k elementos mais frequentes (qualquer ordem)
  return [];
}
`,
    javascript: `function topKFrequent(nums, k) {
  // Retorne os k elementos mais frequentes (qualquer ordem)
  return [];
}
`,
    python: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    # Retorne os k elementos mais frequentes (qualquer ordem)
    return []
`,
  },
  solution: {
    typescript: `function topKFrequent(nums: number[], k: number): number[] {
  // 1) Conta a frequência de cada número
  const contagem = new Map<number, number>();
  for (const n of nums) {
    contagem.set(n, (contagem.get(n) ?? 0) + 1);
  }
  // 2) Bucket sort: índice do balde = frequência (no máximo nums.length)
  const baldes: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, freq] of contagem) {
    baldes[freq].push(n);
  }
  // 3) Coleta do balde mais frequente para o menos frequente
  const resultado: number[] = [];
  for (let freq = baldes.length - 1; freq >= 0 && resultado.length < k; freq--) {
    for (const n of baldes[freq]) {
      resultado.push(n);
      if (resultado.length === k) break;
    }
  }
  return resultado;
}
`,
    javascript: `function topKFrequent(nums, k) {
  // 1) Conta a frequência de cada número
  const contagem = new Map();
  for (const n of nums) {
    contagem.set(n, (contagem.get(n) ?? 0) + 1);
  }
  // 2) Bucket sort: índice do balde = frequência (no máximo nums.length)
  const baldes = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, freq] of contagem) {
    baldes[freq].push(n);
  }
  // 3) Coleta do balde mais frequente para o menos frequente
  const resultado = [];
  for (let freq = baldes.length - 1; freq >= 0 && resultado.length < k; freq--) {
    for (const n of baldes[freq]) {
      resultado.push(n);
      if (resultado.length === k) break;
    }
  }
  return resultado;
}
`,
    python: `from collections import Counter


def topKFrequent(nums: list[int], k: int) -> list[int]:
    # Counter conta as frequências; most_common já devolve em ordem decrescente
    contagem = Counter(nums)
    return [n for n, _ in contagem.most_common(k)]
`,
  },
  solutionExplanation: `### Abordagem: contagem + bucket sort

1. Contamos a frequência de cada elemento num hash map — O(n).
2. Como nenhuma frequência pode passar de \`n\`, criamos \`n + 1\` baldes onde o índice é a frequência e distribuímos os números.
3. Percorremos os baldes do fim para o começo coletando os k primeiros elementos.

Na solução Python usamos \`Counter.most_common(k)\`, que é o idioma da linguagem (internamente usa heap, O(n log k) — também aceito).

- **Tempo:** O(n) com bucket sort (O(n log k) na versão com Counter/heap).
- **Espaço:** O(n) para o mapa de contagem e os baldes.`,
  testCases: [
    { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], unordered: true },
    { input: [[1], 1], expected: [1], unordered: true },
    { input: [[4, 4, 4, 4, 6, 6, 7], 3], expected: [4, 6, 7], unordered: true },
    { input: [[-1, -1, 2, 2, 2], 1], expected: [2], unordered: true },
    { input: [[5, 5, 5, 3, 3, 1], 2], expected: [5, 3], unordered: true },
    {
      input: [[7, 7, 7, 7, 8, 8, 8, 9, 9, 10], 2],
      expected: [7, 8],
      unordered: true,
      hidden: true,
    },
    { input: [[0, 0, 0, 0, 0], 1], expected: [0], unordered: true, hidden: true },
  ],
};
