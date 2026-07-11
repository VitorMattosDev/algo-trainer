# Python essencial para algoritmos

Referência rápida do que mais aparece resolvendo problemas estilo LeetCode em Python.

## Listas

```python
arr = [3, 1, 2]

arr.append(4)       # adiciona no fim — O(1)
arr.pop()           # remove do fim — O(1)
arr.pop(0)          # remove do início — O(n)! (use deque)
arr.insert(0, 9)    # insere no início — O(n)!
arr.index(2)        # índice (ValueError se não existir)
2 in arr            # pertencimento — O(n)
arr.count(2)
arr.reverse()       # inverte NO LUGAR
sorted(arr)         # cópia ordenada
arr.sort()          # ordena NO LUGAR
arr.sort(key=lambda x: -x)          # decrescente (ou reverse=True)
pares.sort(key=lambda p: (p[0], p[1]))  # múltiplos critérios
```

### Criação

```python
[0] * 5                       # [0, 0, 0, 0, 0]
[[] for _ in range(3)]        # matriz SEM referência compartilhada
[[0] * colunas for _ in range(linhas)]
list(range(5))                # [0, 1, 2, 3, 4]
```

⚠️ Nunca use `[[]] * 3` — as três posições apontam para a MESMA lista.

## Slicing

```python
arr[1:3]      # índices 1 e 2
arr[:3]       # três primeiros
arr[-2:]      # dois últimos
arr[::2]      # de dois em dois
arr[::-1]     # invertido (cópia)
s == s[::-1]  # teste de palíndromo em uma linha
```

## Comprehensions

```python
[x * 2 for x in nums]                  # list
[x for x in nums if x % 2 == 0]        # com filtro
{x: len(x) for x in palavras}          # dict
{c for c in s}                         # set
sum(x * x for x in nums)               # generator — sem lista intermediária
```

## Dicionários e sets

```python
d = {}
d["a"] = 1
d.get("b", 0)          # valor ou default (sem KeyError)
"a" in d               # O(1)
d.pop("a", None)
for chave, valor in d.items(): ...

s = {1, 2, 3}
s.add(4); s.discard(2)
a | b   # união       a & b  # interseção
a - b   # diferença   a ^ b  # diferença simétrica
```

## collections — o kit LeetCode

```python
from collections import Counter, deque, defaultdict

# Counter: frequências prontas
c = Counter("banana")        # {'a': 3, 'n': 2, 'b': 1}
c.most_common(2)             # [('a', 3), ('n', 2)]
Counter(a) == Counter(b)     # teste de anagrama

# deque: fila O(1) nas duas pontas (BFS!)
fila = deque([1, 2])
fila.append(3)               # direita
fila.appendleft(0)           # esquerda
fila.popleft()               # O(1) — list.pop(0) é O(n)

# defaultdict: some a burocracia do "if chave not in d"
grupos = defaultdict(list)
grupos["chave"].append(valor)
contagem = defaultdict(int)
contagem[x] += 1
```

## heapq — fila de prioridade

```python
import heapq

heap = [5, 2, 8]
heapq.heapify(heap)          # min-heap NO LUGAR — O(n)
heapq.heappush(heap, 1)      # O(log n)
menor = heapq.heappop(heap)  # O(log n)
heap[0]                      # espia o menor sem remover

# Max-heap: negue os valores
heapq.heappush(heap, -x); maior = -heapq.heappop(heap)

# Top-K direto:
heapq.nlargest(3, nums)
heapq.nsmallest(3, nums, key=lambda x: x[1])
```

## enumerate e zip

```python
for i, valor in enumerate(nums): ...        # índice + valor
for i, valor in enumerate(nums, start=1): ...
for a, b in zip(lista1, lista2): ...        # para no menor
dict(zip(chaves, valores))
list(zip(*matriz))                          # transposta
```

## f-strings e utilidades

```python
f"resultado: {x}"
f"{valor:.2f}"           # 2 casas decimais
f"{n:b}"                 # binário

float("inf"), float("-inf")   # sentinelas para min/max
a, b = b, a                   # swap
divmod(17, 5)                 # (3, 2) — quociente e resto
abs(-3), min(a, b), max(nums), sum(nums)
ord("a"), chr(97)             # caractere <-> código
s.isalnum(), s.isdigit(), s.lower()
"".join(partes)               # construir string — não concatene em loop
```
