import { useEffect, useRef, useState } from 'react';
import { DRINKS, catOf } from '../data/menu';

// One tile per distinct image, so the rows show the whole range
const seen = new Set<string>();
const TILES = DRINKS.filter((d) => (seen.has(d.img) ? false : (seen.add(d.img), true)));
const half = Math.ceil(TILES.length / 2);
const ROW1 = TILES.slice(0, half);
const ROW2 = TILES.slice(half);

function Tile({ img, name, tint }: { img: string; name: string; tint: string }) {
  return (
    <div
      className="relative flex h-[170px] w-[260px] shrink-0 items-end overflow-hidden rounded-2xl sm:h-[270px] sm:w-[420px]"
      style={{ background: `radial-gradient(circle at 70% 40%, #fff8 0%, ${tint} 60%)` }}
    >
      <img src={img} alt="" loading="lazy" className="absolute -bottom-4 right-2 h-[118%] object-contain sm:right-6" />
      <span className="relative z-10 m-4 max-w-[55%] text-base font-semibold uppercase leading-tight text-ink sm:text-2xl">{name}</span>
    </div>
  );
}

export default function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const sectionTop = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - sectionTop + window.innerHeight) * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const row = (items: typeof TILES) => [...items, ...items, ...items];

  return (
    <section ref={ref} className="flex flex-col gap-3 overflow-hidden bg-ink pb-10 pt-24 sm:pt-32 md:pt-40" aria-label="Our drinks">
      <div className="flex gap-3" style={{ transform: `translateX(${offset - 600}px)`, willChange: 'transform' }}>
        {row(ROW1).map((d, i) => (
          <Tile key={i} img={d.img} name={d.name} tint={catOf(d.cat).tint} />
        ))}
      </div>
      <div className="flex gap-3" style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: 'transform' }}>
        {row(ROW2).map((d, i) => (
          <Tile key={i} img={d.img} name={d.name} tint={catOf(d.cat).tint} />
        ))}
      </div>
    </section>
  );
}
