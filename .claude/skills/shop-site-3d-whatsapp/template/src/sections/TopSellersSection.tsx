import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { Plus } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { GhostButton } from '../components/Buttons';
import { TOP_SELLERS, catOf, drinkByCode, type Drink } from '../data/menu';
import { useCart } from '../store/cart';
import { COPY } from '../data/config';

const DECOR: Record<string, string> = {
  A6: '/drinks/decor-boba.webp',
  A7: '/drinks/decor-boba.webp',
  G1: '/drinks/decor-strawberry.webp',
  F4: '/drinks/decor-strawberry.webp',
  H4: '/drinks/decor-boba.webp',
  D6: '/drinks/decor-matcha.webp',
};

function Card({ d, index, total, progress }: { d: Drink; index: number; total: number; progress: MotionValue<number> }) {
  const { pick } = useCart();
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const cat = catOf(d.cat);
  const prices = d.price ? [`${d.price} DH`] : [d.m && `M · ${d.m} DH`, d.l && `L · ${d.l} DH`].filter(Boolean);

  return (
    <div className="sticky top-20 flex h-[78vh] items-start justify-center md:top-28">
      <motion.article
        style={{ scale, top: `${index * 22}px` }}
        className="relative w-full max-w-6xl origin-top rounded-[40px] border-2 border-light bg-ink p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
          <div className="flex items-center gap-4">
            <span className="hero-heading font-black leading-none" style={{ fontSize: 'clamp(2.6rem, 8vw, 120px)' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-light/60 sm:text-sm">{d.code} · {cat.name}</p>
              <h3 className="font-medium uppercase leading-tight text-light" style={{ fontSize: 'clamp(1.1rem, 2.6vw, 2.2rem)' }}>{d.name}</h3>
            </div>
          </div>
          <GhostButton onClick={() => pick(d)}>
            <Plus size={16} /> Add to order
          </GhostButton>
        </div>

        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <div className="flex flex-col justify-center rounded-[28px] bg-accent p-4 text-ink sm:rounded-[40px] sm:p-6 md:rounded-[50px]" style={{ height: 'clamp(110px, 16vw, 230px)' }}>
              {prices.map((p) => (
                <span key={p as string} className="font-black leading-tight" style={{ fontSize: 'clamp(1rem, 2.6vw, 2.4rem)' }}>{p}</span>
              ))}
              <span className="mt-1 text-xs font-medium uppercase tracking-widest opacity-70">{d.cn}</span>
            </div>
            <div className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] md:rounded-[50px]" style={{ height: 'clamp(140px, 22vw, 340px)', background: cat.tint }}>
              <img src={DECOR[d.code]} alt="" loading="lazy" className="absolute inset-0 m-auto h-[80%] w-[80%] object-contain" />
            </div>
          </div>
          <div
            className="relative flex w-[60%] items-center justify-center overflow-hidden rounded-[28px] sm:rounded-[40px] md:rounded-[50px]"
            style={{ background: `radial-gradient(circle at 50% 40%, #FFFFFF 0%, ${cat.tint} 65%)` }}
          >
            <img src={d.img} alt={d.name} loading="lazy" className="h-[92%] max-h-[560px] object-contain drop-shadow-[0_25px_25px_rgb(var(--ink)/0.35)]" />
            <p className="absolute bottom-3 left-4 right-4 hidden text-sm text-ink/70 sm:block md:bottom-6 md:left-8 md:text-base">{d.desc}</p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function TopSellersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const drinks = TOP_SELLERS.map(drinkByCode);

  return (
    <section id="top-sellers" className="relative z-10 -mt-10 rounded-t-[40px] bg-ink px-4 pb-24 pt-16 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-20 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28">
      <FadeIn y={40}>
        <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {COPY.topTitle}
        </h2>
      </FadeIn>
      <div ref={ref} className="mt-10 md:mt-16">
        {drinks.map((d, i) => (
          <Card key={d.code} d={d} index={i} total={drinks.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
