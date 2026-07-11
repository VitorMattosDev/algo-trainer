import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/padroes', label: 'Padrões' },
  { to: '/cheatsheets', label: 'Cheatsheets' },
  { to: '/playground', label: 'Playground' },
  { to: '/config', label: 'Config' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <nav className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2">
        <NavLink to="/" className="mr-4 font-mono text-base font-bold text-blue-600 dark:text-blue-400">
          algo-trainer
        </NavLink>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
