// Every word on the landing page. Components read from here and never hard-code copy.
import doorstep from '../assets/images/landing/doorstep.webp';
import jollof from '../assets/images/landing/jollof.webp';
import basket from '../assets/images/landing/basket.webp';
import counter from '../assets/images/landing/counter.webp';
import screenMealPlan from '../assets/images/landing/screen-meal-plan.webp';
import screenRecipe from '../assets/images/landing/screen-recipe.webp';
import screenGroceryList from '../assets/images/landing/screen-grocery-list.webp';
import screenCheckout from '../assets/images/landing/screen-checkout.webp';
import screenPantry from '../assets/images/landing/screen-pantry.webp';
import screenPantryMatches from '../assets/images/landing/screen-pantry-matches.webp';
import screenWeekPlan from '../assets/images/landing/screen-week-plan.webp';
import screenJollofList from '../assets/images/landing/screen-jollof-list.webp';
import screenBudget from '../assets/images/landing/screen-budget.webp';
import screenEgusiList from '../assets/images/landing/screen-egusi-list.webp';

export interface Picture {
  src: string;
  alt: string;
  // The file's own size, so the page saves the right space before the picture loads.
  width: number;
  height: number;
}

// Every app screen is exported at the same size.
const SCREEN = { width: 720, height: 1558 };

export const openApp = 'Open the app';

export const hero = {
  note: 'Weekly or monthly grocery delivery, starting in Lagos',
  title: 'We handle your groceries.',
  lead: 'Plan your meals and Sustena makes one shopping list from them. We bring everything to your door, every week or every month.',
  tabsLabel: 'App screens',
  screens: [
    { tab: 'Meal plan', src: screenMealPlan, ...SCREEN, alt: "Sustena's budget planner: a ₦10,000 budget turned into breakfast, lunch and dinner for one day." },
    { tab: 'Recipes', src: screenRecipe, ...SCREEN, alt: 'A recipe for Fisherman Soup, with servings you can adjust and ingredients in metric or Nigerian units.' },
    { tab: 'Shopping list', src: screenGroceryList, ...SCREEN, alt: 'A monthly shopping list of twelve items with prices and the next delivery date.' },
    { tab: 'Checkout', src: screenCheckout, ...SCREEN, alt: 'Checkout for the monthly groceries: delivery address, items, fees and the total.' },
  ],
};

export type SlabTone = 'light' | 'dark' | 'light-ink-shadow';

export interface Slab {
  title: string;
  text: string;
  tone: SlabTone;
  photo?: Picture;
  screen?: Picture;
  cta?: boolean;
}

export const howItWorks: { title: string; line: string; slabs: Slab[] } = {
  title: 'How it works',
  line: 'Your groceries, your pantry and your meal plans all feed into your next order.',
  slabs: [
    {
      title: 'Your groceries arrive.',
      text: 'We bring them to your door every week or every month, whichever you choose.',
      tone: 'light',
      photo: { src: doorstep, width: 1298, height: 1212, alt: 'A delivery rider hands a woman a paper bag of vegetables at her door.' },
    },
    {
      title: 'They go into your pantry.',
      text: 'The app adds everything that’s delivered, so Sustena knows what you already have at home.',
      tone: 'dark',
      screen: { src: screenPantry, ...SCREEN, alt: "Sustena's pantry with nine ingredients, including rice, plum tomatoes, peppers, onion and ripe plantain." },
    },
    {
      title: 'You see what you can cook.',
      text: 'Sustena suggests meals you can make with what’s in your pantry, and shows what else each one needs.',
      tone: 'light-ink-shadow',
      screen: { src: screenPantryMatches, ...SCREEN, alt: 'Eleven recipes matched to the pantry, including Jollof Rice & Chicken and Beans & Plantain.' },
    },
    {
      title: 'You plan your week.',
      text: 'Sustena plans breakfast, lunch and dinner for the whole week and keeps it within your budget.',
      tone: 'light',
      screen: { src: screenWeekPlan, ...SCREEN, alt: 'A seven-day meal plan with breakfast, lunch and dinner, made around a budget.' },
    },
    {
      title: 'It becomes your next order.',
      text: 'Turn your meal plan, or any recipe, into one shopping list with prices, and order it. When it arrives, it goes into your pantry, just like the last one.',
      tone: 'dark',
      screen: { src: screenJollofList, ...SCREEN, alt: 'A shopping list made from the Jollof Rice & Chicken recipe, with a price for each item.' },
      cta: true,
    },
  ],
};

export interface Tile {
  title?: string;
  text?: string;
  photo?: Picture;
  screen?: Picture;
}

export const kitchen: { lines: string[]; statement: string; tiles: Tile[] } = {
  lines: ['Made for a', 'Nigerian kitchen.'],
  statement: 'Sustena plans with the food you already cook, and your shopping list uses the sizes you’d buy at the market.',
  tiles: [
    {
      title: 'The meals you already cook',
      text: 'There are recipes for jollof rice, egusi soup, beans and plantain, and akara and pap. Change the number of servings and the amounts change with it.',
      photo: { src: jollof, width: 1298, height: 1212, alt: 'A plate of jollof rice with grilled chicken and fried plantain.' },
    },
    {
      title: 'Planned around your budget',
      text: 'Tell it you have ₦7,000 for the day, and it plans breakfast, lunch and dinner that cost less than that. If three meals won’t fit, it tells you the lowest budget that will.',
      screen: { src: screenBudget, ...SCREEN, alt: 'The budget planner with ₦5,000 picked: akara and pap for breakfast, beans and plantain for lunch, and a veggie stir fry for dinner.' },
    },
    {
      title: 'In the sizes you buy',
      text: 'Recipes can show Nigerian measures. If egusi soup needs 200 g of egusi, your shopping list says one congo measure, and ugwu is listed by the bunch.',
      photo: { src: basket, width: 1100, height: 1027, alt: 'A woven basket of tomatoes, red peppers, scotch bonnets, onions and green leaves.' },
    },
    {
      title: 'A price on every item',
      text: 'Every item on your shopping list has an estimated price in naira, so you know roughly what you’ll spend before you order.',
      screen: { src: screenEgusiList, ...SCREEN, alt: 'The egusi soup shopping list: one congo measure of ground egusi, one bunch of ugwu leaves, each with a price in naira.' },
    },
    {
      photo: { src: counter, width: 1836, height: 857, alt: 'Hands slicing tomatoes and peppers on a chopping board in a sunlit kitchen.' },
    },
  ],
};

export const questions = {
  title: 'Questions',
  items: [
    {
      q: 'What is Sustena?',
      a: 'Sustena is a meal planner. It looks at your budget, what’s in your kitchen and what you like, suggests meals that fit, and turns the ones you pick into a shopping list.',
    },
    { q: 'Is it free?', a: 'Yes, there’s a free version. Paid features are coming soon.' },
    { q: 'Where can I use it?', a: 'Go to app.getsustena.com in your browser. Grocery delivery starts in Lagos, but the meal planner works wherever you are.' },
    {
      q: 'What if my budget is tight?',
      a: 'Start with whatever you have for the day. The budget planner keeps breakfast, lunch and dinner within it, and if that isn’t enough for three meals, it tells you how much more you’d need.',
    },
    {
      q: 'Can it use what I already have at home?',
      a: 'Yes. Add what’s in your kitchen to your pantry, and Sustena shows the meals you can cook with it and what else you’d need.',
    },
    {
      q: 'Is it only Nigerian food?',
      a: 'No. It’s built around Nigerian meals, and it also has dishes like grilled tilapia, oats porridge and veggie stir fry.',
    },
    { q: 'Is it a diet app?', a: 'No. It helps you decide what to eat from day to day. It doesn’t replace advice from your doctor.' },
  ],
};

export const footer = {
  statement: 'Sustena makes deciding what to eat easier.',
  navLabel: 'Footer',
  links: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Made for a Nigerian kitchen', href: '#kitchen' },
    { label: 'Questions', href: '#questions' },
  ],
  place: 'Starting in Lagos',
  copyright: '© 2026 Sustena',
};
