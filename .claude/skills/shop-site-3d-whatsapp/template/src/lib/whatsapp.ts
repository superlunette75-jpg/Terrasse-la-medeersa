import { SHOP } from '../data/config';
import type { CartLine } from '../store/cart';
import { TOPPINGS } from '../data/menu';

export interface OrderInfo {
  mode: 'delivery' | 'pickup';
  zone?: { name: string; fee: number };
  name: string;
  phone: string;
  address: string;
  location?: { lat: number; lng: number };
  time: string;
  note: string;
  subtotal: number;
  fee: number;
  total: number;
}

const money = (n: number) => `${n} ${SHOP.currency}`;
const extraName = (id: string) => TOPPINGS.find((t) => t.id === id)?.name ?? id;

export function buildMessage(lines: CartLine[], o: OrderInfo) {
  const out: string[] = [`*New order · ${SHOP.name}*`, ''];
  lines.forEach((l) => {
    out.push(`${l.qty} × ${l.code} ${l.name}${l.size !== 'One size' ? ` (${l.size})` : ''} · ${money(l.qty * l.unit)}`);
    const opts = [l.ice, l.sugar, ...l.extras.map((e) => `+ ${extraName(e)}`)].filter(Boolean);
    if (opts.length) out.push(`   _${opts.join(', ')}_`);
  });
  out.push('');
  if (o.mode === 'delivery') {
    out.push(`Subtotal: ${money(o.subtotal)}`);
    out.push(`Delivery: ${o.fee ? money(o.fee) : 'Free'}`);
  }
  out.push(`*Total: ${money(o.total)}*`, '');
  out.push(`Mode: ${o.mode === 'delivery' ? 'Delivery' : 'Pickup'}`);
  out.push(`Name: ${o.name}`);
  out.push(`Phone: ${o.phone}`);
  if (o.mode === 'delivery') {
    if (o.zone) out.push(`Area: ${o.zone.name}`);
    out.push(`Address: ${o.address}`);
    if (o.location) out.push(`Location: https://maps.google.com/?q=${o.location.lat},${o.location.lng}`);
  }
  out.push(`For: ${o.time || 'As soon as possible'}`);
  if (o.note) out.push(`Note: ${o.note}`);
  out.push('', `_${o.mode === 'delivery' ? 'Payment on delivery' : 'Payment at the counter'}_`);
  return out.join('\n');
}

export const waLink = (text?: string) => `https://wa.me/${SHOP.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
