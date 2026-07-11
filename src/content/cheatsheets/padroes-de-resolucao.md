# Padrões de resolução

Os 14 padrões que cobrem a grande maioria dos problemas de entrevista. Para cada um: **quando usar** (sinais no enunciado), template nas duas linguagens e problemas clássicos para praticar.

---

## Dois Ponteiros (two-pointers)

**Quando usar:** array/string **ordenado** ou comparável pelas pontas; "par que soma X"; palíndromos; remover duplicatas no lugar; "sem espaço extra".

```typescript
let esq = 0, dir = arr.length - 1;
while (esq < dir) {
  const soma = arr[esq] + arr[dir];
  if (soma === alvo) return [esq, dir];
  if (soma < alvo) esq++;
  else dir--;
}
```

```python
esq, dir = 0, len(arr) - 1
while esq < dir:
    soma = arr[esq] + arr[dir]
    if soma == alvo:
        return [esq, dir]
    if soma < alvo:
        esq += 1
    else:
        dir -= 1
```

**Clássicos:** Valid Palindrome, Container With Most Water, 3Sum.

---

## Janela Deslizante (sliding-window)

**Quando usar:** "maior/menor **substring/subarray contíguo** que satisfaz X"; "máximo em janelas de tamanho k". A janela cresce pela direita e encolhe pela esquerda quando viola a condição.

```typescript
const janela = new Map<string, number>();
let inicio = 0, melhor = 0;
for (let fim = 0; fim < s.length; fim++) {
  janela.set(s[fim], (janela.get(s[fim]) ?? 0) + 1);
  while (/* janela viola a condição */) {
    janela.set(s[inicio], janela.get(s[inicio])! - 1);
    inicio++;
  }
  melhor = Math.max(melhor, fim - inicio + 1);
}
```

```python
janela = {}
inicio = melhor = 0
for fim, c in enumerate(s):
    janela[c] = janela.get(c, 0) + 1
    while janela_viola_condicao():
        janela[s[inicio]] -= 1
        inicio += 1
    melhor = max(melhor, fim - inicio + 1)
```

**Clássicos:** Longest Substring Without Repeating Characters, Best Time to Buy and Sell Stock, Minimum Window Substring.

---

## Hash Map (hashmap)

**Quando usar:** "já vi este valor?"; complementos (Two Sum); frequências; agrupar por chave; trocar O(n²) por O(n) pagando memória.

```typescript
const seen = new Map<number, number>();
for (let i = 0; i < nums.length; i++) {
  const complemento = alvo - nums[i];
  if (seen.has(complemento)) return [seen.get(complemento)!, i];
  seen.set(nums[i], i);
}
```

```python
seen = {}
for i, n in enumerate(nums):
    if alvo - n in seen:
        return [seen[alvo - n], i]
    seen[n] = i
```

**Clássicos:** Two Sum, Group Anagrams, Top K Frequent Elements.

---

## Pilha (stack)

**Quando usar:** pareamento aninhado (parênteses); "próximo elemento maior/menor" (pilha monotônica); desfazer/voltar; avaliar expressões.

```typescript
const pilha: number[] = []; // índices, decrescente
for (let i = 0; i < arr.length; i++) {
  while (pilha.length && arr[i] > arr[pilha[pilha.length - 1]]) {
    const j = pilha.pop()!;
    resposta[j] = i - j; // i é o "próximo maior" de j
  }
  pilha.push(i);
}
```

```python
pilha = []  # índices, decrescente
for i, x in enumerate(arr):
    while pilha and x > arr[pilha[-1]]:
        j = pilha.pop()
        resposta[j] = i - j  # i é o "próximo maior" de j
    pilha.append(i)
```

**Clássicos:** Valid Parentheses, Daily Temperatures, Min Stack.

---

## Busca Binária (binary-search)

**Quando usar:** dados **ordenados**; "O(log n)"; ou resposta **monotônica** ("qual o menor X que funciona?" — busca binária na resposta).

```typescript
let esq = 0, dir = nums.length - 1;
while (esq <= dir) {
  const meio = esq + Math.floor((dir - esq) / 2);
  if (nums[meio] === alvo) return meio;
  if (nums[meio] < alvo) esq = meio + 1;
  else dir = meio - 1;
}
return -1;
```

```python
esq, dir = 0, len(nums) - 1
while esq <= dir:
    meio = (esq + dir) // 2
    if nums[meio] == alvo:
        return meio
    if nums[meio] < alvo:
        esq = meio + 1
    else:
        dir = meio - 1
return -1
```

**Clássicos:** Binary Search, Search in Rotated Sorted Array, Koko Eating Bananas.

---

## Lista Ligada (linked-list)

**Quando usar:** o próprio tipo `ListNode`; reversão; detecção de ciclo (ponteiros rápido/lento); achar o meio; merge.

```typescript
// Reversão iterativa
let anterior: ListNode | null = null, atual = head;
while (atual) {
  const proximo = atual.next;
  atual.next = anterior;
  anterior = atual;
  atual = proximo;
}
return anterior;
```

```python
# Rápido/lento: meio da lista ou detecção de ciclo
lento = rapido = head
while rapido and rapido.next:
    lento = lento.next
    rapido = rapido.next.next
    # se lento == rapido: há ciclo
```

**Clássicos:** Reverse Linked List, Linked List Cycle, Merge Two Sorted Lists.

---

## Árvores BFS/DFS (trees-bfs-dfs)

**Quando usar:** qualquer árvore. DFS (recursão) para caminhos, alturas e validações; BFS (fila) para nível a nível e "menor profundidade".

```typescript
// DFS recursivo
function altura(no: TreeNode | null): number {
  if (!no) return 0;
  return 1 + Math.max(altura(no.left), altura(no.right));
}
```

```python
# BFS por níveis
from collections import deque
fila = deque([raiz])
while fila:
    for _ in range(len(fila)):  # um nível por vez
        no = fila.popleft()
        if no.left: fila.append(no.left)
        if no.right: fila.append(no.right)
```

**Clássicos:** Maximum Depth of Binary Tree, Binary Tree Level Order Traversal, Validate BST.

---

## Heap (heap)

**Quando usar:** "k maiores/menores"; "mediana em stream"; merge de k listas; sempre que precisa repetidamente do mínimo/máximo atual.

```typescript
// JS não tem heap nativo: mantenha um array ordenado para k pequeno,
// ou implemente/importe uma MinHeap com push/pop O(log n).
```

```python
import heapq
heap = []
for x in nums:
    heapq.heappush(heap, x)
    if len(heap) > k:
        heapq.heappop(heap)  # mantém só os k maiores
# heap[0] é o k-ésimo maior
```

**Clássicos:** Kth Largest Element, Top K Frequent Elements, Find Median from Data Stream.

---

## Backtracking (backtracking)

**Quando usar:** "todas as combinações/permutações/subconjuntos"; sudoku/N-rainhas; escolher → recursar → **desfazer**.

```typescript
function backtrack(atual: number[], inicio: number) {
  resultado.push([...atual]);
  for (let i = inicio; i < nums.length; i++) {
    atual.push(nums[i]);       // escolhe
    backtrack(atual, i + 1);   // explora
    atual.pop();               // desfaz
  }
}
```

```python
def backtrack(atual, inicio):
    resultado.append(atual[:])
    for i in range(inicio, len(nums)):
        atual.append(nums[i])      # escolhe
        backtrack(atual, i + 1)    # explora
        atual.pop()                # desfaz
```

**Clássicos:** Subsets, Permutations, Combination Sum.

---

## Programação Dinâmica (dynamic-programming)

**Quando usar:** "quantas maneiras"; "máximo/mínimo custo até n"; decisões em sequência com subproblemas repetidos; recursão que explode em 2^n.

```typescript
// Bottom-up 1D (ex.: Climbing Stairs / Fibonacci)
const dp = new Array(n + 1).fill(0);
dp[0] = 1; dp[1] = 1;
for (let i = 2; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}
```

```python
# Top-down com memoização
from functools import cache

@cache
def dp(i):
    if i <= 1:
        return 1
    return dp(i - 1) + dp(i - 2)
```

**Clássicos:** Climbing Stairs, House Robber, Coin Change.

---

## Grafos (graphs)

**Quando usar:** relações entre entidades (rede, mapa, pré-requisitos); grades 2D ("ilhas"); "existe caminho?"; ordenação topológica.

```typescript
// DFS em grade (flood fill)
function dfs(l: number, c: number) {
  if (l < 0 || c < 0 || l >= L || c >= C || grade[l][c] !== '1') return;
  grade[l][c] = '0'; // marca visitado
  dfs(l + 1, c); dfs(l - 1, c); dfs(l, c + 1); dfs(l, c - 1);
}
```

```python
# BFS a partir de um nó
from collections import deque
visitados = {origem}
fila = deque([origem])
while fila:
    no = fila.popleft()
    for vizinho in grafo[no]:
        if vizinho not in visitados:
            visitados.add(vizinho)
            fila.append(vizinho)
```

**Clássicos:** Number of Islands, Clone Graph, Course Schedule.

---

## Intervalos (intervals)

**Quando usar:** pares `[início, fim]`; "merge", "sobreposição", "salas de reunião", agendamento.

```typescript
intervalos.sort((a, b) => a[0] - b[0]);
const resultado = [intervalos[0]];
for (const [ini, fim] of intervalos.slice(1)) {
  const ultimo = resultado[resultado.length - 1];
  if (ini <= ultimo[1]) ultimo[1] = Math.max(ultimo[1], fim); // sobrepõe: funde
  else resultado.push([ini, fim]);
}
```

```python
intervalos.sort()
resultado = [intervalos[0]]
for ini, fim in intervalos[1:]:
    if ini <= resultado[-1][1]:
        resultado[-1][1] = max(resultado[-1][1], fim)  # sobrepõe: funde
    else:
        resultado.append([ini, fim])
```

**Clássicos:** Merge Intervals, Insert Interval, Meeting Rooms.

---

## Guloso (greedy)

**Quando usar:** a escolha localmente ótima leva ao ótimo global (precisa de argumento!); maximizar quantidade de tarefas; saltos; troco canônico. Geralmente começa ordenando.

```typescript
// Jump Game: alcance máximo
let alcance = 0;
for (let i = 0; i < nums.length; i++) {
  if (i > alcance) return false; // não chego aqui
  alcance = Math.max(alcance, i + nums[i]);
}
return true;
```

```python
alcance = 0
for i, salto in enumerate(nums):
    if i > alcance:
        return False  # não chego aqui
    alcance = max(alcance, i + salto)
return True
```

**Clássicos:** Jump Game, Gas Station, Non-overlapping Intervals.

---

## Manipulação de Bits (bit-manipulation)

**Quando usar:** "sem espaço extra"; "aparece uma vez, o resto duas" (XOR); contar bits; conjuntos pequenos como máscara.

```typescript
n & 1;              // é ímpar?
n >> 1;             // divide por 2
n & (n - 1);        // remove o bit 1 mais baixo (conta bits!)
(mask >> i) & 1;    // i-ésimo bit da máscara
a ^= b;             // XOR: x^x = 0, x^0 = x — acha o "solitário"
```

```python
n & 1               # é ímpar?
n >> 1              # divide por 2
n & (n - 1)         # remove o bit 1 mais baixo
bin(n).count("1")   # população de bits
# XOR de todos: elementos em pares se cancelam
from functools import reduce; from operator import xor
sozinho = reduce(xor, nums)
```

**Clássicos:** Single Number, Number of 1 Bits, Counting Bits.
