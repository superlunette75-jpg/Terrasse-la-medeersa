import { Minus, Plus } from 'lucide-react';

export default function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (n: number) => void; min?: number }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-ink/10">
      <button type="button" aria-label="Less" onClick={() => onChange(Math.max(min, value - 1))} className="grid h-8 w-8 place-items-center rounded-full bg-ink/5">
        <Minus size={16} />
      </button>
      <span className="w-6 text-center font-semibold tabular-nums">{value}</span>
      <button type="button" aria-label="More" onClick={() => onChange(value + 1)} className="grid h-8 w-8 place-items-center rounded-full bg-accent text-white">
        <Plus size={16} />
      </button>
    </div>
  );
}
