# Referência completa de JavaScript

A base da linguagem que roda por baixo do TypeScript. Tudo aqui vale nas duas linguagens; a referência de TypeScript cobre o sistema de tipos por cima.

## Tipos e valores

Sete primitivos + objetos:

```javascript
typeof 42;            // "number"  (inteiros e decimais são o mesmo tipo)
typeof 42n;           // "bigint"
typeof "oi";          // "string"
typeof true;          // "boolean"
typeof undefined;     // "undefined"
typeof Symbol();      // "symbol"
typeof null;          // "object"  ← bug histórico, decorar!
typeof [];            // "object"  → use Array.isArray(x)
typeof (() => {});    // "function"
```

### Truthy e falsy

Falsy (só estes!): `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. **Todo o resto é truthy**, incluindo `[]`, `{}` e `"0"`.

### Igualdade e coerção

```javascript
1 == "1";        // true  — coerção implícita, evite
1 === "1";       // false — comparação estrita, use sempre
NaN === NaN;     // false! → use Number.isNaN(x) ou Object.is
null == undefined;   // true (única coerção útil do ==)
[1, 2] === [1, 2];   // false — objetos comparam por REFERÊNCIA
```

### null vs undefined e os operadores de nulidade

```javascript
valor ?? padrao;    // nullish coalescing: padrao só se null/undefined (0 e "" passam!)
valor || padrao;    // OR: padrao para QUALQUER falsy
obj?.prop;          // optional chaining: undefined em vez de erro
obj?.metodo?.();    // chamada opcional
arr?.[0];           // índice opcional
```

## Variáveis e escopo

```javascript
const x = 1;   // padrão: não reatribuível (mas objetos/arrays seguem mutáveis!)
let y = 2;     // reatribuível, escopo de bloco
var z = 3;     // escopo de FUNÇÃO + hoisting — não use
```

- `const arr = []` permite `arr.push(1)` — const protege a **ligação**, não o conteúdo.
- Closures: funções capturam variáveis do escopo onde foram criadas — base de callbacks e memoização.

## Números

```javascript
0.1 + 0.2 === 0.3;          // false! ponto flutuante IEEE 754
Number.EPSILON;              // tolerância para comparar decimais
Number.MAX_SAFE_INTEGER;     // 2^53 - 1 — acima disso, inteiros perdem precisão
Number.isInteger(x);  Number.isNaN(x);  Number.isFinite(x);

Math.floor(3.7);  Math.ceil(3.2);  Math.round(3.5);  Math.trunc(-3.7); // -3 (floor de negativo é -4!)
Math.abs(-5);  Math.sqrt(16);  Math.pow(2, 10);  2 ** 10;
Math.max(1, 2, 3);  Math.min(...arr);
Math.random();               // [0, 1)

parseInt("42px", 10);        // 42 — sempre passe a base
Number("42");                // 42 (Number("") é 0, cuidado)
(255).toString(2);           // "11111111" — qualquer base 2-36
(3.14159).toFixed(2);        // "3.14" (string!)

// Divisão inteira e resto
Math.floor(a / b);
a % b;                       // resto tem o SINAL do dividendo: -7 % 3 === -1
((a % b) + b) % b;           // módulo sempre positivo
```

## Strings

Imutáveis — todo método retorna uma nova string.

```javascript
s.length;  s[0];  s.at(-1);            // at() aceita índice negativo
s.slice(1, 4);  s.slice(-3);           // substring [início, fim)
s.indexOf("x");  s.lastIndexOf("x");   // -1 se não achar
s.includes("abc");  s.startsWith("a");  s.endsWith("z");
s.toUpperCase();  s.toLowerCase();
s.trim();  s.trimStart();  s.trimEnd();
s.replace("a", "b");                   // só a PRIMEIRA ocorrência
s.replaceAll("a", "b");                // todas
s.split(",");  s.split("");            // para array
s.repeat(3);
s.padStart(5, "0");  s.padEnd(5, " ");
s.charCodeAt(0);  String.fromCharCode(97);
s.codePointAt(0);                       // correto p/ emoji/unicode
s.localeCompare(t);                     // -1/0/1 — ordenação de strings

`template ${expr} literal`;             // interpolação e multilinhas
```

## Arrays

### Mutam o array (cuidado!)

```javascript
arr.push(x);       // fim, retorna novo length — O(1)
arr.pop();         // remove do fim, retorna o item — O(1)
arr.unshift(x);    // início — O(n)
arr.shift();       // remove do início — O(n)
arr.splice(i, n, ...itens); // remove n a partir de i e/ou insere — O(n)
arr.sort((a, b) => a - b);  // ORDENA COMO STRING sem comparator!
arr.reverse();
arr.fill(0);  arr.fill(0, 1, 3);
arr.copyWithin(0, 3);
```

### Retornam algo novo (não mutam)

```javascript
arr.slice(1, 3);  arr.slice();          // cópia rasa
arr.concat(outro);  [...a, ...b];
arr.map((x, i) => x * 2);
arr.filter((x) => x > 0);
arr.flat();  arr.flat(Infinity);        // achata níveis
arr.flatMap((x) => [x, x]);
arr.join("-");
// ES2023 — versões imutáveis:
arr.toSorted((a, b) => a - b);  arr.toReversed();  arr.with(i, valor);
```

### Busca e agregação

```javascript
arr.indexOf(x);  arr.includes(x);       // por igualdade estrita
arr.find((x) => x > 2);                 // primeiro item ou undefined
arr.findIndex(fn);  arr.findLast(fn);  arr.findLastIndex(fn);
arr.some(fn);   // algum passa?
arr.every(fn);  // todos passam?
arr.reduce((acc, x) => acc + x, 0);
arr.reduceRight(fn, init);
arr.at(-1);                             // último elemento
```

### Criação

```javascript
Array.from({ length: n }, (_, i) => i);   // [0, 1, ..., n-1]
Array.from("abc");                         // ['a','b','c'] — qualquer iterável
Array.of(1, 2, 3);
new Array(3).fill(0);                      // [0,0,0] — new Array(3) sozinho é "buracos"
Array.isArray(x);
```

## Objetos

```javascript
const obj = { a: 1, [chaveDinamica]: 2, metodo() {}, get calc() { return 1; } };

obj.a;  obj["a"];  obj[variavel];
"a" in obj;                            // inclui herdados
Object.hasOwn(obj, "a");               // só próprios (substitui hasOwnProperty)
delete obj.a;

Object.keys(obj);    // ["a", ...]
Object.values(obj);
Object.entries(obj); // [["a", 1], ...]
Object.fromEntries(pares);             // inverso de entries — útil com Map
Object.assign({}, a, b);  ({ ...a, ...b });   // merge raso
Object.freeze(obj);                    // imutável raso
structuredClone(obj);                  // CÓPIA PROFUNDA nativa
```

Chaves de objeto são sempre strings (ou symbols) — `obj[1]` vira `obj["1"]`. Para chaves de qualquer tipo, use `Map`.

## Funções

```javascript
function nomeada(a, b = 10, ...resto) { return a + b; }  // hoisted
const anonima = function (x) { return x; };
const arrow = (x) => x * 2;            // retorno implícito sem chaves
const arrowObj = () => ({ a: 1 });     // parênteses p/ retornar objeto literal

fn.call(thisArg, a, b);  fn.apply(thisArg, [a, b]);  fn.bind(thisArg);
```

Arrow functions **não têm `this` próprio** (herdam do escopo) — por isso são ideais para callbacks; funções normais têm `this` dinâmico.

## Desestruturação

```javascript
const [a, b, ...resto] = [1, 2, 3, 4];
const [, segundo] = arr;                     // pula posições
const { x, y: renomeado, z = 0 } = obj;      // renomear e default
const { a: { b } } = aninhado;
function f({ nome, idade = 18 }) {}          // em parâmetros
[a, b] = [b, a];                             // swap
for (const [chave, valor] of Object.entries(obj)) {}
```

## Classes

```javascript
class Animal {
  static contagem = 0;         // membro da classe, não da instância
  #segredo = 42;               // campo privado de verdade
  constructor(nome) {
    this.nome = nome;
    Animal.contagem++;
  }
  falar() { return `${this.nome} fala`; }
  get maiusculo() { return this.nome.toUpperCase(); }
}

class Cachorro extends Animal {
  constructor(nome) {
    super(nome);               // obrigatório antes de usar this
  }
  falar() { return super.falar() + " au au"; }
}

new Cachorro("Rex") instanceof Animal;  // true
```

## Map, Set, WeakMap

```javascript
const m = new Map([[chave, valor]]);
m.set(k, v).set(k2, v2);       // encadeável
m.get(k);  m.has(k);  m.delete(k);  m.size;  m.clear();
for (const [k, v] of m) {}
[...m.keys()];  [...m.values()];  [...m.entries()];

const s = new Set([1, 2, 2]);  // {1, 2}
s.add(x);  s.has(x);  s.delete(x);  s.size;
[...new Set(arr)];             // dedupe de array em uma linha
```

- `Map` aceita **qualquer tipo** como chave (objetos inclusive) e itera na ordem de inserção.
- `WeakMap`/`WeakSet`: chaves são objetos e não impedem garbage collection (caches).

## Iteração e geradores

```javascript
for (const x of iteravel) {}          // valores: arrays, strings, Map, Set...
for (const i in obj) {}               // CHAVES de objeto (evite em arrays)
arr.forEach((x, i) => {});            // sem break/continue!
for (const [i, x] of arr.entries()) {}

function* gerador() {
  yield 1;
  yield* [2, 3];                      // delega para outro iterável
}
[...gerador()];                       // [1, 2, 3]
```

## Assíncrono

```javascript
const p = new Promise((resolve, reject) => { /* ... */ });
p.then((v) => ...).catch((e) => ...).finally(() => ...);

async function buscar() {
  try {
    const r = await fetch(url);       // await só em funções async (ou top-level de módulos)
    return await r.json();
  } catch (e) {
    // rejeições viram exceções com await
  }
}

await Promise.all([p1, p2]);          // todas (rejeita na primeira falha)
await Promise.allSettled([p1, p2]);   // todas, com status individual
await Promise.race([p1, p2]);         // a primeira que resolver OU rejeitar
await Promise.any([p1, p2]);          // a primeira que RESOLVER

setTimeout(fn, ms);  clearTimeout(id);
setInterval(fn, ms);  clearInterval(id);
```

## Erros

```javascript
try {
  throw new Error("mensagem");
  // TypeError, RangeError, SyntaxError herdam de Error
} catch (e) {
  e.message;  e.name;  e.stack;
  if (e instanceof RangeError) { /* tratar específico */ }
} finally {
  // roda sempre
}

class MeuErro extends Error {
  constructor(msg) { super(msg); this.name = "MeuErro"; }
}
```

## JSON

```javascript
JSON.stringify(obj);              // undefined, funções e symbols somem!
JSON.stringify(obj, null, 2);     // identado
JSON.parse(texto);                // lança SyntaxError se inválido
JSON.parse(JSON.stringify(o));    // clone profundo "pobre" — prefira structuredClone
```

## Regex em 30 segundos

```javascript
/ab+c/i.test(s);                  // boolean
s.match(/\d+/g);                  // todas as ocorrências (com flag g)
s.match(/(\d+)-(\d+)/);           // grupos: [0]=tudo, [1], [2]...
s.replace(/\s+/g, " ");
[...s.matchAll(/\d+/g)];          // iterador de matches com grupos
```

Classes úteis: `\d` dígito, `\w` alfanumérico, `\s` espaço, `.` qualquer, `^`/`$` âncoras, `*` 0+, `+` 1+, `?` 0-1, `{n,m}` faixa. Flags: `g` global, `i` case-insensitive, `m` multilinha.

## Armadilhas clássicas

```javascript
[10, 1, 2].sort();               // [1, 10, 2] — sort padrão é lexicográfico
0.1 + 0.2;                       // 0.30000000000000004
const b = a;                     // objetos/arrays: copia a REFERÊNCIA
new Array(3);                    // [empty × 3] — map/forEach pulam buracos
"5" + 1;   // "51" (concatena)   "5" - 1;   // 4 (subtrai) — evite misturar
let x = obj.talvez.prop;         // TypeError se talvez for undefined → use ?.
JSON.stringify(new Map());       // "{}" — Map/Set não serializam
parseInt("08");                  // ok hoje, mas sempre passe a base: parseInt("08", 10)
```
