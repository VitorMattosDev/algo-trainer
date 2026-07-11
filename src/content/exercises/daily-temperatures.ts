import type { Exercise } from '../types';

export const dailyTemperatures: Exercise = {
  id: 'daily-temperatures',
  title: 'Daily Temperatures',
  pattern: 'stack',
  difficulty: 'medium',
  functionName: 'dailyTemperatures',
  leetcodeUrl: 'https://leetcode.com/problems/daily-temperatures/',
  statement: `Dado um array \`temperatures\` com as temperaturas diárias, retorne um array \`answer\` tal que \`answer[i]\` é o **número de dias que você precisa esperar**, a partir do dia \`i\`, até uma temperatura **mais quente**. Se isso nunca acontecer, \`answer[i] = 0\`.

### Exemplo 1

\`\`\`
Entrada: temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
Saída: [1, 1, 4, 2, 1, 1, 0, 0]
\`\`\`

### Exemplo 2

\`\`\`
Entrada: temperatures = [30, 40, 50, 60]
Saída: [1, 1, 1, 0]
\`\`\`

### Restrições

- \`1 <= temperatures.length <= 10^5\`
- \`30 <= temperatures[i] <= 100\``,
  hints: [
    'Para cada dia, procurar o próximo dia mais quente custa O(n²) no pior caso. Este é o problema clássico de "próximo elemento maior".',
    'Pense numa pilha de dias **ainda sem resposta**. Quando chega uma temperatura nova, quais dias da pilha acabaram de ganhar resposta?',
    'Mantenha uma pilha de índices com temperaturas decrescentes. Ao chegar o dia `i`, desempilhe todo índice `j` com temperatura menor que a de `i` — a resposta de `j` é `i - j`. Depois empilhe `i`.',
  ],
  starterCode: {
    typescript: `function dailyTemperatures(temperatures: number[]): number[] {
  // Para cada dia, quantos dias até uma temperatura mais quente?
  return [];
}
`,
    javascript: `function dailyTemperatures(temperatures) {
  // Para cada dia, quantos dias até uma temperatura mais quente?
  return [];
}
`,
    python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    # Para cada dia, quantos dias até uma temperatura mais quente?
    return []
`,
  },
  solution: {
    typescript: `function dailyTemperatures(temperatures: number[]): number[] {
  const resposta = new Array<number>(temperatures.length).fill(0);
  // Pilha monotônica decrescente de ÍNDICES ainda sem resposta
  const pilha: number[] = [];
  for (let i = 0; i < temperatures.length; i++) {
    // O dia i responde todos os dias empilhados mais frios que ele
    while (pilha.length > 0 && temperatures[i] > temperatures[pilha[pilha.length - 1]]) {
      const j = pilha.pop()!;
      resposta[j] = i - j;
    }
    pilha.push(i);
  }
  return resposta;
}
`,
    javascript: `function dailyTemperatures(temperatures) {
  const resposta = new Array(temperatures.length).fill(0);
  // Pilha monotônica decrescente de ÍNDICES ainda sem resposta
  const pilha = [];
  for (let i = 0; i < temperatures.length; i++) {
    // O dia i responde todos os dias empilhados mais frios que ele
    while (pilha.length > 0 && temperatures[i] > temperatures[pilha[pilha.length - 1]]) {
      const j = pilha.pop();
      resposta[j] = i - j;
    }
    pilha.push(i);
  }
  return resposta;
}
`,
    python: `def dailyTemperatures(temperatures: list[int]) -> list[int]:
    resposta = [0] * len(temperatures)
    # Pilha monotônica decrescente de ÍNDICES ainda sem resposta
    pilha = []
    for i, temp in enumerate(temperatures):
        # O dia i responde todos os dias empilhados mais frios que ele
        while pilha and temp > temperatures[pilha[-1]]:
            j = pilha.pop()
            resposta[j] = i - j
        pilha.append(i)
    return resposta
`,
  },
  solutionExplanation: `### Abordagem: pilha monotônica

Mantemos uma pilha de **índices** cujas temperaturas formam uma sequência decrescente — são os dias que ainda esperam por um dia mais quente. Quando o dia \`i\` chega:

1. Enquanto o topo da pilha tiver temperatura menor que a de \`i\`, aquele dia \`j\` acabou de encontrar sua resposta: \`i - j\` dias de espera.
2. Empilhamos \`i\`, que passa a esperar sua vez.

Dias que nunca são desempilhados ficam com 0 (nunca esquenta depois deles).

- **Tempo:** O(n) — cada índice entra e sai da pilha no máximo uma vez.
- **Espaço:** O(n) — pilha no pior caso (temperaturas sempre caindo).`,
  testCases: [
    { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
    { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    { input: [[30, 60, 90]], expected: [1, 1, 0] },
    { input: [[90, 80, 70]], expected: [0, 0, 0] },
    { input: [[64]], expected: [0] },
    {
      input: [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78]],
      expected: [3, 1, 1, 2, 1, 1, 0, 1, 1, 0],
      hidden: true,
    },
    { input: [[30, 30, 30]], expected: [0, 0, 0], hidden: true },
  ],
};
