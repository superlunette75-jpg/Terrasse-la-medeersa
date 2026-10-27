import FadeIn from '../components/FadeIn';
import AnimatedText from '../components/AnimatedText';
import { OrderButton } from '../components/Buttons';
import { COPY } from '../data/config';

const DECOR = [
  { src: COPY.aboutDecor[0], alt: '', cls: 'top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[110px] sm:w-[160px] md:w-[210px]', delay: 0.1, x: -80 },
  { src: COPY.aboutDecor[1], alt: '', cls: 'bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]', delay: 0.25, x: -80 },
  { src: COPY.aboutDecor[2], alt: '', cls: 'top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[110px] sm:w-[160px] md:w-[210px]', delay: 0.15, x: 80 },
  { src: COPY.aboutDecor[3], alt: '', cls: 'bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[120px] sm:w-[170px] md:w-[220px]', delay: 0.3, x: 80 },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10">
      {DECOR.map((d, i) => (
        <FadeIn key={i} delay={d.delay} x={d.x} y={0} duration={0.9} className={`pointer-events-none absolute ${d.cls}`}>
          <img src={d.src} alt={d.alt} loading="lazy" className="w-full animate-[float_6s_ease-in-out_infinite]" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <FadeIn delay={0} y={40}>
            <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
              {COPY.aboutTitle}
            </h2>
          </FadeIn>
          <AnimatedText
            text={COPY.aboutText}
            className="max-w-[560px] text-center font-medium leading-relaxed text-light"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
        </div>
        <OrderButton />
      </div>
    </section>
  );
}
