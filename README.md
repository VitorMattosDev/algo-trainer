# algo-trainer

Plataforma pessoal de estudo de algoritmos para treino de LeetCode: cheatsheets, exercícios com testes automatizados e playground com execução de código em tempo real — **100% client-side**, sem backend, hospedada no GitHub Pages.

- **TypeScript e JavaScript** rodam num Web Worker (TS é transpilado no browser; JS executa direto).
- **Python** roda via [Pyodide](https://pyodide.org) (WebAssembly), carregado sob demanda.
- Progresso salvo no `localStorage` do navegador (com export/import em JSON).

## Rodando localmente

Pré-requisitos: Node 20+ e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

Outros comandos:

```bash
pnpm build      # typecheck + build de produção (dist/)
pnpm preview    # serve o build localmente
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
pnpm validate   # roda as soluções oficiais (TS e Python) contra os test cases
```

> `pnpm validate` usa o Node para as soluções TypeScript e um Python 3 local (comando `python`, configurável via variável `PYTHON`) para as soluções Python.

## Como adicionar um novo exercício

1. **Crie o arquivo** `src/content/exercises/<id>.ts` exportando um objeto `Exercise` (tipo em `src/content/types.ts`):

   ```ts
   import type { Exercise } from '../types';

   export const meuExercicio: Exercise = {
     id: 'meu-exercicio',            // usado na URL /exercicio/<id>
     title: 'Meu Exercício',
     pattern: 'hashmap',             // um dos 14 slugs fixos (src/content/patterns.ts)
     difficulty: 'easy',             // easy | medium | hard
     functionName: 'minhaFuncao',    // função que o runner chama (igual nas 3 linguagens)
     leetcodeUrl: 'https://leetcode.com/problems/...',
     statement: `Enunciado em markdown, em português...`,
     hints: ['dica 1', 'dica 2', 'dica 3'],   // exatamente 3, progressivas
     starterCode: { typescript: `...`, javascript: `...`, python: `...` },
     solution: { typescript: `...`, javascript: `...`, python: `...` },  // comentadas em português
     solutionExplanation: `Abordagem + complexidade Big-O em markdown`,
     testCases: [
       { input: [[1, 2], 3], expected: [0, 1] },       // input = argumentos da função
       { input: [[2, 2], 4], expected: [0, 1], hidden: true },   // caso oculto
       // unordered: true → arrays comparados ignorando ordem (ex.: 3Sum)
     ],
   };
   ```

2. **Registre** no índice `src/content/exercises/index.ts` (import + adicionar ao array `exercises`).
3. Inclua **4–6 test cases visíveis + 2 ocultos** (`hidden: true`).
4. **Valide antes de commitar**: `pnpm validate` precisa passar nas três linguagens.

## Como adicionar uma cheatsheet

1. Crie `src/content/cheatsheets/<slug>.md` (em português; blocos de código com ` ```typescript ` / ` ```python ` ganham syntax highlighting).
2. Registre em `src/content/cheatsheets/index.ts` com `slug`, `title`, `description` e o import `?raw`.

## Como o deploy funciona

Cada push na `main` dispara `.github/workflows/deploy.yml`, que instala as dependências, valida as soluções, roda `pnpm build` e publica `dist/` no GitHub Pages. Para ativar: nas configurações do repositório, em **Pages**, escolha *Source: GitHub Actions*.

Duas decisões tornam o site compatível com o Pages:

- `base: './'` no `vite.config.ts` (assets com caminho relativo);
- `HashRouter` no lugar de `BrowserRouter` (o Pages não reescreve rotas para o `index.html`).

## Decisões técnicas e limitações

- **Transpilação de TS no browser:** usa `ts.transpileModule` do próprio pacote `typescript`, carregado como chunk lazy na primeira execução. Escolhido no lugar do `esbuild-wasm` por ser mais simples (sem download de `.wasm` de ~10 MB via rede) e self-hosted. Observação: `transpileModule` **não faz type-checking** — erros de tipo não são reportados, apenas erros de sintaxe/runtime.
- **Execução de JS/TS:** sempre num Web Worker criado via Blob URL (nunca `eval` na thread principal), com timeout de 5 s; ao estourar, o worker é terminado e um novo é criado na próxima execução. JavaScript puro usa o mesmo worker, sem etapa de transpilação.
- **Timeout do Python:** `pyodide.setInterruptBuffer` exigiria `SharedArrayBuffer`, que depende dos headers COOP/COEP — o GitHub Pages não os envia. Por isso o timeout de 5 s **termina o worker inteiro** e a execução seguinte recarrega o runtime (~10 MB), com loading visível na UI.
- **Ponte JS↔Python:** argumentos e retornos são serializados via JSON; tuplas Python retornadas viram listas na comparação.
- **Monaco Editor:** carregado via CDN pelo loader do `@monaco-editor/react`, mantendo o bundle inicial leve.

## Estrutura

```
src/
  components/   # UI reutilizável
  pages/        # uma página por rota
  runners/      # motor de execução (CodeRunner por linguagem)
  content/
    exercises/  # um arquivo .ts por exercício
    cheatsheets/# arquivos .md em português
  hooks/        # useProgress, useTheme
  lib/          # deepEqual, storage, markdown
scripts/        # validação das soluções oficiais
```
