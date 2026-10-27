import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import StepsSection from './sections/StepsSection';
import TopSellersSection from './sections/TopSellersSection';
import MenuSection from './sections/MenuSection';
import DeliverySection from './sections/DeliverySection';
import DrinkSheet from './components/DrinkSheet';
import CartDrawer from './components/CartDrawer';
import CartBar from './components/CartBar';
import { CartProvider } from './store/cart';

export default function App() {
  return (
    <CartProvider>
      <main className="bg-ink" style={{ overflowX: 'clip' }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <StepsSection />
        <TopSellersSection />
        <MenuSection />
        <DeliverySection />
      </main>
      <DrinkSheet />
      <CartDrawer />
      <CartBar />
    </CartProvider>
  );
}
