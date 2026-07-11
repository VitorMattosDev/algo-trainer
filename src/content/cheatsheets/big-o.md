# Big-O: complexidade na prática

## As classes de complexidade

Do mais rápido para o mais lento — cada linha abaixo domina completamente a anterior quando `n` cresce:

```
O(1)        constante      acesso a array, hash map
O(log n)    logarítmica    busca binária, heap push/pop
O(n)        linear         uma passada no array
O(n log n)  linearítmica   sort eficiente, n operações de heap
O(n²)       quadrática     dois loops aninhados
O(2^n)      exponencial    subconjuntos, recursão sem memo
O(n!)       fatorial       permutações
```

Intuição de escala com `n = 1.000.000`: O(log n) ≈ 20 passos, O(n) ≈ 10⁶, O(n log n) ≈ 2×10⁷, O(n²) ≈ 10¹² (inviável). Regra de bolso em entrevistas: **n ≤ 10⁴ aceita O(n²); n ≥ 10⁵ pede O(n log n) ou melhor**.

## Operações em estruturas — TypeScript vs Python

### Array / list

| Operação | TypeScript | Python | Custo |
|---|---|---|---|
| Acesso por índice | `arr[i]` | `arr[i]` | O(1) |
| Adicionar no fim | `push` | `append` | O(1) amortizado |
| Remover do fim | `pop` | `pop()` | O(1) |
| Adicionar/remover no início | `unshift` / `shift` | `insert(0,x)` / `pop(0)` | **O(n)** |
| Buscar valor | `includes` / `indexOf` | `in` / `index` | O(n) |
| Fatiar | `slice` | `arr[a:b]` | O(k) |
| Ordenar | `sort(cmp)` | `sort()` / `sorted()` | O(n log n) |

> Precisa de fila com remoção no início? Em Python use `collections.deque` (O(1) nas pontas). Em JS, use índice de leitura ou implemente uma deque — `shift()` num loop vira O(n²).

### Hash map / set (`Map`, `Set` / `dict`, `set`)

| Operação | Custo médio |
|---|---|
| Inserir, buscar, remover, `has`/`in` | O(1) |
| Iterar | O(n) |

### Heap (`heapq` no Python; JS não tem nativo)

| Operação | Custo |
|---|---|
| `heapify` | O(n) |
| push / pop | O(log n) |
| espiar o topo | O(1) |

### String

| Operação | Custo |
|---|---|
| Acesso, comprimento | O(1) |
| Concatenar duas strings | O(a + b) |
| Concatenar em loop | **O(n²)** — acumule e `join` |
| slice / substring | O(k) |

## Complexidade de espaço

Conte apenas o espaço **extra** além da entrada:

- Duas variáveis, ponteiros: O(1)
- Mapa com até n entradas, array auxiliar: O(n)
- Matriz n×m: O(n·m)
- Recursão: a **pilha de chamadas conta** — DFS numa árvore balanceada usa O(log n), degenerada O(n)

## Como analisar rapidamente

1. Loop simples sobre n elementos → O(n); loops aninhados → multiplique.
2. Divide o problema pela metade a cada passo → O(log n).
3. Loop com operação de heap/map dentro → O(n log n) / O(n).
4. "Para cada elemento, olho todos os outros" → O(n²).
5. Dois loops **sequenciais** somam (O(n) + O(n) = O(n)); só loops aninhados multiplicam.
6. Descarte constantes e termos menores: O(2n + 10) = O(n); O(n² + n) = O(n²).
