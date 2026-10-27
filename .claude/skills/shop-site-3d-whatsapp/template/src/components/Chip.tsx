import type { ReactNode } from 'react';

export default function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${on ? 'bg-ink text-light' : 'bg-white text-ink ring-1 ring-ink/10'}`}
    >
      {children}
    </button>
  );
}
