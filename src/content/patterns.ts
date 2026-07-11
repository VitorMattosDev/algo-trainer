import type { Pattern } from './types';

/** Taxonomia fixa de padrões — slugs não devem ser renomeados. */
export const patterns: Pattern[] = [
  {
    slug: 'two-pointers',
    name: 'Dois Ponteiros',
    description:
      'Dois índices que percorrem a estrutura (das pontas ao centro ou em velocidades diferentes) para evitar força bruta O(n²).',
  },
  {
    slug: 'sliding-window',
    name: 'Janela Deslizante',
    description:
      'Janela contígua que cresce e encolhe sobre arrays/strings para otimizar subarrays ou substrings que satisfazem uma condição.',
  },
  {
    slug: 'hashmap',
    name: 'Hash Map',
    description:
      'Mapas e conjuntos para busca O(1): frequências, complementos, agrupamentos e detecção de duplicatas.',
  },
  {
    slug: 'stack',
    name: 'Pilha',
    description:
      'LIFO para pareamento de símbolos, pilha monotônica (próximo maior elemento) e avaliação de expressões.',
  },
  {
    slug: 'binary-search',
    name: 'Busca Binária',
    description:
      'Divide o espaço de busca pela metade a cada passo em dados ordenados (ou monotônicos) — O(log n).',
  },
  {
    slug: 'linked-list',
    name: 'Lista Ligada',
    description:
      'Manipulação de ponteiros: reversão, detecção de ciclo (rápido/lento), merge e remoção de nós.',
  },
  {
    slug: 'trees-bfs-dfs',
    name: 'Árvores (BFS/DFS)',
    description:
      'Travessias em profundidade e largura, recursão em subárvores, alturas, caminhos e validação de BST.',
  },
  {
    slug: 'heap',
    name: 'Heap / Fila de Prioridade',
    description:
      'Acesso O(log n) ao menor/maior elemento: top-K, medianas em stream e merge de K listas.',
  },
  {
    slug: 'backtracking',
    name: 'Backtracking',
    description:
      'Exploração exaustiva com poda: permutações, combinações, subconjuntos e problemas de tabuleiro.',
  },
  {
    slug: 'dynamic-programming',
    name: 'Programação Dinâmica',
    description:
      'Subproblemas sobrepostos + memoização/tabulação: decisões ótimas construídas de baixo para cima.',
  },
  {
    slug: 'graphs',
    name: 'Grafos',
    description:
      'BFS/DFS em grades e listas de adjacência, componentes conexos, ordenação topológica e caminhos mínimos.',
  },
  {
    slug: 'intervals',
    name: 'Intervalos',
    description:
      'Ordenar por início/fim e varrer: merge de intervalos, detecção de sobreposição e agendamento.',
  },
  {
    slug: 'greedy',
    name: 'Guloso',
    description:
      'Escolha localmente ótima a cada passo quando ela leva ao ótimo global — geralmente após ordenar.',
  },
  {
    slug: 'bit-manipulation',
    name: 'Manipulação de Bits',
    description:
      'XOR, máscaras e deslocamentos para resolver em O(1) de espaço o que estruturas auxiliares fariam.',
  },
];

export function getPattern(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}
