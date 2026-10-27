// Menu transcribed from the Mootea in-store menu. Prices in MAD (DH).
// m = Medium 500ml, l = Large 700ml. Single-price drinks use `l` only with `single: true`.

export type CategoryId = 'milk-tea' | 'fruit-milk' | 'no-tea' | 'matcha' | 'fruit-tea' | 'fruit-tea-plus' | 'cheese' | 'coffee' | 'hot';

export interface Category {
  id: CategoryId;
  name: string;
  cn: string;
  tint: string; // pastel tile colour, echoing the menu headers
  canBeWarm: boolean;
}

export interface Drink {
  code: string;
  name: string;
  cn?: string;
  cat: CategoryId;
  m?: number;
  l?: number;
  price?: number; // one size only
  img: string;
  desc: string;
}

export const CATEGORIES: Category[] = [
  { id: 'milk-tea', name: 'Milk Tea', cn: '奶茶系列', tint: '#F6E3CF', canBeWarm: true },
  { id: 'fruit-milk', name: 'Fruit Milk', cn: '果奶系列', tint: '#FBDDE3', canBeWarm: true },
  { id: 'no-tea', name: 'No Tea', cn: '无茶系列', tint: '#EADFF7', canBeWarm: true },
  { id: 'matcha', name: 'Matcha', cn: '抹茶系列', tint: '#DFF0D6', canBeWarm: false },
  { id: 'fruit-tea', name: 'Fruit Tea', cn: '果茶系列', tint: '#FDE7C4', canBeWarm: false },
  { id: 'fruit-tea-plus', name: 'Fruit Tea+', cn: '果茶系列', tint: '#E5DDF7', canBeWarm: false },
  { id: 'cheese', name: 'Cheese Smoothie', cn: '芝士系列', tint: '#FCD9D4', canBeWarm: false },
  { id: 'coffee', name: 'Iced Coffee', cn: '冰咖啡系列', tint: '#EBDCCB', canBeWarm: false },
  { id: 'hot', name: 'Hot Drinks', cn: '热咖啡', tint: '#F3E6D8', canBeWarm: false },
];

const d = (img: string) => `/drinks/${img}.webp`;

export const DRINKS: Drink[] = [
  // Milk Tea
  { code: 'A1', name: 'Classic Bubble Tea', cn: '经典珍珠奶茶', cat: 'milk-tea', m: 42, l: 50, img: d('classic-milk-tea'), desc: 'Black tea, fresh milk and chewy tapioca pearls.' },
  { code: 'A2', name: 'Coconut Jelly Milk Tea', cn: '椰果奶茶', cat: 'milk-tea', m: 42, l: 50, img: d('coconut-milk-tea'), desc: 'Creamy milk tea with bouncy coconut jelly.' },
  { code: 'A3', name: 'Pudding Milk Tea', cn: '布丁奶茶', cat: 'milk-tea', m: 42, l: 50, img: d('pudding-milk-tea'), desc: 'Milk tea over silky egg pudding.' },
  { code: 'A4', name: 'Cheese Foam Milk Tea', cn: '芝士奶茶', cat: 'milk-tea', m: 45, l: 55, img: d('cheese-foam-milk-tea'), desc: 'Milk tea crowned with salty-sweet cheese foam.' },
  { code: 'A5', name: 'Brown Sugar Bubble Tea', cn: '黑糖珍珠奶茶', cat: 'milk-tea', m: 48, l: 58, img: d('brown-sugar'), desc: 'Tiger stripes of brown sugar syrup and warm pearls.' },
  { code: 'A6', name: 'Creme Brulee Bubble Tea', cn: '布蕾珍珠奶茶', cat: 'milk-tea', m: 55, l: 65, img: d('creme-brulee'), desc: 'Torched crème brûlée top over pearl milk tea.' },
  { code: 'A7', name: 'Chocolate Bubble Tea', cn: '巧克力珍珠奶茶', cat: 'milk-tea', m: 48, l: 58, img: d('chocolate-boba'), desc: 'Rich chocolate milk tea with tapioca pearls.' },
  { code: 'A8', name: 'Three Guys Milk Tea', cn: '奶茶三兄弟', cat: 'milk-tea', l: 60, img: d('three-guys'), desc: 'Loaded with pearls, pudding and more.' },
  // Fruit Milk
  { code: 'B1', name: 'Strawberry Jasmine Milk', cn: '草莓冰奶', cat: 'fruit-milk', m: 48, l: 58, img: d('strawberry-milk'), desc: 'Crushed strawberry, jasmine and fresh milk.' },
  { code: 'B2', name: 'Mango Jasmine Milk', cn: '芒果冰奶', cat: 'fruit-milk', m: 48, l: 58, img: d('mango-milk'), desc: 'Juicy mango with jasmine milk.' },
  { code: 'B3', name: 'Grape Jasmine Milk', cn: '葡萄冰奶', cat: 'fruit-milk', m: 48, l: 58, img: d('grape-milk'), desc: 'Grape pulp, jasmine and milk.' },
  { code: 'B4', name: 'Lemon Jasmine Milk', cn: '柠檬冰奶', cat: 'fruit-milk', m: 48, l: 58, img: d('lemon-milk'), desc: 'Bright lemon with smooth jasmine milk.' },
  // No Tea
  { code: 'C1', name: 'Lemon Water', cn: '冰鲜柠檬水', cat: 'no-tea', m: 30, l: 38, img: d('lemon-water'), desc: 'Fresh lemon over ice. Served cold.' },
  { code: 'C2', name: 'Taro Milk', cn: '香芋奶茶', cat: 'no-tea', m: 42, l: 50, img: d('taro-milk'), desc: 'Velvety purple taro and milk.' },
  { code: 'C3', name: 'Brown Sugar Bubble Milk', cn: '黑糖珍珠鲜奶', cat: 'no-tea', m: 50, l: 60, img: d('brown-sugar'), desc: 'Fresh milk, brown sugar and pearls — no tea.' },
  { code: 'C4', name: 'Chocolate Milk', cn: '巧克力鲜奶', cat: 'no-tea', m: 42, l: 50, img: d('chocolate-boba'), desc: 'Chocolate and fresh milk.' },
  { code: 'C5', name: 'Cheese Foam Chocolate Milk', cn: '芝芝巧克力鲜奶', cat: 'no-tea', m: 55, l: 65, img: d('choc-cheese-coffee'), desc: 'Chocolate milk with cheese foam. Served cold.' },
  { code: 'C6', name: 'Mango Milk', cn: '芒果牛乳', cat: 'no-tea', m: 50, l: 60, img: d('mango-milk'), desc: 'Mango purée and fresh milk.' },
  { code: 'C7', name: 'Strawberry Milk', cn: '草莓牛乳', cat: 'no-tea', m: 50, l: 60, img: d('strawberry-milk'), desc: 'Crushed strawberries and fresh milk.' },
  // Matcha
  { code: 'D1', name: 'Matcha Latte', cn: '抹茶拿铁', cat: 'matcha', price: 45, img: d('matcha-latte'), desc: 'Whisked matcha over cold milk.' },
  { code: 'D2', name: 'Matcha Brown Sugar Bubble', cn: '黑糖珍珠抹茶', cat: 'matcha', price: 58, img: d('matcha-brown-sugar'), desc: 'Matcha, brown sugar syrup and pearls.' },
  { code: 'D3', name: 'Matcha Brulee Bubble', cn: '抹茶布蕾', cat: 'matcha', price: 65, img: d('creme-brulee'), desc: 'Matcha with a torched brûlée top and pearls.' },
  { code: 'D4', name: 'Matcha Cheese Foam', cn: '芝士抹茶', cat: 'matcha', price: 55, img: d('matcha-latte'), desc: 'Matcha latte under cheese foam.' },
  { code: 'D5', name: 'Coconut Matcha', cn: '抹茶椰椰', cat: 'matcha', price: 55, img: d('matcha-latte'), desc: 'Matcha over coconut milk.' },
  { code: 'D6', name: 'Matcha Strawberry', cn: '抹茶草莓', cat: 'matcha', price: 55, img: d('matcha-strawberry'), desc: 'Matcha, milk and crushed strawberries.' },
  { code: 'D7', name: 'Matcha Mango', cn: '抹茶芒果', cat: 'matcha', price: 55, img: d('matcha-mango'), desc: 'Matcha, milk and mango purée.' },
  // Fruit Tea
  { code: 'E1', name: 'Lemon Black Tea', cn: '柠檬红茶', cat: 'fruit-tea', m: 40, l: 48, img: d('lemon-black-tea'), desc: 'Iced black tea with fresh lemon.' },
  { code: 'E2', name: 'Passionfruit Green Tea', cn: '百香果绿茶', cat: 'fruit-tea', m: 40, l: 48, img: d('passion-green-tea'), desc: 'Passion fruit pulp and green tea.' },
  { code: 'E3', name: 'Pomegranate Green Tea', cn: '石榴绿茶', cat: 'fruit-tea', m: 40, l: 48, img: d('pomegranate-tea'), desc: 'Pomegranate seeds and green tea.' },
  { code: 'E4', name: 'Mango Green Tea', cn: '芒果绿茶', cat: 'fruit-tea', m: 40, l: 48, img: d('mango-green-tea'), desc: 'Mango and green tea.' },
  { code: 'E5', name: 'Pomelo Green Tea', cn: '西柚绿茶', cat: 'fruit-tea', m: 40, l: 48, img: d('pomelo-green-tea'), desc: 'Pomelo pulp and green tea.' },
  { code: 'E6', name: 'Grape Green Tea', cn: '葡萄绿茶', cat: 'fruit-tea', m: 40, l: 48, img: d('grape-green-tea'), desc: 'Crushed grapes and green tea.' },
  { code: 'E7', name: 'Strawberry Green Tea', cn: '草莓绿茶', cat: 'fruit-tea', m: 40, l: 48, img: d('strawberry-green-tea'), desc: 'Fresh strawberry and green tea.' },
  // Fruit Tea+
  { code: 'F1', name: 'Super Fruit Tea', cn: '超级水果茶', cat: 'fruit-tea-plus', l: 65, img: d('super-fruit-tea'), desc: 'A cup packed with fresh seasonal fruit.' },
  { code: 'F2', name: 'Mango Pomelo Sago', cn: '杨枝甘露', cat: 'fruit-tea-plus', m: 55, l: 65, img: d('mango-pomelo-sago'), desc: 'Mango, pomelo and sago pearls.' },
  { code: 'F3', name: 'Pomelo Double', cn: '西柚双响炮', cat: 'fruit-tea-plus', m: 50, l: 60, img: d('pomelo-green-tea'), desc: 'Double pomelo with toppings.' },
  { code: 'F4', name: 'Pomegranate Grape Boba', cn: '石榴葡萄啵啵', cat: 'fruit-tea-plus', m: 50, l: 60, img: d('pomegranate-tea'), desc: 'Pomegranate, grape and popping boba.' },
  { code: 'F5', name: 'Passion Fruit Double', cn: '百香果双响炮', cat: 'fruit-tea-plus', m: 50, l: 60, img: d('passion-green-tea'), desc: 'Passion fruit with pearls and jelly.' },
  { code: 'F6', name: 'Multi-meat Grape', cn: '多肉葡萄', cat: 'fruit-tea-plus', m: 50, l: 60, img: d('grape-green-tea'), desc: 'Hand-crushed grapes and tea.' },
  { code: 'F7', name: 'Mango Orange Jelly', cn: '芒果香橙冻冻', cat: 'fruit-tea-plus', m: 50, l: 60, img: d('mango-green-tea'), desc: 'Mango, orange and jelly.' },
  // Cheese Smoothie
  { code: 'G1', name: 'Cheese Strawberry', cn: '芝芝草莓', cat: 'cheese', l: 60, img: d('cheese-strawberry'), desc: 'Strawberry smoothie under cheese foam.' },
  { code: 'G2', name: 'Cheese Grape', cn: '芝芝葡萄', cat: 'cheese', l: 60, img: d('cheese-grape'), desc: 'Grape smoothie under cheese foam.' },
  { code: 'G3', name: 'Cheese Mango', cn: '芝芝芒果', cat: 'cheese', l: 60, img: d('cheese-mango'), desc: 'Mango smoothie under cheese foam.' },
  { code: 'G4', name: 'Cheese Pomelo', cn: '芝芝西柚', cat: 'cheese', l: 60, img: d('cheese-pomelo'), desc: 'Pomelo smoothie under cheese foam.' },
  { code: 'G5', name: 'Cheese Pomegranate', cn: '芝芝石榴', cat: 'cheese', l: 60, img: d('cheese-pomegranate'), desc: 'Pomegranate smoothie under cheese foam.' },
  // Iced Coffee
  { code: 'H1', name: 'Ice Americano', cn: '冰美式', cat: 'coffee', price: 35, img: d('iced-americano'), desc: 'Espresso and cold water over ice.' },
  { code: 'H2', name: 'Orange C Americano', cn: '橙C美式', cat: 'coffee', price: 40, img: d('orange-americano'), desc: 'Orange juice topped with espresso.' },
  { code: 'H3', name: 'Latte', cn: '拿铁', cat: 'coffee', price: 42, img: d('iced-latte'), desc: 'Espresso and cold milk.' },
  { code: 'H4', name: 'Brown Sugar Bubble Coffee', cn: '黑糖珍珠咖啡', cat: 'coffee', price: 58, img: d('brown-sugar-coffee'), desc: 'Brown sugar pearls, milk and espresso.' },
  { code: 'H5', name: 'Chocolate Cheese Foam Coffee', cn: '巧克力芝士咖啡', cat: 'coffee', price: 58, img: d('choc-cheese-coffee'), desc: 'Chocolate coffee with cheese foam.' },
  { code: 'H6', name: 'Strawberry Chocolate Coffee', cn: '草莓巧克力咖啡', cat: 'coffee', price: 58, img: d('strawberry-choc-coffee'), desc: 'Strawberry, chocolate and espresso.' },
  // Hot Drinks
  { code: 'HD1', name: 'Espresso', cn: '意式浓缩', cat: 'hot', price: 22, img: d('hot-coffee'), desc: 'A short, intense shot.' },
  { code: 'HD2', name: 'Hot Americano', cn: '热美式', cat: 'hot', price: 25, img: d('hot-coffee'), desc: 'Espresso and hot water.' },
  { code: 'HD3', name: 'Hot Latte', cn: '热拿铁', cat: 'hot', price: 35, img: d('hot-coffee'), desc: 'Espresso and steamed milk.' },
  { code: 'HD4', name: 'Hot Matcha', cn: '热抹茶', cat: 'hot', price: 40, img: d('hot-coffee'), desc: 'Whisked matcha and steamed milk.' },
  { code: 'HD5', name: 'Chocolate Coffee', cn: '可可拿铁', cat: 'hot', price: 40, img: d('hot-coffee'), desc: 'Hot chocolate meets espresso.' },
];

export const TOP_SELLERS = ['A6', 'A7', 'G1', 'F4', 'H4', 'D6'];

export interface Extra {
  id: string;
  name: string;
  price: number;
  only?: CategoryId[];
}

export const TOPPINGS: Extra[] = [
  { id: 'tapioca', name: 'Tapioca', price: 8 },
  { id: 'coconut-jelly', name: 'Coconut Jelly', price: 8 },
  { id: 'crystal-bobo', name: 'Crystal Bobo', price: 8 },
  { id: 'sago', name: 'Sago', price: 8 },
  { id: 'konjac', name: 'Konjac Jelly', price: 8 },
  { id: 'pudding', name: 'Pudding', price: 8 },
  { id: 'passion-boba', name: 'Passionfruit Boba', price: 8 },
  { id: 'mango-boba', name: 'Mango Boba', price: 8 },
  { id: 'cheese-foam', name: 'Cheese Foam', price: 15 },
  { id: 'brulee', name: 'Brulee', price: 15 },
  { id: 'extra-coffee', name: 'Extra Coffee', price: 10 },
  { id: 'coconut-milk', name: 'Coconut Milk', price: 10 },
  { id: 'oat-milk', name: 'Oat Milk', price: 10 },
  { id: 'vanilla', name: 'Vanilla Syrup', price: 8 },
  { id: 'caramel', name: 'Caramel Syrup', price: 8 },
  { id: 'brown-sugar', name: 'Brown Sugar', price: 8 },
  { id: 'extra-matcha', name: 'Extra Matcha (Large)', price: 15, only: ['matcha'] },
];

export const ICE_LEVELS = ['Normal ice', 'Light ice', 'No ice', 'Warm'];
export const SUGAR_LEVELS = ['Regular 100%', 'Less 70%', 'Half 50%', 'Light 30%', 'Sugar free 0%'];

export const catOf = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;
export const drinkByCode = (code: string) => DRINKS.find((x) => x.code === code)!;
