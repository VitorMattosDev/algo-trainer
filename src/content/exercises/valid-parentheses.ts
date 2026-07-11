import type { Exercise } from '../types';

export const validParentheses: Exercise = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  pattern: 'stack',
  difficulty: 'easy',
  functionName: 'isValid',
  leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/',
  statement: `Dada uma string \`s\` contendo apenas os caracteres \`(\`, \`)\`, \`{\`, \`}\`, \`[\` e \`]\`, determine se ela é **válida**.

Uma string é válida quando:

1. Todo símbolo de abertura é fechado pelo símbolo do **mesmo tipo**;
2. Os símbolos são fechados na **ordem correta**;
3. Todo símbolo de fechamento tem um de abertura correspondente.

### Exemplo 1

\`\`\`
Entrada: s = "()[]{}"
Saída: true
\`\`\`

### Exemplo 2

\`\`\`
Entrada: s = "([)]"
Saída: false
Explicação: o colchete fecha antes do parêntese interno ser fechado.
\`\`\`

### Restrições

- \`1 <= s.length <= 10^4\``,
  hints: [
    'O último símbolo aberto precisa ser o primeiro a fechar (LIFO). Que estrutura de dados tem exatamente esse comportamento?',
    'Use uma pilha: ao ver um símbolo de abertura, empilhe. Ao ver um de fechamento, ele precisa casar com o topo da pilha.',
    'Atenção aos casos de borda: fechamento com pilha vazia (ex.: `"]"`) é inválido, e sobrar coisa na pilha no final (ex.: `"("`) também.',
  ],
  starterCode: {
    typescript: `function isValid(s: string): boolean {
  // Retorne true se os símbolos abrem e fecham corretamente
  return false;
}
`,
    javascript: `function isValid(s) {
  // Retorne true se os símbolos abrem e fecham corretamente
  return false;
}
`,
    python: `def isValid(s: str) -> bool:
    # Retorne True se os símbolos abrem e fecham corretamente
    return False
`,
  },
  solution: {
    typescript: `function isValid(s: string): boolean {
  // Mapa: fechamento -> abertura correspondente
  const pares: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const pilha: string[] = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') {
      pilha.push(c);
    } else if (pilha.pop() !== pares[c]) {
      // Cobre também pilha vazia: pop() devolve undefined e não casa
      return false;
    }
  }
  // Válido só se todo símbolo aberto foi fechado
  return pilha.length === 0;
}
`,
    javascript: `function isValid(s) {
  // Mapa: fechamento -> abertura correspondente
  const pares = { ')': '(', ']': '[', '}': '{' };
  const pilha = [];
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') {
      pilha.push(c);
    } else if (pilha.pop() !== pares[c]) {
      // Cobre também pilha vazia: pop() devolve undefined e não casa
      return false;
    }
  }
  // Válido só se todo símbolo aberto foi fechado
  return pilha.length === 0;
}
`,
    python: `def isValid(s: str) -> bool:
    # Mapa: fechamento -> abertura correspondente
    pares = {")": "(", "]": "[", "}": "{"}
    pilha = []
    for c in s:
        if c in "([{":
            pilha.append(c)
        elif not pilha or pilha.pop() != pares[c]:
            # Fechamento sem abertura ou de tipo errado
            return False
    # Válido só se todo símbolo aberto foi fechado
    return len(pilha) == 0
`,
  },
  solutionExplanation: `### Abordagem: pilha

Símbolos de abertura entram na pilha; ao encontrar um fechamento, ele deve casar com o **topo** (o aberto mais recente). Se casar, desempilhamos; se não casar — ou a pilha estiver vazia — a string é inválida. No final, a pilha precisa estar vazia (nada ficou aberto).

É o exemplo canônico do padrão **stack**: o problema tem estrutura "último a abrir, primeiro a fechar", exatamente a semântica LIFO.

- **Tempo:** O(n) — cada caractere é processado uma vez.
- **Espaço:** O(n) — pior caso, todos os caracteres são aberturas.`,
  testCases: [
    { input: ['()'], expected: true },
    { input: ['()[]{}'], expected: true },
    { input: ['(]'], expected: false },
    { input: ['([)]'], expected: false },
    { input: ['{[]}'], expected: true },
    { input: ['('], expected: false },
    { input: [']'], expected: false, hidden: true },
    { input: ['(({[]}))'], expected: true, hidden: true },
  ],
};
