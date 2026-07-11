import type { Exercise } from '../types';

export const validPalindrome: Exercise = {
  id: 'valid-palindrome',
  title: 'Valid Palindrome',
  pattern: 'two-pointers',
  difficulty: 'easy',
  functionName: 'isPalindrome',
  leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/',
  statement: `Uma frase é um **palíndromo** se, após converter todas as letras para minúsculas e remover tudo que não é letra ou dígito, ela é lida igualmente da esquerda para a direita e da direita para a esquerda.

Dada uma string \`s\`, retorne \`true\` se ela for um palíndromo, ou \`false\` caso contrário.

### Exemplo 1

\`\`\`
Entrada: s = "A man, a plan, a canal: Panama"
Saída: true
Explicação: "amanaplanacanalpanama" é um palíndromo.
\`\`\`

### Exemplo 2

\`\`\`
Entrada: s = "race a car"
Saída: false
\`\`\`

### Exemplo 3

\`\`\`
Entrada: s = " "
Saída: true
Explicação: após remover não-alfanuméricos, sobra a string vazia, que é palíndromo.
\`\`\`

### Restrições

- \`1 <= s.length <= 2 * 10^5\`
- \`s\` contém apenas caracteres ASCII imprimíveis.`,
  hints: [
    'Uma opção é limpar a string e compará-la com a sua reversa. Funciona, mas usa O(n) de espaço extra. Como comparar sem criar novas strings?',
    'Coloque um ponteiro em cada ponta da string e caminhe em direção ao centro comparando os caracteres.',
    'Quando um ponteiro cair num caractere não-alfanumérico, apenas avance-o (sem comparar). Compare sempre em minúsculas e pare quando os ponteiros se cruzarem.',
  ],
  starterCode: {
    typescript: `function isPalindrome(s: string): boolean {
  // Considere apenas letras e dígitos, ignorando maiúsculas/minúsculas
  return false;
}
`,
    javascript: `function isPalindrome(s) {
  // Considere apenas letras e dígitos, ignorando maiúsculas/minúsculas
  return false;
}
`,
    python: `def isPalindrome(s: str) -> bool:
    # Considere apenas letras e dígitos, ignorando maiúsculas/minúsculas
    return False
`,
  },
  solution: {
    typescript: `function isPalindrome(s: string): boolean {
  const ehAlfanumerico = (c: string) => /[a-z0-9]/i.test(c);
  // Dois ponteiros: das pontas para o centro
  let esq = 0;
  let dir = s.length - 1;
  while (esq < dir) {
    // Pula caracteres que não contam (espaços, pontuação...)
    while (esq < dir && !ehAlfanumerico(s[esq])) esq++;
    while (esq < dir && !ehAlfanumerico(s[dir])) dir--;
    if (s[esq].toLowerCase() !== s[dir].toLowerCase()) return false;
    esq++;
    dir--;
  }
  return true;
}
`,
    javascript: `function isPalindrome(s) {
  const ehAlfanumerico = (c) => /[a-z0-9]/i.test(c);
  // Dois ponteiros: das pontas para o centro
  let esq = 0;
  let dir = s.length - 1;
  while (esq < dir) {
    // Pula caracteres que não contam (espaços, pontuação...)
    while (esq < dir && !ehAlfanumerico(s[esq])) esq++;
    while (esq < dir && !ehAlfanumerico(s[dir])) dir--;
    if (s[esq].toLowerCase() !== s[dir].toLowerCase()) return false;
    esq++;
    dir--;
  }
  return true;
}
`,
    python: `def isPalindrome(s: str) -> bool:
    # Dois ponteiros: das pontas para o centro
    esq, dir = 0, len(s) - 1
    while esq < dir:
        # Pula caracteres que não contam (espaços, pontuação...)
        while esq < dir and not s[esq].isalnum():
            esq += 1
        while esq < dir and not s[dir].isalnum():
            dir -= 1
        if s[esq].lower() != s[dir].lower():
            return False
        esq += 1
        dir -= 1
    return True
`,
  },
  solutionExplanation: `### Abordagem: dois ponteiros das pontas ao centro

Mantemos um ponteiro no início e outro no fim. A cada passo, avançamos cada ponteiro até um caractere alfanumérico, comparamos em minúsculas e movemos ambos para dentro. Se alguma comparação falhar, não é palíndromo; se os ponteiros se cruzarem, é.

É o uso clássico do padrão **two-pointers**: evitamos construir a string limpa e a reversa (O(n) de espaço extra), comparando no lugar.

- **Tempo:** O(n) — cada ponteiro percorre a string no máximo uma vez.
- **Espaço:** O(1) — apenas os dois índices.`,
  testCases: [
    { input: ['A man, a plan, a canal: Panama'], expected: true },
    { input: ['race a car'], expected: false },
    { input: [' '], expected: true },
    { input: ['0P'], expected: false },
    { input: ['Was it a car or a cat I saw?'], expected: true },
    { input: ['ab_a'], expected: true },
    { input: ["No 'x' in Nixon"], expected: true, hidden: true },
    { input: ['12321'], expected: true, hidden: true },
  ],
};
