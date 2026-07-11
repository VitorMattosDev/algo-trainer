import { useEffect, useState } from 'react';

/** Celebração discreta exibida ao resolver um exercício. */
export function CelebrationToast({ show, onDone }: { show: boolean; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onDone();
    }, 4000);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-lg border border-emerald-500/40 bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
      role="status"
    >
      🎉 Exercício resolvido! Boa!
    </div>
  );
}
