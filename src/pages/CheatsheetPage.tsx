import { Link, useParams } from 'react-router-dom';
import { MarkdownView } from '../components/MarkdownView';
import { getCheatsheet } from '../content/cheatsheets';

export function CheatsheetPage() {
  const { slug } = useParams<{ slug: string }>();
  const sheet = slug ? getCheatsheet(slug) : undefined;

  if (!sheet) {
    return (
      <div>
        <p className="mb-2 text-zinc-500">Cheatsheet não encontrada.</p>
        <Link to="/cheatsheets" className="text-blue-500 underline">
          Ver todas as cheatsheets
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="card p-6">
        <MarkdownView markdown={sheet.content} />
      </div>
    </div>
  );
}
