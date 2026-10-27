import FadeIn from '../components/FadeIn';
import { COPY } from '../data/config';

const STEPS = COPY.steps;


export default function StepsSection() {
  return (
    <section className="rounded-t-[40px] bg-paper px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <h2
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-ink sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        {COPY.stepsTitle}
      </h2>
      <ol className="mx-auto max-w-5xl">
        {STEPS.map((s, i) => (
          <FadeIn
            as="li"
            key={s.name}
            delay={i * 0.1}
            className="flex items-center gap-6 py-8 sm:gap-10 sm:py-10 md:py-12"
            style={{ borderTop: i ? '1px solid rgb(var(--ink)/0.15)' : undefined }}
          >
            <span className="font-black leading-none text-accent" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-2 text-ink">
              <h3 className="font-medium uppercase" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                {s.name}
              </h3>
              <p className="max-w-2xl font-light leading-relaxed opacity-60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                {s.desc}
              </p>
            </div>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
