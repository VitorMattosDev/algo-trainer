import type { ExerciseStatus } from '../lib/progress';

const config: Record<ExerciseStatus, { icon: string; className: string; label: string }> = {
  solved: { icon: '✓', className: 'text-emerald-500', label: 'Resolvido' },
  attempted: { icon: '◐', className: 'text-amber-500', label: 'Tentado' },
  untouched: { icon: '○', className: 'text-zinc-400 dark:text-zinc-600', label: 'Não iniciado' },
};

export function StatusIcon({ status }: { status: ExerciseStatus }) {
  const { icon, className, label } = config[status];
  return (
    <span className={`font-mono text-sm font-bold ${className}`} title={label} aria-label={label}>
      {icon}
    </span>
  );
}
