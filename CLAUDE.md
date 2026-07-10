# CLAUDE.md — algo-trainer

Plataforma pessoal de estudo de algoritmos para treino de LeetCode. 100% client-side (SPA estática), deploy no GitHub Pages. **Não existe backend** — qualquer feature que sugira servidor, API própria ou banco de dados está fora do escopo; persistência é sempre via localStorage.

## Comandos

```bash
pnpm dev          # servidor de desenvolvimento
pnpm build        # build de produção (deve passar limpo antes de qualquer commit)
pnpm preview      # testar o build localmente
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

Sempre rodar `pnpm typecheck` e `pnpm build` antes de considerar uma tarefa concluída. Usar **pnpm**, nunca npm ou yarn.

## Stack

- Vite + React 18 + TypeScript (`strict: true`)
- Tailwind CSS (tema escuro por padrão, toggle persistido)
- `@monaco-editor/react` para o editor
- `react-router-dom` com **HashRouter** (obrigatório — GitHub Pages não suporta BrowserRouter)
- Pyodide via CDN, lazy load, instância singleton
- `base: './'` no `vite.config.ts` (não alterar — necessário para GitHub Pages)

## Arquitetura

```
src/
  components/   # componentes reutilizáveis de UI
  pages/        # uma página por rota
  runners/      # motor de execução de código (ver regras abaixo)
  content/
    exercises/  # um arquivo .ts por exercício, tipado como Exercise
    cheatsheets/# arquivos .md em português
  hooks/        # hooks customizados (useProgress, useTheme, etc.)
  lib/          # utilitários puros (deepEqual, storage, markdown)
```

## Regras do motor de execução (`src/runners/`)

Esta é a parte mais sensível do projeto. Regras invioláveis:

1. Código do usuário JS/TS roda **exclusivamente em Web Worker** criado via Blob URL. Nunca usar `eval`, `new Function` ou execução na thread principal.
2. Timeout de 5 s por execução: estourou → `worker.terminate()` → reportar "Time Limit Exceeded". Criar um worker novo para a próxima execução.
3. Pyodide: singleton, carregado apenas na primeira execução Python, com estado de loading visível na UI. Nunca carregar Pyodide no bundle inicial nem em rotas que não usam Python.
4. `console.log` / stdout do usuário devem ser capturados e exibidos no painel de console, nunca vazados para o console do navegador em produção.
5. Toda implementação de linguagem deve seguir a interface comum `CodeRunner` (a abstração existe para permitir adicionar Go futuramente — não acoplar UI a uma linguagem específica).
6. Comparação de resultados de teste: deep equal em `src/lib/deepEqual.ts`. Test cases com `unordered: true` comparam arrays ignorando ordem.

## Regras de conteúdo

- **Todo texto voltado ao usuário é em português brasileiro**: enunciados, dicas, explicações, UI, mensagens de erro do runner. Nomes de funções/variáveis no starter code seguem o padrão do LeetCode em inglês (ex: `twoSum`).
- Todo exercício deve ter: starter code e solução funcionais **nas duas linguagens** (TS e Python), 4-6 test cases visíveis + 2 ocultos (`hidden: true`), exatamente 3 dicas progressivas, explicação com complexidade de tempo e espaço.
- Antes de dar um exercício por pronto, validar que a solução oficial passa em todos os test cases nas duas linguagens.
- Enunciados são reescritos em português, não traduções literais; incluir `leetcodeUrl` apontando para o problema equivalente.
- Padrões (slugs fixos, não renomear): `two-pointers`, `sliding-window`, `hashmap`, `stack`, `binary-search`, `linked-list`, `trees-bfs-dfs`, `heap`, `backtracking`, `dynamic-programming`, `graphs`, `intervals`, `greedy`, `bit-manipulation`.

## Como adicionar um novo exercício

1. Criar `src/content/exercises/<id>.ts` exportando um objeto `Exercise` (tipo em `src/content/types.ts`)
2. Registrar no índice `src/content/exercises/index.ts`
3. O `pattern` deve ser um dos slugs fixos acima
4. Rodar a solução contra os test cases nas duas linguagens antes de commitar

## Persistência (localStorage)

- Prefixo de todas as chaves: `algo-trainer:`
- Por exercício: status (`untouched | attempted | solved`), tentativas, código salvo por linguagem, timestamp de resolução
- Nunca gravar dados fora desse prefixo; export/import de progresso é feito em JSON pela tela de configurações
- Ao mudar o schema de storage, escrever migração — nunca quebrar progresso existente

## Convenções de código

- TypeScript estrito; `any` só na fronteira do runner (dados vindos do worker/Pyodide), sempre isolado e comentado
- Componentes funcionais com hooks; sem class components
- Estado global mínimo — preferir hooks + localStorage; não adicionar Redux/Zustand sem necessidade comprovada
- Não adicionar dependências novas sem justificar; o bundle inicial deve permanecer leve (Pyodide e Monaco já são pesados o suficiente)
- Commits em português, no imperativo, curtos (ex: `Adiciona exercício 3Sum`, `Corrige timeout do runner Python`)

## UI

- Tema escuro padrão estilo VS Code/LeetCode; fonte mono JetBrains Mono para código
- Dificuldade: verde (easy), amarelo (medium), vermelho (hard)
- Tela do exercício: split enunciado/editor em desktop, empilhado em mobile
- Botão "Ver solução" só habilita após ≥ 1 tentativa de execução

## Deploy

- GitHub Actions (`.github/workflows/deploy.yml`) builda e publica no GitHub Pages a cada push na `main`
- Nunca commitar direto se o build estiver quebrado
