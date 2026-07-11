/**
 * Acesso ao localStorage com o prefixo obrigatório `algo-trainer:`.
 * Nunca gravar chaves fora deste módulo.
 */
const PREFIX = 'algo-trainer:';
const SCHEMA_VERSION = 1;

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage cheio ou indisponível — falha silenciosa, app segue funcional
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}

/** Todas as chaves do app (sem o prefixo). */
export function storageKeys(): string[] {
  const keys: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) keys.push(key.slice(PREFIX.length));
    }
  } catch {
    /* noop */
  }
  return keys;
}

/**
 * Garante a versão do schema. Ao evoluir o formato de storage, adicionar
 * aqui a migração da versão antiga — nunca quebrar progresso existente.
 */
export function ensureSchema(): void {
  const version = storageGet<number>('schema-version', 0);
  if (version === 0) {
    // Instalação nova (ou pré-versionamento, cujo formato coincide com a v1).
    storageSet('schema-version', SCHEMA_VERSION);
  }
  // Futuras migrações: if (version === 1) { ...migra...; storageSet('schema-version', 2); }
}

/** Exporta todo o progresso como JSON legível (tela de configurações). */
export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (const key of storageKeys()) {
    data[key] = storageGet<unknown>(key, null);
  }
  return JSON.stringify({ app: 'algo-trainer', exportedAt: new Date().toISOString(), data }, null, 2);
}

/** Importa um JSON gerado por exportAllData. Lança erro se o formato for inválido. */
export function importAllData(json: string): void {
  const parsed: unknown = JSON.parse(json);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as { app?: unknown }).app !== 'algo-trainer' ||
    typeof (parsed as { data?: unknown }).data !== 'object'
  ) {
    throw new Error('Arquivo inválido: não é um export do algo-trainer.');
  }
  const data = (parsed as { data: Record<string, unknown> }).data;
  for (const [key, value] of Object.entries(data)) {
    storageSet(key, value);
  }
  ensureSchema();
}

/** Remove todos os dados do app (usado em "apagar progresso"). */
export function clearAllData(): void {
  for (const key of storageKeys()) {
    storageRemove(key);
  }
}
