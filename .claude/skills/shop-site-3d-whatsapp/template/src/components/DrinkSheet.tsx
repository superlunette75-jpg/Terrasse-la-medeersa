import { useEffect, useState } from 'react';
import Sheet from './Sheet';
import Chip from './Chip';
import Stepper from './Stepper';
import { ICE_LEVELS, SUGAR_LEVELS, TOPPINGS, catOf } from '../data/menu';
import { extrasTotal, priceFor, useCart, type Size } from '../store/cart';
import { OPTIONS } from '../data/config';

export default function DrinkSheet() {
  const { picking: d, pick, add } = useCart();
  const [size, setSize] = useState<Size>('L');
  const [ice, setIce] = useState(ICE_LEVELS[0]);
  const [sugar, setSugar] = useState(SUGAR_LEVELS[0]);
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!d) return;
    setSize(d.price ? 'One size' : d.m ? 'M' : 'L');
    setIce(ICE_LEVELS[0]);
    setSugar(SUGAR_LEVELS[0]);
    setExtras([]);
    setQty(1);
  }, [d]);

  if (!d) return <Sheet open={false} onClose={() => pick(null)} title="">{null}</Sheet>;

  const cat = catOf(d.cat);
  const noIce = d.cat === 'hot' || !OPTIONS.ice;
  const ices = ICE_LEVELS.filter((l) => l !== 'Warm' || cat.canBeWarm);
  const toppings = TOPPINGS.filter((t) => !t.only || t.only.includes(d.cat));
  const unit = priceFor(d, size) + extrasTotal(extras);
  const toggle = (id: string) => setExtras((x) => (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]));

  const onAdd = () => {
    add({ code: d.code, name: d.name, img: d.img, size, ice: noIce ? undefined : ice, sugar: OPTIONS.sugar ? sugar : undefined, extras, unit }, qty);
    pick(null);
  };

  return (
    <Sheet
      open={!!d}
      onClose={() => pick(null)}
      title={d.name}
      footer={
        <div className="flex items-center gap-3 pb-1">
          <Stepper value={qty} onChange={setQty} min={1} />
          <button type="button" onClick={onAdd} className="flex-1 rounded-full bg-accent py-3.5 text-sm font-semibold uppercase tracking-widest text-white shadow-[0_8px_20px_rgb(var(--accent)/0.4)] active:scale-[0.98]">
            Add · {unit * qty} DH
          </button>
        </div>
      }
    >
      <div className="flex items-center gap-4 rounded-3xl p-3" style={{ background: cat.tint }}>
        <img src={d.img} alt={d.name} className="h-32 w-28 shrink-0 object-contain drop-shadow-xl" />
        <div>
          <p className="text-xs font-semibold tracking-wider text-ink/60">{d.code} · {cat.name}</p>
          {d.cn && <p className="text-sm text-ink/50">{d.cn}</p>}
          <p className="mt-1 text-sm leading-snug">{d.desc}</p>
        </div>
      </div>

      {!d.price && (
        <Group title="Size">
          {d.m && <Chip on={size === 'M'} onClick={() => setSize('M')}>{OPTIONS.sizeLabels.M} · {d.m} DH</Chip>}
          {d.l && <Chip on={size === 'L'} onClick={() => setSize('L')}>{OPTIONS.sizeLabels.L} · {d.l} DH</Chip>}
        </Group>
      )}
      {!noIce && (
        <Group title="Ice">
          {ices.map((l) => <Chip key={l} on={ice === l} onClick={() => setIce(l)}>{l}</Chip>)}
        </Group>
      )}
      {OPTIONS.sugar && (
        <Group title="Sweetness">
          {SUGAR_LEVELS.map((l) => <Chip key={l} on={sugar === l} onClick={() => setSugar(l)}>{l}</Chip>)}
        </Group>
      )}
      {OPTIONS.toppings && toppings.length > 0 && (
        <Group title={OPTIONS.toppingsTitle}>
          {toppings.map((t) => (
            <Chip key={t.id} on={extras.includes(t.id)} onClick={() => toggle(t.id)}>
              {t.name} +{t.price}
            </Chip>
          ))}
        </Group>
      )}
    </Sheet>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-5">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-ink/60">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
