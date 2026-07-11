# Referência completa de TypeScript

TypeScript = JavaScript + sistema de tipos estático. Esta referência cobre o sistema de tipos; para o runtime (arrays, objetos, async...), veja a **referência de JavaScript** — tudo de lá vale aqui.

## Tipos básicos e anotações

```typescript
let n: number = 42;          // number cobre int e float
let s: string = "oi";
let b: boolean = true;
let big: bigint = 42n;
let nada: null = null;
let indef: undefined = undefined;

let qualquer: any;           // desliga o type-checking — último recurso
let seguro: unknown;         // "any seguro": precisa estreitar antes de usar
function falha(): never {    // nunca retorna (throw / loop infinito)
  throw new Error();
}
function semRetorno(): void {}
```

Na prática, deixe a **inferência** trabalhar: `const x = 42` já é `number` (aliás, o literal `42` — const infere o tipo mais estreito).

## Arrays, tuplas e objetos

```typescript
const nums: number[] = [1, 2, 3];
const nomes: Array<string> = ["a"];        // sinônimo
const matriz: number[][] = [[1], [2]];
const misto: (number | string)[] = [1, "a"];
const somenteLeitura: readonly number[] = [1, 2];  // sem push/sort/etc.

// Tupla: tamanho e tipos fixos por posição
const par: [number, string] = [1, "um"];
const [id, nome] = par;                     // desestruturação tipada
type Entrada = [input: unknown[], expected: unknown];  // tuplas nomeadas

// Objetos
const ponto: { x: number; y: number; z?: number } = { x: 1, y: 2 };  // z opcional
const congelado: { readonly id: number } = { id: 1 };
```

## Union, intersection e literais

```typescript
type Id = number | string;                 // union: um OU outro
type Completo = Base & Extra;              // intersection: os dois juntos

// Tipos literais — valores exatos como tipo:
type Dificuldade = "easy" | "medium" | "hard";
type Dado = 1 | 2 | 3 | 4 | 5 | 6;

// as const: congela e infere literais
const config = { modo: "dark", tamanho: 4 } as const;
// config.modo tem tipo "dark", não string
const slugs = ["two-pointers", "hashmap"] as const;
type Slug = (typeof slugs)[number];        // "two-pointers" | "hashmap"
```

## type vs interface

```typescript
type Ponto = { x: number; y: number };     // alias: qualquer tipo (unions, tuplas...)

interface Animal {                          // só formas de objeto; extensível
  nome: string;
  falar(): string;
}
interface Cachorro extends Animal {
  raca: string;
}
```

Regra prática: `type` para unions, tuplas e composições; `interface` para contratos de objeto que podem ser estendidos. Nos casos comuns, são intercambiáveis — escolha um estilo e seja consistente.

## Funções

```typescript
function soma(a: number, b: number): number { return a + b; }
const dobro = (x: number): number => x * 2;

function log(msg: string, nivel?: string): void {}          // parâmetro opcional
function padrao(x: number, base = 10): number { return x; } // default infere tipo
function junta(...partes: string[]): string { return partes.join(""); }

// Tipo de função
type Comparador<T> = (a: T, b: T) => number;
const porValor: Comparador<number> = (a, b) => a - b;

// Sobrecargas (assinaturas múltiplas)
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number) { return typeof x === "string" ? Number(x) : String(x); }
```

## Narrowing (estreitamento)

O compilador refina o tipo conforme o fluxo do código:

```typescript
function processa(x: string | number | null) {
  if (x === null) return;            // daqui pra baixo: string | number
  if (typeof x === "string") {
    x.toUpperCase();                 // string
  } else {
    x.toFixed(2);                    // number
  }
}

if (Array.isArray(v)) {}             // narrowing de array
if (v instanceof Date) {}            // narrowing por classe
if ("prop" in obj) {}                // narrowing por propriedade

// Discriminated union — o padrão mais útil:
type Resultado =
  | { status: "ok"; valor: number }
  | { status: "erro"; mensagem: string };

function trata(r: Resultado) {
  if (r.status === "ok") r.valor;    // TS sabe qual variante é
  else r.mensagem;
}

// Type guard personalizado
function ehString(x: unknown): x is string {
  return typeof x === "string";
}
```

## Genéricos

```typescript
function primeiro<T>(arr: T[]): T | undefined {
  return arr[0];
}
primeiro([1, 2]);          // T inferido como number
primeiro<string>(["a"]);   // ou explícito

// Constraint: T precisa ter certa forma
function maiorPor<T extends { valor: number }>(itens: T[]): T {
  return itens.reduce((a, b) => (a.valor >= b.valor ? a : b));
}

// Vários parâmetros e defaults
function mapear<T, U = T>(arr: T[], fn: (x: T) => U): U[] {
  return arr.map(fn);
}

interface Pilha<T> {
  push(x: T): void;
  pop(): T | undefined;
}

// keyof + genéricos: acesso seguro por chave
function pega<T, K extends keyof T>(obj: T, chave: K): T[K] {
  return obj[chave];
}
```

## Utility types (os que você vai usar)

```typescript
interface Usuario { id: number; nome: string; email?: string }

Partial<Usuario>;             // tudo opcional
Required<Usuario>;            // tudo obrigatório
Readonly<Usuario>;            // tudo readonly
Pick<Usuario, "id" | "nome">; // só essas chaves
Omit<Usuario, "email">;       // todas menos essas
Record<string, number>;       // { [chave: string]: number }
Record<Dificuldade, string>;  // exige TODAS as chaves da union

type T1 = NonNullable<string | null>;        // string
type T2 = ReturnType<typeof minhaFuncao>;    // tipo de retorno
type T3 = Parameters<typeof minhaFuncao>;    // tupla dos parâmetros
type T4 = Awaited<Promise<number>>;          // number
Exclude<"a" | "b" | "c", "a">;               // "b" | "c"
Extract<string | number, string>;            // string
```

## Operadores de tipo

```typescript
type Chaves = keyof Usuario;            // "id" | "nome" | "email"
type TipoDoValor = Usuario["nome"];     // string (indexed access)
type DoValor = typeof algumaConstante;  // tipo a partir de um VALOR
type Elemento = (typeof arr)[number];   // tipo dos itens de um array

// Mapped type: transforma cada chave
type Opcional<T> = { [K in keyof T]?: T[K] };

// Conditional type: if/else de tipos
type NaoNulo<T> = T extends null | undefined ? never : T;

// Template literal types
type Rota = `/exercicio/${string}`;
```

## Asserções e escape hatches

```typescript
valor as string;              // asserção: "confia em mim" (não converte nada!)
valor!;                       // non-null: remove null/undefined do tipo
valor as unknown as Outro;    // double assertion — cheiro de problema

// satisfies: valida contra um tipo SEM alargar a inferência
const cores = {
  primaria: "#3b82f6",
  erro: "#ef4444",
} satisfies Record<string, string>;
cores.primaria;               // ainda sabe que a chave existe

// @ts-expect-error — suprime UMA linha e avisa se ficar obsoleto (melhor que @ts-ignore)
```

Use asserções apenas na fronteira com dados externos (JSON, APIs de terceiros) — dentro do seu código, prefira narrowing.

## Classes com tipos

```typescript
class Fila<T> {
  private itens: T[] = [];          // private/protected/public
  readonly criadaEm = Date.now();

  constructor(public nome: string) {}  // parameter property: declara e atribui

  enfileirar(x: T): this {          // retorna o próprio tipo (encadeável)
    this.itens.push(x);
    return this;
  }
}

interface Serializavel { serializar(): string }
class Config implements Serializavel {
  serializar() { return "{}"; }
}

abstract class Forma {
  abstract area(): number;          // subclasses são obrigadas a implementar
}
```

`private` do TS é só em tempo de compilação; `#campo` (JS) é privacidade real em runtime.

## Enums — e por que preferir unions

```typescript
enum Direcao { Cima, Baixo }        // gera código em runtime
const enum Rapida { A, B }          // inlined, sem runtime

// Alternativa moderna (preferida na maioria dos códigos):
const Direcoes = { Cima: "cima", Baixo: "baixo" } as const;
type Direcao2 = (typeof Direcoes)[keyof typeof Direcoes];  // "cima" | "baixo"
```

## Config essencial (tsconfig)

```jsonc
{
  "compilerOptions": {
    "strict": true,              // liga TODAS as checagens — inegociável
    // strict inclui: strictNullChecks (null não passa despercebido),
    // noImplicitAny (parâmetros sem tipo viram erro), etc.
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## TypeScript em algoritmos — receitas

```typescript
const mapa = new Map<number, number>();       // sempre parametrize Map/Set
const conjunto = new Set<string>();
const grade: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

// Map.get devolve V | undefined — trate:
const v = mapa.get(chave) ?? 0;
const g = mapa.get(chave);
if (g !== undefined) { /* usa g */ }

// pop() em array devolve T | undefined; se o invariante garante não-vazio:
const topo = pilha.pop()!;

// Dicionário por união de chaves conhecidas:
const custo: Record<"easy" | "medium" | "hard", number> = { easy: 1, medium: 2, hard: 3 };
```
