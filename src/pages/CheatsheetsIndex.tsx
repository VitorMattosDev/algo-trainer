import { Link } from 'react-router-dom';
import { cheatsheets } from '../content/cheatsheets';

export function CheatsheetsIndex() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Cheatsheets</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {cheatsheets.map((sheet) => (
          <Link
            key={sheet.slug}
            to={`/cheatsheets/${sheet.slug}`}
            className="card block p-4 transition-colors hover:border-blue-500/50"
          >
            <h2 className="mb-1 font-semibold">{sheet.title}</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{sheet.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
