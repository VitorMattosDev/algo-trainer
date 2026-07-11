import type { Exercise } from '../types';

export const containerWithMostWater: Exercise = {
  id: 'container-with-most-water',
  title: 'Container With Most Water',
  pattern: 'two-pointers',
  difficulty: 'medium',
  functionName: 'maxArea',
  leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/',
  statement: `Você recebe um array \`height\` com \`n\` inteiros, onde \`height[i]\` é a altura de uma linha vertical desenhada na posição \`i\`.

Escolha **duas linhas** que, junto com o eixo x, formem um recipiente. Retorne a **maior quantidade de água** que um recipiente pode armazenar.

A área entre as posições \`i\` e \`j\` é \`min(height[i], height[j]) * (j - i)\` — a água é limitada pela linha mais baixa.

### Exemplo 1

\`\`\`
Entrada: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
Saída: 49
Explicação: as linhas nas posições 1 (altura 8) e 8 (altura 7) formam área min(8,7) * (8-1) = 49.
\`\`\`

### Exemplo 2

\`\`\`
Entrada: height = [1, 1]
Saída: 1
\`\`\`

### Restrições

- \`2 <= height.length <= 10^5\`
- \`0 <= height[i] <= 10^4\``,
  hints: [
    'Testar todos os pares custa O(n²). Comece com o recipiente mais largo possível (as duas pontas) — o que você ganha e o que perde ao mover um ponteiro para dentro?',
    'Ao mover qualquer ponteiro para dentro, a largura sempre diminui. A área só pode crescer se a altura mínima aumentar.',
    'Mova sempre o ponteiro da linha **mais baixa**: manter a mais baixa nunca gera área maior, pois ela já limita a altura e a largura só encolhe. Guarde a maior área vista.',
  ],
  starterCode: {
    typescript: `function maxArea(height: number[]): number {
  // Retorne a maior área possível entre duas linhas
  return 0;
}
`,
    javascript: `function maxArea(height) {
  // Retorne a maior área possível entre duas linhas
  return 0;
}
`,
    python: `def maxArea(height: list[int]) -> int:
    # Retorne a maior área possível entre duas linhas
    return 0
`,
  },
  solution: {
    typescript: `function maxArea(height: number[]): number {
  // Dois ponteiros nas pontas; move sempre o lado mais baixo
  let esq = 0;
  let dir = height.length - 1;
  let melhor = 0;
  while (esq < dir) {
    const area = Math.min(height[esq], height[dir]) * (dir - esq);
    melhor = Math.max(melhor, area);
    if (height[esq] < height[dir]) {
      esq++;
    } else {
      dir--;
    }
  }
  return melhor;
}
`,
    javascript: `function maxArea(height) {
  // Dois ponteiros nas pontas; move sempre o lado mais baixo
  let esq = 0;
  let dir = height.length - 1;
  let melhor = 0;
  while (esq < dir) {
    const area = Math.min(height[esq], height[dir]) * (dir - esq);
    melhor = Math.max(melhor, area);
    if (height[esq] < height[dir]) {
      esq++;
    } else {
      dir--;
    }
  }
  return melhor;
}
`,
    python: `def maxArea(height: list[int]) -> int:
    # Dois ponteiros nas pontas; move sempre o lado mais baixo
    esq, dir = 0, len(height) - 1
    melhor = 0
    while esq < dir:
        area = min(height[esq], height[dir]) * (dir - esq)
        melhor = max(melhor, area)
        if height[esq] < height[dir]:
            esq += 1
        else:
            dir -= 1
    return melhor
`,
  },
  solutionExplanation: `### Abordagem: dois ponteiros convergentes

Começamos com o recipiente mais largo (pontas do array) e, a cada passo, movemos para dentro o ponteiro da linha **mais baixa**.

Por que isso é seguro? A área é \`min(altura_esq, altura_dir) * largura\`. Ao mover um ponteiro, a largura sempre diminui — então a única chance de melhorar é aumentar a altura mínima. Manter a linha mais baixa e mover a mais alta nunca ajuda: a mínima continuaria a mesma (ou pior) com largura menor. Logo, descartar a linha mais baixa não elimina nenhuma solução ótima.

- **Tempo:** O(n) — cada ponteiro anda no máximo n passos.
- **Espaço:** O(1).`,
  testCases: [
    { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
    { input: [[1, 1]], expected: 1 },
    { input: [[4, 3, 2, 1, 4]], expected: 16 },
    { input: [[1, 2, 1]], expected: 2 },
    { input: [[2, 3, 4, 5, 18, 17, 6]], expected: 17 },
    { input: [[1, 2, 4, 3]], expected: 4, hidden: true },
    { input: [[5, 2, 12, 1, 5, 3, 4, 11]], expected: 55, hidden: true },
  ],
};
