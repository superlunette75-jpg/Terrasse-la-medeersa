import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../store/cart';

// Floating app-style "view order" bar, shown once something is in the cart
export default function CartBar() {
  const { count, subtotal, setOpen, open, picking } = useCart();
  const show = count > 0 && !open && !picking;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pb-safe fixed inset-x-0 bottom-0 z-50 flex justify-center px-4"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex w-full max-w-md items-center gap-3 rounded-full bg-ink py-2.5 pl-2.5 pr-6 text-light shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/10"
          >
            <motion.span key={count} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="relative grid h-11 w-11 place-items-center rounded-full bg-accent text-white">
              <ShoppingBag size={20} />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-ink">{count}</span>
            </motion.span>
            <span className="flex-1 text-left text-sm font-semibold uppercase tracking-widest">View order</span>
            <span className="font-semibold tabular-nums">{subtotal} DH</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
