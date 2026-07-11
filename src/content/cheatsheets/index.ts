import bigO from './big-o.md?raw';
import javascriptReferencia from './javascript-referencia.md?raw';
import padroesDeResolucao from './padroes-de-resolucao.md?raw';
import pythonEssencial from './python-essencial.md?raw';
import pythonReferencia from './python-referencia.md?raw';
import typescriptEssencial from './typescript-essencial.md?raw';
import typescriptReferencia from './typescript-referencia.md?raw';

export interface Cheatsheet {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export const cheatsheets: Cheatsheet[] = [
  {
    slug: 'typescript-essencial',
    title: 'TypeScript essencial',
    description:
      'Arrays, map/filter/reduce, sort com comparator, Map/Set, strings, spread e truques de algoritmos.',
    content: typescriptEssencial,
  },
  {
    slug: 'python-essencial',
    title: 'Python essencial',
    description:
      'Comprehensions, slicing, Counter/deque/defaultdict, heapq, enumerate/zip e f-strings.',
    content: pythonEssencial,
  },
  {
    slug: 'javascript-referencia',
    title: 'Referência completa: JavaScript',
    description:
      'A linguagem inteira: tipos e coerção, arrays e objetos a fundo, funções, classes, Map/Set, async, regex e armadilhas.',
    content: javascriptReferencia,
  },
  {
    slug: 'typescript-referencia',
    title: 'Referência completa: TypeScript',
    description:
      'O sistema de tipos a fundo: unions, narrowing, genéricos, utility types, keyof/mapped types, satisfies e receitas para algoritmos.',
    content: typescriptReferencia,
  },
  {
    slug: 'python-referencia',
    title: 'Referência completa: Python',
    description:
      'A linguagem inteira: strings, listas, dicts, comprehensions, funções, classes, exceções, geradores e a stdlib de algoritmos.',
    content: pythonReferencia,
  },
  {
    slug: 'big-o',
    title: 'Big-O',
    description:
      'Classes de complexidade e tabela de custos das operações em arrays, mapas, heaps e strings nas duas linguagens.',
    content: bigO,
  },
  {
    slug: 'padroes-de-resolucao',
    title: 'Padrões de resolução',
    description:
      'Os 14 padrões: quando usar, template em TS e Python e problemas clássicos de cada um.',
    content: padroesDeResolucao,
  },
];

export function getCheatsheet(slug: string): Cheatsheet | undefined {
  return cheatsheets.find((c) => c.slug === slug);
}
