import type { Exercise } from '../types';

export const longestSubstringWithoutRepeating: Exercise = {
  id: 'longest-substring-without-repeating',
  title: 'Longest Substring Without Repeating Characters',
  pattern: 'sliding-window',
  difficulty: 'medium',
  functionName: 'lengthOfLongestSubstring',
  leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  statement: `Dada uma string \`s\`, retorne o **comprimento da maior substring sem caracteres repetidos**.

Lembre: substring é contígua — \`"abc"\` é substring de \`"xabcy"\`, mas \`"axc"\` não é.

### Exemplo 1

\`\`\`
Entrada: s = "abcabcbb"
Saída: 3
Explicação: a maior substring sem repetição é "abc".
\`\`\`

### Exemplo 2

\`\`\`
Entrada: s = "bbbbb"
Saída: 1
\`\`\`

### Exemplo 3

\`\`\`
Entrada: s = "pwwkew"
Saída: 3
Explicação: "wke". Note que "pwke" é subsequência, não substring.
\`\`\`

### Restrições

- \`0 <= s.length <= 5 * 10^4\`
- \`s\` contém letras, dígitos, símbolos e espaços.`,
  hints: [
    'Gerar todas as substrings e checar repetição custa O(n³). Pense numa janela `[inicio, fim]` que representa a substring atual sem repetições.',
    'Expanda o `fim` a cada passo. Quando o caractere novo já existe dentro da janela, o `inicio` precisa avançar — até onde exatamente?',
    'Guarde num Map/dict o **último índice** de cada caractere. Ao encontrar um repetido dentro da janela, mova `inicio` para logo após a ocorrência anterior (sem nunca andar para trás).',
  ],
  starterCode: {
    typescript: `function lengthOfLongestSubstring(s: string): number {
  // Retorne o tamanho da maior substring sem repetição
  return 0;
}
`,
    javascript: `function lengthOfLongestSubstring(s) {
  // Retorne o tamanho da maior substring sem repetição
  return 0;
}
`,
    python: `def lengthOfLongestSubstring(s: str) -> int:
    # Retorne o tamanho da maior substring sem repetição
    return 0
`,
  },
  solution: {
    typescript: `function lengthOfLongestSubstring(s: string): number {
  // Janela deslizante + último índice visto de cada caractere
  const ultimoIndice = new Map<string, number>();
  let inicio = 0;
  let melhor = 0;
  for (let fim = 0; fim < s.length; fim++) {
    const c = s[fim];
    const anterior = ultimoIndice.get(c);
    // Repetido DENTRO da janela: encolhe o início para depois da ocorrência
    if (anterior !== undefined && anterior >= inicio) {
      inicio = anterior + 1;
    }
    ultimoIndice.set(c, fim);
    melhor = Math.max(melhor, fim - inicio + 1);
  }
  return melhor;
}
`,
    javascript: `function lengthOfLongestSubstring(s) {
  // Janela deslizante + último índice visto de cada caractere
  const ultimoIndice = new Map();
  let inicio = 0;
  let melhor = 0;
  for (let fim = 0; fim < s.length; fim++) {
    const c = s[fim];
    const anterior = ultimoIndice.get(c);
    // Repetido DENTRO da janela: encolhe o início para depois da ocorrência
    if (anterior !== undefined && anterior >= inicio) {
      inicio = anterior + 1;
    }
    ultimoIndice.set(c, fim);
    melhor = Math.max(melhor, fim - inicio + 1);
  }
  return melhor;
}
`,
    python: `def lengthOfLongestSubstring(s: str) -> int:
    # Janela deslizante + último índice visto de cada caractere
    ultimo_indice = {}
    inicio = 0
    melhor = 0
    for fim, c in enumerate(s):
        # Repetido DENTRO da janela: encolhe o início para depois da ocorrência
        if c in ultimo_indice and ultimo_indice[c] >= inicio:
            inicio = ultimo_indice[c] + 1
        ultimo_indice[c] = fim
        melhor = max(melhor, fim - inicio + 1)
    return melhor
`,
  },
  solutionExplanation: `### Abordagem: janela deslizante com mapa de índices

Mantemos uma janela \`[inicio, fim]\` que sempre contém caracteres únicos. O \`fim\` avança a cada iteração; quando o caractere atual já apareceu **dentro da janela**, movemos \`inicio\` para logo após a ocorrência anterior (o teste \`anterior >= inicio\` garante que nunca andamos para trás — caso clássico de erro em entradas como \`"abba"\`).

O mapa \`caractere -> último índice\` permite encolher a janela em O(1), sem re-varrer.

- **Tempo:** O(n) — cada índice entra e sai da janela no máximo uma vez.
- **Espaço:** O(min(n, tamanho do alfabeto)) para o mapa.`,
  testCases: [
    { input: ['abcabcbb'], expected: 3 },
    { input: ['bbbbb'], expected: 1 },
    { input: ['pwwkew'], expected: 3 },
    { input: [''], expected: 0 },
    { input: ['au'], expected: 2 },
    { input: ['dvdf'], expected: 3 },
    { input: ['abba'], expected: 2, hidden: true },
    { input: ['tmmzuxt'], expected: 5, hidden: true },
  ],
};
