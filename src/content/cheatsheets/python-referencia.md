# Referência completa de Python

A linguagem inteira que importa para resolver problemas — do básico às partes da stdlib que aparecem em toda entrevista.

## Tipos e variáveis

```python
n = 42          # int — precisão ARBITRÁRIA (sem overflow!)
f = 3.14        # float
b = True        # bool (subclasse de int: True + True == 2)
s = "texto"     # str
nada = None     # ausência de valor

type(x)         # tipo do valor
isinstance(x, int)          # checagem de tipo (aceita tupla de tipos)
int("42"), float("3.1"), str(99), bool(0), list("abc")

# Anotações de tipo (opcionais, não verificadas em runtime):
def soma(a: int, b: int) -> int: ...
valores: list[int] = []
talvez: int | None = None
```

## Operadores

```python
7 / 2      # 3.5  — divisão SEMPRE float
7 // 2     # 3    — divisão inteira (floor: -7 // 2 == -4!)
7 % 2      # 1    — módulo tem o sinal do DIVISOR: -7 % 3 == 2
2 ** 10    # 1024 — potência
divmod(7, 2)   # (3, 1)

1 < x < 10             # comparação encadeada!
a == b                 # igualdade de VALOR (funciona para listas, dicts...)
a is b                 # mesma identidade (use só para None: x is None)
and, or, not           # curto-circuito; retornam o operando, não bool

if (n := len(dados)) > 10:   # walrus: atribui e usa na expressão
    print(n)
```

## Strings

Imutáveis — todo método retorna uma nova string.

```python
len(s);  s[0];  s[-1]              # índice negativo = do fim
s[1:4];  s[::-1]                   # slicing / reversa
s.upper();  s.lower();  s.title();  s.capitalize()
s.strip();  s.lstrip();  s.rstrip()          # tira espaços (ou chars dados)
s.split(",");  s.split()                     # split() separa por qualquer espaço
s.splitlines()
",".join(lista)                              # inverso do split
s.replace("a", "b")                          # todas as ocorrências
s.find("x")                                  # índice ou -1 (index() lança erro)
s.count("a")
s.startswith("ab");  s.endswith("yz")
s.isdigit();  s.isalpha();  s.isalnum();  s.islower()
s.zfill(5)                                   # "00042"
ord("a"), chr(97)                            # caractere <-> código

f"{valor}"                # f-string
f"{valor:.2f}"            # 2 casas decimais
f"{n:05d}"                # zero-padded
f"{n:b}"  f"{n:x}"        # binário / hex
f"{x=}"                   # debug: imprime "x=42"
```

## Listas

```python
arr.append(x)          # fim — O(1)
arr.pop()              # remove do fim — O(1)
arr.pop(0)             # início — O(n)! use deque
arr.insert(i, x)       # O(n)
arr.remove(x)          # remove a 1ª ocorrência por VALOR — O(n)
arr.extend(outra);  arr + outra;  arr * 3
arr.index(x)           # ValueError se não existir
x in arr               # O(n)
arr.count(x)
arr.reverse();  reversed(arr)      # no lugar / iterador
arr.clear()
arr.copy();  arr[:]                # cópia rasa
import copy; copy.deepcopy(arr)    # cópia profunda

# Ordenação
arr.sort()                         # no lugar
sorted(arr)                        # cópia
arr.sort(reverse=True)
arr.sort(key=len)
arr.sort(key=lambda p: (p[0], -p[1]))   # múltiplos critérios com tupla

min(arr), max(arr), sum(arr)
min(pares, key=lambda p: p[1])
```

## Tuplas

```python
t = (1, "a")           # imutável, hashable (pode ser chave de dict!)
x, y = t               # unpacking
a, *meio, z = [1, 2, 3, 4]      # a=1, meio=[2,3], z=4
solo = (42,)           # vírgula obrigatória em tupla de 1

from collections import namedtuple
Ponto = namedtuple("Ponto", ["x", "y"])
p = Ponto(1, 2); p.x
```

## Dicionários

```python
d = {"a": 1}
d["a"];  d["z"]                  # KeyError se não existir
d.get("z");  d.get("z", 0)       # None / default, sem erro
d["b"] = 2
"a" in d                         # O(1)
d.pop("a");  d.pop("z", None)
d.setdefault("k", []).append(x)  # cria se não existir e devolve
del d["a"]
len(d)

d.keys();  d.values();  d.items()
for chave, valor in d.items(): ...

{**a, **b};  a | b               # merge (b ganha)
d.update(outro)

# Chaves precisam ser hashable: str, int, tupla ok; lista NÃO (use tuple(lista))
```

Dicts mantêm a **ordem de inserção** (Python 3.7+).

## Sets

```python
s = {1, 2, 3};  set()            # {} vazio é DICT, não set!
s.add(x);  s.discard(x)          # discard não lança erro; remove lança
x in s                           # O(1)

a | b     # união            a & b    # interseção
a - b     # diferença        a ^ b    # diferença simétrica
a <= b    # subconjunto?
set(arr)                          # dedupe
frozenset(arr)                    # set imutável (pode ir em dict/set)
```

## Controle de fluxo

```python
if x > 0:
    ...
elif x < 0:
    ...
else:
    ...

resultado = "par" if n % 2 == 0 else "ímpar"    # ternário

for i in range(5): ...            # 0..4
for i in range(2, 10, 3): ...     # 2, 5, 8
for i in range(n - 1, -1, -1): ...  # n-1..0 (de trás pra frente)
for i, x in enumerate(arr): ...
for a, b in zip(xs, ys): ...      # para no menor; zip(..., strict=True) valida

while cond:
    ...
break;  continue

for x in arr:
    if achou(x):
        break
else:
    ...  # roda só se o for NÃO deu break

match comando:                    # 3.10+: pattern matching
    case "sair":
        ...
    case ["mover", direcao]:
        ...
    case _:
        ...
```

## Comprehensions

```python
[x * 2 for x in nums]
[x for x in nums if x > 0]
[a if a > 0 else 0 for a in nums]        # if/else vai ANTES do for
[(i, j) for i in range(3) for j in range(3)]   # aninhado
{x: x ** 2 for x in range(5)}            # dict
{c.lower() for c in s}                   # set
(x * x for x in nums)                    # generator — lazy, sem lista
sum(x for x in nums if x % 2 == 0)
any(x > 0 for x in nums);  all(x > 0 for x in nums)
```

## Funções

```python
def f(a, b=10, *args, **kwargs):
    """Docstring."""
    return a + b
# args = tupla dos posicionais extras; kwargs = dict dos nomeados extras

f(1);  f(1, 2);  f(b=5, a=1);  f(*lista);  f(**dicionario)

def g(a, /, b, *, c):        # a: só posicional; c: só nomeado
    ...

quadrado = lambda x: x * x   # uma expressão só

# ⚠️ Default mutável é compartilhado entre chamadas:
def errado(x, acc=[]): ...          # BUG clássico
def certo(x, acc=None):
    if acc is None:
        acc = []

# Escopo: para reatribuir variável de fora, declare
def externa():
    total = 0
    def interna():
        nonlocal total     # (global para módulo)
        total += 1
```

## Classes

```python
from dataclasses import dataclass, field

@dataclass
class Ponto:                     # gera __init__, __repr__, __eq__
    x: int
    y: int = 0
    tags: list = field(default_factory=list)

class Pilha:
    def __init__(self):
        self._itens = []         # _prefixo = "privado" por convenção

    def push(self, x):
        self._itens.append(x)

    def __len__(self):           # len(pilha)
        return len(self._itens)

    def __repr__(self):
        return f"Pilha({self._itens})"

    @property
    def topo(self):              # acesso como atributo: pilha.topo
        return self._itens[-1]

    @staticmethod
    def util(): ...
    @classmethod
    def vazia(cls): return cls()

class PilhaLimitada(Pilha):      # herança
    def __init__(self, limite):
        super().__init__()
        self.limite = limite
```

Dunders úteis: `__eq__`, `__hash__`, `__lt__` (habilita sort), `__iter__`, `__getitem__`, `__contains__` (`in`).

## Exceções

```python
try:
    x = int(texto)
except ValueError:
    ...
except (TypeError, KeyError) as e:
    print(e)
except Exception:
    ...                # pega quase tudo — use com parcimônia
else:
    ...                # roda se NÃO houve exceção
finally:
    ...                # roda sempre

raise ValueError("mensagem")
raise                          # re-lança a atual

class MeuErro(Exception): ...
```

Comuns: `ValueError`, `TypeError`, `KeyError`, `IndexError`, `ZeroDivisionError`, `StopIteration`, `RecursionError` (limite ~1000 — `sys.setrecursionlimit` se precisar).

## Iteradores e geradores

```python
def contador(n):
    i = 0
    while i < n:
        yield i          # pausa aqui e devolve; retoma na próxima iteração
        i += 1

list(contador(3))        # [0, 1, 2]
next(it);  next(it, None)          # avança manualmente (default evita StopIteration)
iter(arr)

# Consumo único! Um gerador esgotado não reinicia.
```

## stdlib para algoritmos

```python
from collections import Counter, deque, defaultdict, OrderedDict
Counter(arr).most_common(k)
deque(maxlen=5)                    # janela deslizante automática

import heapq                       # min-heap sobre lista (negue p/ max)
heapq.heapify(h); heapq.heappush(h, x); heapq.heappop(h)
heapq.nlargest(k, arr); heapq.nsmallest(k, arr, key=...)

import bisect                      # busca binária pronta em lista ordenada
bisect.bisect_left(arr, x)         # 1º índice onde x entra
bisect.bisect_right(arr, x)
bisect.insort(arr, x)              # insere mantendo ordem — O(n)

from itertools import permutations, combinations, product, accumulate, groupby, chain, pairwise
list(combinations([1,2,3], 2))     # [(1,2), (1,3), (2,3)]
list(accumulate([1,2,3]))          # [1, 3, 6] — soma de prefixos
list(pairwise([1,2,3]))            # [(1,2), (2,3)]

from functools import cache, lru_cache, reduce, cmp_to_key
@cache                             # memoização automática (DP top-down)
def fib(n): ...

import math
math.inf, math.ceil, math.floor, math.sqrt, math.isqrt, math.gcd, math.lcm, math.log2, math.comb, math.factorial

import re                          # regex rápido
re.findall(r"\d+", s); re.sub(r"\s+", " ", s); re.match(...); re.search(...)

import json
json.dumps(obj); json.loads(texto)
```

## Armadilhas clássicas

```python
[[]] * 3                    # 3 referências à MESMA lista → [[] for _ in range(3)]
def f(x, acc=[]): ...       # default mutável compartilhado
b = a                       # listas/dicts: copia a REFERÊNCIA → a[:] ou .copy()
-7 // 2 == -4               # floor division arredonda para BAIXO, não para zero
0.1 + 0.2 != 0.3            # float IEEE 754 (use math.isclose)
"1" + 1                     # TypeError — Python não coage tipos
x is 1000                   # is compara identidade, não valor — use ==
for x in arr: arr.remove(x) # nunca mutar a lista que está iterando
d[chave_lista]              # TypeError: lista não é hashable → tuple(...)
```
