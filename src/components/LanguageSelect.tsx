import type { Language } from '../content/types';

const labels: Record<Language, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
};

export function LanguageSelect({
  value,
  onChange,
  disabled,
}: {
  value: Language;
  onChange: (language: Language) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex rounded-md border border-zinc-300 p-0.5 dark:border-zinc-700">
      {(Object.keys(labels) as Language[]).map((language) => (
        <button
          key={language}
          type="button"
          disabled={disabled}
          onClick={() => onChange(language)}
          className={`rounded px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === language
              ? 'bg-blue-600 text-white'
              : 'text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800'
          }`}
        >
          {labels[language]}
        </button>
      ))}
    </div>
  );
}
