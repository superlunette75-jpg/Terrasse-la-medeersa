import { Clock, Instagram, MapPin } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { OrderButton } from '../components/Buttons';
import { WhatsAppIcon } from '../components/CartDrawer';
import { COPY, ORDERING, SHOP, ZONES } from '../data/config';
import { waLink } from '../lib/whatsapp';

export default function DeliverySection() {
  return (
    <section id="delivery" className="relative z-30 -mt-10 rounded-t-[40px] bg-ink px-5 pb-16 pt-16 text-light sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-20 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28">
      <FadeIn y={40}>
        <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          {COPY.deliveryTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center font-light text-light/70">
          We deliver all over {SHOP.city}. Minimum order {ORDERING.minOrder} DH, free delivery from {ORDERING.freeDeliveryFrom} DH, payment in cash on delivery.
        </p>
      </FadeIn>

      <div className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ZONES.map((z, i) => (
          <FadeIn key={z.id} delay={i * 0.06} className="rounded-[28px] border border-light/15 p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold uppercase">{z.name}</h3>
              <span className="text-2xl font-black text-accent-2">{z.fee} DH</span>
            </div>
            <p className="mt-1 text-sm font-light text-light/60">{z.areas}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs uppercase tracking-widest text-light/50"><Clock size={14} /> {z.eta}</p>
          </FadeIn>
        ))}
      </div>

      <div id="contact" className="mx-auto mt-20 flex max-w-5xl flex-col items-center gap-8 text-center">
        <OrderButton>Order now</OrderButton>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={waLink(COPY.whatsappHello)} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white">
            <WhatsAppIcon /> WhatsApp
          </a>
          <a href={SHOP.instagram} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-full border-2 border-light px-5 py-3 text-sm font-semibold uppercase tracking-widest">
            <Instagram size={18} /> Instagram
          </a>
          <a href={SHOP.mapsUrl} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-full border-2 border-light px-5 py-3 text-sm font-semibold uppercase tracking-widest">
            <MapPin size={18} /> Find us
          </a>
        </div>
        <p className="text-sm font-light text-light/60">{SHOP.hours}</p>
        <p className="hero-heading text-[22vw] font-black uppercase leading-none tracking-tight sm:text-[18vw]">{SHOP.name}</p>
        <p className="pb-20 text-xs text-light/40">© {new Date().getFullYear()} {SHOP.name}{SHOP.nativeName && ` · ${SHOP.nativeName}`} · {SHOP.kind}, {SHOP.city}</p>
      </div>
    </section>
  );
}
