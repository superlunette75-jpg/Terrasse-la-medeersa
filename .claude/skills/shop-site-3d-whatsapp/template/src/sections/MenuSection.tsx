import { useMemo, useState } from 'react';
import { Plus, Search, Snowflake, Flame } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import TiltCard from '../components/TiltCard';
import { CATEGORIES, DRINKS, catOf, type CategoryId, type Drink } from '../data/menu';
import { useCart } from '../store/cart';
import { COPY } from '../data/config';

function priceLabel(d: Drink) {
  if (d.price) return `${d.price} DH`;
  if (d.m && d.l) return `M ${d.m} · L ${d.l} DH`;
  return `L ${d.l} DH`;
}

function DrinkCard({ d }: { d: Drink }) {
  const { pick } = useCart();
  const cat = catOf(d.cat);
  return (
    <TiltCard className="h-full">
      <button
        type="button"
        onClick={() => pick(d)}
        className="flex h-full w-full flex-col overflow-visible rounded-[28px] p-3 text-left sm:p-4"
        style={{ background: `linear-gradient(160deg, #FFFFFFAA 0%, ${cat.tint} 55%)`, transformStyle: 'preserve-3d' }}
        aria-label={`Add ${d.name}`}
      >
        <div className="flex items-start justify-between" style={{ transform: 'translateZ(20px)' }}>
          <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold tracking-wider text-light sm:text-xs">{d.code}</span>
          <span className="flex gap-1 text-ink/50">
            {d.cat === 'hot' ? <Flame size={14} /> : <Snowflake size={14} />}
            {cat.canBeWarm && <Flame size={14} />}
          </span>
        </div>
        <div className="relative -mx-1 aspect-[4/5]" style={{ transform: 'translateZ(50px)' }}>
          <img src={d.img} alt={d.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_18px_18px_rgb(var(--ink)/0.25)]" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-2" style={{ transform: 'translateZ(30px)' }}>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold uppercase leading-tight text-ink sm:text-base">{d.name}</h3>
            {d.cn && <p className="text-[11px] text-ink/50">{d.cn}</p>}
            <p className="mt-1 text-xs font-medium text-accent-dark sm:text-sm">{priceLabel(d)}</p>
          </div>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-white shadow-[0_6px_14px_rgb(var(--accent)/0.45)] sm:h-10 sm:w-10">
            <Plus size={20} strokeWidth={2.5} />
          </span>
        </div>
      </button>
    </TiltCard>
  );
}

export default function MenuSection() {
  const [active, setActive] = useState<CategoryId | 'all'>('all');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return DRINKS.filter((d) => (active === 'all' || d.cat === active) && (!s || `${d.code} ${d.name} ${d.desc}`.toLowerCase().includes(s)));
  }, [active, q]);

  const groups = CATEGORIES.map((c) => ({ c, items: list.filter((d) => d.cat === c.id) })).filter((g) => g.items.length);

  return (
    <section id="menu" className="relative z-20 -mt-10 scroll-mt-0 rounded-t-[40px] bg-paper pb-32 pt-16 sm:-mt-12 sm:rounded-t-[50px] sm:pt-20 md:-mt-14 md:rounded-t-[60px] md:pt-28">
      <FadeIn y={40}>
        <h2 className="text-center font-black uppercase leading-none tracking-tight text-ink" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {COPY.menuTitle}
        </h2>
        <p className="mt-3 text-center text-sm font-light text-ink/60 sm:text-base">{COPY.menuSubtitle}</p>
      </FadeIn>

      {/* sticky app-style filter bar */}
      <div className="sticky top-0 z-30 mt-8 bg-paper/90 pb-3 pt-3 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-ink/10">
            <Search size={18} className="text-ink/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={COPY.searchPlaceholder}
              className="w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-ink/40"
            />
          </label>
          <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {[{ id: 'all' as const, name: 'All' }, ...CATEGORIES].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                  active === c.id ? 'bg-ink text-light' : 'bg-white text-ink ring-1 ring-ink/10'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        {groups.length === 0 && <p className="py-20 text-center text-ink/60">No drink matches “{q}”.</p>}
        {groups.map(({ c, items }) => (
          <div key={c.id} className="pt-10">
            <div className="mb-4 flex items-baseline gap-3 border-b-2 border-ink pb-2">
              <h3 className="text-2xl font-black uppercase text-ink sm:text-3xl">{c.name}</h3>
              <span className="text-sm text-ink/50">{c.cn}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {items.map((d) => (
                <DrinkCard key={d.code} d={d} />
              ))}
            </div>
          </div>
        ))}
        <p className="mt-10 text-center text-xs text-ink/50">
          {COPY.menuFootnote}
        </p>
      </div>
    </section>
  );
}
