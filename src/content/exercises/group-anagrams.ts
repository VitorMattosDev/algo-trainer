import type { Exercise } from '../types';

export const groupAnagrams: Exercise = {
  id: 'group-anagrams',
  title: 'Group Anagrams',
  pattern: 'hashmap',
  difficulty: 'medium',
  functionName: 'groupAnagrams',
  leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/',
  statement: `Dado um array de strings \`strs\`, **agrupe os anagramas** e retorne a lista de grupos. A ordem dos grupos e a ordem dentro de cada grupo não importam.

Um **anagrama** é uma palavra formada reorganizando as letras de outra — por exemplo, \`"ate"\` é anagrama de \`"eat"\`.

### Exemplo 1

\`\`\`
Entrada: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
Saída: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
\`\`\`

### Exemplo 2

\`\`\`
Entrada: strs = [""]
Saída: [[""]]
\`\`\`

### Restrições

- \`1 <= strs.length <= 10^4\`
- \`0 <= strs[i].length <= 100\`
- \`strs[i]\` contém apenas letras minúsculas.`,
  hints: [
    'Dois anagramas têm exatamente as mesmas letras. Que transformação deixa dois anagramas **idênticos**?',
    'Ordenar os caracteres: `"eat"` e `"tea"` viram ambas `"aet"`. Isso serve como chave de agrupamento.',
    'Use um Map/dict de `chave ordenada -> lista de palavras`. Para cada palavra, ordene as letras, e adicione a palavra na lista da sua chave. No final, retorne os valores do mapa.',
  ],
  starterCode: {
    typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Agrupe as palavras que são anagramas entre si
  return [];
}
`,
    javascript: `function groupAnagrams(strs) {
  // Agrupe as palavras que são anagramas entre si
  return [];
}
`,
    python: `def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Agrupe as palavras que são anagramas entre si
    return []
`,
  },
  solution: {
    typescript: `function groupAnagrams(strs: string[]): string[][] {
  // Chave: caracteres ordenados — anagramas geram a mesma chave
  const grupos = new Map<string, string[]>();
  for (const palavra of strs) {
    const chave = [...palavra].sort().join('');
    const grupo = grupos.get(chave);
    if (grupo) {
      grupo.push(palavra);
    } else {
      grupos.set(chave, [palavra]);
    }
  }
  return [...grupos.values()];
}
`,
    javascript: `function groupAnagrams(strs) {
  // Chave: caracteres ordenados — anagramas geram a mesma chave
  const grupos = new Map();
  for (const palavra of strs) {
    const chave = [...palavra].sort().join('');
    const grupo = grupos.get(chave);
    if (grupo) {
      grupo.push(palavra);
    } else {
      grupos.set(chave, [palavra]);
    }
  }
  return [...grupos.values()];
}
`,
    python: `from collections import defaultdict


def groupAnagrams(strs: list[str]) -> list[list[str]]:
    # Chave: tupla dos caracteres ordenados — anagramas geram a mesma chave
    grupos = defaultdict(list)
    for palavra in strs:
        grupos[tuple(sorted(palavra))].append(palavra)
    return list(grupos.values())
`,
  },
  solutionExplanation: `### Abordagem: chave canônica num hash map

Anagramas ficam idênticos quando ordenamos suas letras. Usamos essa forma canônica como chave de um mapa \`chave -> grupo\`: cada palavra é ordenada e adicionada ao grupo da sua chave, e a resposta são os valores do mapa.

Alternativa que evita ordenar: usar como chave a contagem das 26 letras (ex.: \`1a0b0c...\`), reduzindo o custo por palavra de O(k log k) para O(k).

- **Tempo:** O(n · k log k), onde n é o número de palavras e k o tamanho máximo de uma palavra.
- **Espaço:** O(n · k) para o mapa com todas as palavras.`,
  testCases: [
    {
      input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
      expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
      unordered: true,
    },
    { input: [['']], expected: [['']], unordered: true },
    { input: [['a']], expected: [['a']], unordered: true },
    {
      input: [['abc', 'cba', 'bca', 'xyz']],
      expected: [['abc', 'cba', 'bca'], ['xyz']],
      unordered: true,
    },
    {
      input: [['ab', 'ba', 'abc']],
      expected: [['ab', 'ba'], ['abc']],
      unordered: true,
    },
    {
      input: [['listen', 'silent', 'enlist', 'google', 'gooegl']],
      expected: [['listen', 'silent', 'enlist'], ['google', 'gooegl']],
      unordered: true,
      hidden: true,
    },
    {
      input: [['aa', 'a', 'aaa']],
      expected: [['aa'], ['a'], ['aaa']],
      unordered: true,
      hidden: true,
    },
  ],
};
