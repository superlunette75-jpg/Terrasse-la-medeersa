import { motion } from 'framer-motion';
import type { ElementType, ReactNode, CSSProperties } from 'react';

interface FadeInProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}

const cache = new Map<ElementType, ReturnType<typeof motion.create>>();
const motionFor = (tag: ElementType) => {
  if (!cache.has(tag)) cache.set(tag, motion.create(tag as never));
  return cache.get(tag)!;
};

export default function FadeIn({ children, as = 'div', delay = 0, duration = 0.7, x = 0, y = 30, className, style }: FadeInProps) {
  const Component = motionFor(as) as typeof motion.div;
  return (
    <Component
      className={className}
      style={style}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
}
