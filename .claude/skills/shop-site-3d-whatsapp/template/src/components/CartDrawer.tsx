import { useMemo, useState } from 'react';
import { Bike, Check, Loader2, MapPin, ShoppingBag, Store } from 'lucide-react';
import Sheet from './Sheet';
import Stepper from './Stepper';
import { ORDERING, SHOP, ZONES } from '../data/config';
import { TOPPINGS } from '../data/menu';
import { useCart } from '../store/cart';
import { buildMessage, waLink } from '../lib/whatsapp';

type Mode = 'delivery' | 'pickup';
const input = 'w-full rounded-2xl bg-white px-4 py-3 text-[16px] outline-none ring-1 ring-ink/10 focus:ring-2 focus:ring-accent';

export default function CartDrawer() {
  const { lines, subtotal, open, setOpen, setQty, clear } = useCart();
  const [mode, setMode] = useState<Mode>('delivery');
  const [zoneId, setZoneId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [loc, setLoc] = useState<{ lat: number; lng: number } | undefined>();
  const [locState, setLocState] = useState<'idle' | 'busy' | 'error'>('idle');
  const [touched, setTouched] = useState(false);
  const [sentUrl, setSentUrl] = useState('');

  const zone = ZONES.find((z) => z.id === zoneId);
  const fee = mode === 'delivery' && zone ? (subtotal >= ORDERING.freeDeliveryFrom ? 0 : zone.fee) : 0;
  const total = subtotal + fee;
  const belowMin = subtotal < ORDERING.minOrder;

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Your name';
    if (!/^[+\d\s-]{9,}$/.test(phone.trim())) e.phone = 'A valid phone number';
    if (mode === 'delivery' && !zone) e.zone = 'Your area';
    if (mode === 'delivery' && !address.trim() && !loc) e.address = 'An address or your location';
    return e;
  }, [name, phone, mode, zone, address, loc]);

  const shareLocation = () => {
    if (!navigator.geolocation) return setLocState('error');
    setLocState('busy');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLoc({ lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6) });
        setLocState('idle');
      },
      () => setLocState('error'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const send = () => {
    setTouched(true);
    if (belowMin) return;
    if (Object.keys(errors).length) {
      setTimeout(() => document.querySelector('[data-err]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    const text = buildMessage(lines, {
      mode,
      zone: mode === 'delivery' && zone ? { name: zone.name, fee: zone.fee } : undefined,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      location: mode === 'delivery' ? loc : undefined,
      time,
      note: note.trim(),
      subtotal,
      fee,
      total,
    });
    const url = waLink(text);
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
    setSentUrl(url);
  };

  const close = () => {
    setOpen(false);
    if (sentUrl) {
      clear();
      setSentUrl('');
      setTouched(false);
    }
  };

  if (sentUrl) {
    return (
      <Sheet open={open} onClose={close} title="Almost done" footer={<button type="button" onClick={close} className="mb-1 w-full rounded-full bg-ink py-3.5 text-sm font-semibold uppercase tracking-widest text-light">New order</button>}>
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#25D366] text-white"><Check size={32} /></span>
          <h3 className="text-xl font-bold">Just press “Send” in WhatsApp</h3>
          <p className="max-w-sm text-sm text-ink/70">Your order is written out in WhatsApp. We confirm the timing as soon as we receive it. Payment on {mode === 'delivery' ? 'delivery' : 'pickup'}.</p>
          <a href={sentUrl} target="_blank" rel="noopener" className="text-sm font-semibold text-accent-dark underline">Open WhatsApp again</a>
        </div>
      </Sheet>
    );
  }

  const err = (k: string) => touched && errors[k] ? <p data-err className="mt-1 text-xs text-red-600">{errors[k]} is required</p> : null;

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Your order"
      footer={
        lines.length > 0 && (
          <div className="pb-1">
            <div className="mb-3 space-y-1 text-sm">
              <Row label="Subtotal" value={`${subtotal} DH`} />
              {mode === 'delivery' && <Row label="Delivery" value={zone ? (fee ? `${fee} DH` : 'Free') : 'Choose your area'} />}
              <Row label="Total" value={`${total} DH`} bold />
            </div>
            {belowMin && <p className="mb-2 text-center text-xs text-accent-dark">Minimum order {ORDERING.minOrder} DH: add {ORDERING.minOrder - subtotal} DH more.</p>}
            <button
              type="button"
              onClick={send}
              disabled={belowMin}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-[0_8px_20px_rgba(37,211,102,0.35)] disabled:opacity-40"
            >
              <WhatsAppIcon /> Send order on WhatsApp
            </button>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <ShoppingBag size={40} className="text-ink/30" />
          <p className="text-ink/60">Your cup is empty. Pick a drink from the menu.</p>
          <a href="#menu" onClick={() => setOpen(false)} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white">See the menu</a>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-ink/10">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3 py-3">
                <img src={l.img} alt="" className="h-16 w-12 shrink-0 object-contain" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.name}{l.size !== 'One size' && <span className="font-normal text-ink/60"> · {l.size}</span>}</p>
                  <p className="text-xs leading-snug text-ink/60">
                    {[l.ice, l.sugar, ...l.extras.map((e) => TOPPINGS.find((t) => t.id === e)?.name)].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-sm font-medium text-accent-dark">{l.unit * l.qty} DH</p>
                </div>
                <Stepper value={l.qty} onChange={(n) => setQty(l.key, n)} />
              </li>
            ))}
          </ul>

          <div className="mt-4 grid auto-cols-fr grid-flow-col gap-2 rounded-full bg-white p-1 ring-1 ring-ink/10">
            {(ORDERING.pickup ? (['delivery', 'pickup'] as Mode[]) : (['delivery'] as Mode[])).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={`flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold uppercase tracking-wide ${mode === m ? 'bg-ink text-light' : ''}`}>
                {m === 'delivery' ? <Bike size={16} /> : <Store size={16} />} {m === 'delivery' ? 'Delivery' : 'Pickup'}
              </button>
            ))}
          </div>

          {mode === 'delivery' && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink/60">Your area in {SHOP.city}</p>
              <div className="grid grid-cols-2 gap-2">
                {ZONES.map((z) => (
                  <button key={z.id} type="button" onClick={() => setZoneId(z.id)} className={`rounded-2xl p-3 text-left text-sm ring-1 ${zoneId === z.id ? 'bg-accent text-white ring-accent' : 'bg-white ring-ink/10'}`}>
                    <span className="block font-semibold leading-tight">{z.name}</span>
                    <span className="text-xs opacity-80">{subtotal >= ORDERING.freeDeliveryFrom ? 'Free' : `${z.fee} DH`} · {z.eta}</span>
                  </button>
                ))}
              </div>
              {err('zone')}
              <p className="mt-2 text-xs text-ink/50">Free delivery from {ORDERING.freeDeliveryFrom} DH.</p>
            </div>
          )}

          <div className="mt-5 space-y-3">
            <div>
              <input className={input} placeholder="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              {err('name')}
            </div>
            <div>
              <input className={input} placeholder="Phone (06 / 07…)" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              {err('phone')}
            </div>
            {mode === 'delivery' && (
              <div>
                <textarea className={`${input} min-h-[80px] resize-none`} placeholder="Address, building, door colour, landmark…" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <button type="button" onClick={shareLocation} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-semibold ring-1 ring-ink/10">
                  {locState === 'busy' ? <Loader2 size={16} className="animate-spin" /> : loc ? <Check size={16} className="text-[#25D366]" /> : <MapPin size={16} />}
                  {loc ? 'Location added' : 'Share my location'}
                </button>
                {locState === 'error' && <p className="mt-1 text-xs text-red-600">Couldn't get your location. Please type your address.</p>}
                {err('address')}
              </div>
            )}
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-ink/60">When</span>
              <select className={input} value={time} onChange={(e) => setTime(e.target.value)}>
                <option value="">As soon as possible</option>
                {slots().map((s) => <option key={s} value={s}>Today at {s}</option>)}
              </select>
            </label>
            <textarea className={`${input} min-h-[64px] resize-none`} placeholder="Note (allergies, extra straw…)" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </>
      )}
    </Sheet>
  );
}

function slots() {
  const out: string[] = [];
  const d = new Date();
  d.setMinutes(Math.ceil((d.getMinutes() + 45) / 15) * 15, 0, 0);
  if (d.getHours() < SHOP.openHour) d.setHours(SHOP.openHour, 0, 0, 0);
  while (out.length < 24 && d.getHours() < SHOP.closeHour && d.getHours() >= SHOP.openHour) {
    out.push(d.toTimeString().slice(0, 5));
    d.setMinutes(d.getMinutes() + 15);
  }
  return out;
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'text-base font-bold' : 'text-ink/70'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.49-8.41" />
    </svg>
  );
}
