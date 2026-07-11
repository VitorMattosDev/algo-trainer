import type { Exercise } from '../types';

export const bestTimeToBuyAndSellStock: Exercise = {
  id: 'best-time-to-buy-and-sell-stock',
  title: 'Best Time to Buy and Sell Stock',
  pattern: 'sliding-window',
  difficulty: 'easy',
  functionName: 'maxProfit',
  leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
  statement: `Você recebe um array \`prices\` onde \`prices[i]\` é o preço de uma ação no dia \`i\`.

Você quer maximizar o lucro escolhendo **um único dia para comprar** e **um dia futuro para vender**.

Retorne o maior lucro possível. Se nenhum lucro for possível, retorne \`0\`.

### Exemplo 1

\`\`\`
Entrada: prices = [7, 1, 5, 3, 6, 4]
Saída: 5
Explicação: compra no dia 2 (preço 1) e vende no dia 5 (preço 6): lucro 6 - 1 = 5.
\`\`\`

### Exemplo 2

\`\`\`
Entrada: prices = [7, 6, 4, 3, 1]
Saída: 0
Explicação: os preços só caem; nenhuma transação dá lucro.
\`\`\`

### Restrições

- \`1 <= prices.length <= 10^5\`
- \`0 <= prices[i] <= 10^4\``,
  hints: [
    'Testar cada par compra/venda custa O(n²). Pense: se você vender no dia `i`, qual é o melhor dia para ter comprado?',
    'Para vender no dia `i`, o melhor é ter comprado no **menor preço antes de `i`**. Dá para manter essa informação enquanto percorre o array?',
    'Uma única passada: mantenha o menor preço visto até agora e, a cada dia, calcule o lucro vendendo hoje (preço atual - mínimo). Guarde o maior lucro.',
  ],
  starterCode: {
    typescript: `function maxProfit(prices: number[]): number {
  // Retorne o maior lucro possível (ou 0)
  return 0;
}
`,
    javascript: `function maxProfit(prices) {
  // Retorne o maior lucro possível (ou 0)
  return 0;
}
`,
    python: `def maxProfit(prices: list[int]) -> int:
    # Retorne o maior lucro possível (ou 0)
    return 0
`,
  },
  solution: {
    typescript: `function maxProfit(prices: number[]): number {
  // Janela: menor preço à esquerda vs. preço atual
  let menorPreco = Infinity;
  let melhorLucro = 0;
  for (const preco of prices) {
    menorPreco = Math.min(menorPreco, preco);
    melhorLucro = Math.max(melhorLucro, preco - menorPreco);
  }
  return melhorLucro;
}
`,
    javascript: `function maxProfit(prices) {
  // Janela: menor preço à esquerda vs. preço atual
  let menorPreco = Infinity;
  let melhorLucro = 0;
  for (const preco of prices) {
    menorPreco = Math.min(menorPreco, preco);
    melhorLucro = Math.max(melhorLucro, preco - menorPreco);
  }
  return melhorLucro;
}
`,
    python: `def maxProfit(prices: list[int]) -> int:
    # Janela: menor preço à esquerda vs. preço atual
    menor_preco = float("inf")
    melhor_lucro = 0
    for preco in prices:
        menor_preco = min(menor_preco, preco)
        melhor_lucro = max(melhor_lucro, preco - menor_preco)
    return melhor_lucro
`,
  },
  solutionExplanation: `### Abordagem: uma passada mantendo o mínimo

Percorremos os preços uma vez mantendo duas variáveis:

- \`menorPreco\`: o menor preço visto até o dia atual (melhor dia de compra possível até aqui);
- \`melhorLucro\`: o maior valor de \`preço atual - menorPreco\` já observado.

É uma forma do padrão **sliding window**: a "janela" vai do mínimo à esquerda até o dia atual; quando aparece um preço menor que o mínimo, a janela recomeça dali (comprar mais barato nunca piora).

- **Tempo:** O(n) — uma única passada.
- **Espaço:** O(1) — duas variáveis.`,
  testCases: [
    { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { input: [[7, 6, 4, 3, 1]], expected: 0 },
    { input: [[1, 2]], expected: 1 },
    { input: [[2, 4, 1]], expected: 2 },
    { input: [[3, 2, 6, 5, 0, 3]], expected: 4 },
    { input: [[2, 1, 2, 1, 0, 1, 2]], expected: 2, hidden: true },
    { input: [[1]], expected: 0, hidden: true },
  ],
};
