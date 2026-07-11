# TypeScript essencial para algoritmos

Referência rápida do que mais aparece resolvendo problemas estilo LeetCode em TypeScript/JavaScript.

## Arrays

```typescript
const arr = [3, 1, 2];

arr.push(4);          // adiciona no fim — O(1)
arr.pop();            // remove do fim — O(1)
arr.shift();          // remove do início — O(n)!
arr.unshift(0);       // adiciona no início — O(n)!
arr.slice(1, 3);      // cópia [início, fim) — não muta
arr.splice(1, 2);     // remove/insere no lugar — muta, O(n)
arr.indexOf(2);       // índice ou -1 — O(n)
arr.includes(2);      // boolean — O(n)
arr.reverse();        // inverte NO LUGAR
arr.join('-');        // "3-1-2"
```

### Criação e inicialização

```typescript
new Array(5).fill(0);                       // [0, 0, 0, 0, 0]
Array.from({ length: 5 }, (_, i) => i * 2); // [0, 2, 4, 6, 8]
Array.from({ length: 3 }, () => []);        // matriz de listas SEM referência compartilhada
[...'abc'];                                 // ['a', 'b', 'c'] — string para array
```

⚠️ Nunca use `new Array(3).fill([])` — todas as posições compartilham o MESMO array.

### map / filter / reduce / sort

```typescript
[1, 2, 3].map((x) => x * 2);            // [2, 4, 6]
[1, 2, 3].filter((x) => x % 2 === 1);   // [1, 3]
[1, 2, 3].reduce((acc, x) => acc + x, 0); // 6
[1, 2, 3].every((x) => x > 0);          // true
[1, 2, 3].some((x) => x > 2);           // true
[1, 2, 3].find((x) => x > 1);           // 2 (ou undefined)
[1, 2, 3].findIndex((x) => x > 1);      // 1 (ou -1)
```

### Sort — a pegadinha clássica

```typescript
[10, 9, 1].sort();               // [1, 10, 9] — ordena como STRING!
[10, 9, 1].sort((a, b) => a - b); // [1, 9, 10] — crescente
[10, 9, 1].sort((a, b) => b - a); // [10, 9, 1] — decrescente
palavras.sort((a, b) => a.localeCompare(b)); // strings
pares.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // por múltiplos critérios

const copia = [...arr].sort((a, b) => a - b); // sort muta — copie antes se precisar
```

## Map e Set

```typescript
const mapa = new Map<number, number>();
mapa.set(1, 10);
mapa.get(1);            // 10 (ou undefined)
mapa.has(1);            // true
mapa.delete(1);
mapa.size;
for (const [chave, valor] of mapa) { /* ... */ }

// Idioma de contagem:
mapa.set(x, (mapa.get(x) ?? 0) + 1);

const conjunto = new Set<number>([1, 2, 2]); // {1, 2}
conjunto.add(3);
conjunto.has(2);        // true
conjunto.delete(2);
[...conjunto];          // Set -> array
```

Use `Map`/`Set` em vez de objetos quando as chaves não são strings ou quando precisar de `size`/iteração na ordem de inserção.

## Strings

```typescript
s.length;
s[0];                    // acesso por índice (leitura)
s.slice(1, 3);           // substring [1, 3)
s.split(' ');            // string -> array
s.toLowerCase();  s.toUpperCase();
s.charCodeAt(0);         // código do caractere
String.fromCharCode(97); // 'a'
s.repeat(3);
s.trim();
s.startsWith('ab');  s.endsWith('yz');
s.padStart(5, '0');      // "00abc"
```

Strings são **imutáveis**: para construir uma, acumule num array e faça `join('')` no final (concatenar num loop é O(n²) em teoria).

## Desestruturação e spread

```typescript
const [primeiro, segundo, ...resto] = [1, 2, 3, 4];
const { nome, idade } = pessoa;
[a, b] = [b, a];               // swap sem variável temporária
const copia = [...arr];        // cópia rasa
const uniao = [...a, ...b];
Math.max(...arr);              // maior elemento (cuidado com arrays enormes)
```

## Loops idiomáticos

```typescript
// 1) for..of com índice quando necessário
for (const [i, valor] of arr.entries()) {
  console.log(i, valor);
}

// 2) for clássico quando precisa controlar o índice (dois ponteiros, janelas)
for (let i = 0, j = arr.length - 1; i < j; i++, j--) {
  // ...
}
```

## Truques comuns em algoritmos

```typescript
Math.floor(a / b);              // divisão inteira
a % b;                          // resto (negativo se a < 0! use ((a % b) + b) % b)
Number.MAX_SAFE_INTEGER;        // "infinito" inteiro seguro
Infinity; -Infinity;            // sentinelas para min/max
(esq + dir) >> 1;               // meio (inteiros pequenos)
Number.isInteger(x);
parseInt('42', 10);  Number('42');
x.toString(2);                  // binário — útil em bit manipulation
JSON.stringify(matriz);         // chave composta rápida p/ Map
```
