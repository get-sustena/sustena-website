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
  lead: 'Plan your meals, and Sustena turns them into one grocery list, priced and delivered to your door every week or month.',
  tabsLabel: 'App screens',
  screens: [
    { tab: 'Meal plan', src: screenMealPlan, ...SCREEN, alt: "Sustena's budget planner: a ₦10,000 budget turned into breakfast, lunch and dinner for one day." },
    { tab: 'Recipes', src: screenRecipe, ...SCREEN, alt: 'A recipe for Fisherman Soup, with servings you can adjust and ingredients in metric or Nigerian units.' },
    { tab: 'Grocery list', src: screenGroceryList, ...SCREEN, alt: 'A monthly grocery list of twelve items with prices and the next delivery date.' },
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
  line: 'It starts at your door, and it comes back round to it.',
  slabs: [
    {
      title: 'Your groceries arrive.',
      text: 'At your door, every week or month, on the schedule you pick.',
      tone: 'light',
      photo: { src: doorstep, width: 1298, height: 1212, alt: 'A delivery rider hands a woman a paper bag of vegetables at her door.' },
    },
    {
      title: 'They go into your pantry.',
      text: 'So Sustena knows what you’ve already got at home.',
      tone: 'dark',
      screen: { src: screenPantry, ...SCREEN, alt: "Sustena's pantry with nine ingredients, including rice, plum tomatoes, peppers, onion and ripe plantain." },
    },
    {
      title: 'You see what you can cook.',
      text: 'Meals that use what’s in your pantry, and what else you’d need for each.',
      tone: 'light-ink-shadow',
      screen: { src: screenPantryMatches, ...SCREEN, alt: 'Eleven recipes matched to the pantry, including Jollof Rice & Chicken and Beans & Plantain.' },
    },
    {
      title: 'You plan your week.',
      text: 'Breakfast, lunch and dinner for the whole week, around your budget.',
      tone: 'light',
      screen: { src: screenWeekPlan, ...SCREEN, alt: 'A seven-day meal plan with breakfast, lunch and dinner, made around a budget.' },
    },
    {
      title: 'It becomes your next order.',
      text: 'Turn a meal plan or any recipe into one shopping list with prices, and order it. Then it starts again.',
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
  statement: 'Sustena plans with the food you already cook, in the sizes you buy it, with an estimated price in naira on every item.',
  tiles: [
    {
      title: 'The meals you already cook',
      text: 'Jollof rice, egusi soup, beans and plantain, akara and pap. Every recipe scales to however many people you’re feeding.',
      photo: { src: jollof, width: 1298, height: 1212, alt: 'A plate of jollof rice with grilled chicken and fried plantain.' },
    },
    {
      title: 'Planned around what you have',
      text: 'Give it ₦5,000 for the day and it plans breakfast, lunch and dinner inside it. If your budget’s too tight for three meals, it tells you the smallest amount that works.',
      screen: { src: screenBudget, ...SCREEN, alt: 'The budget planner with ₦5,000 picked: akara and pap for breakfast, beans and plantain for lunch, and a veggie stir fry for dinner.' },
    },
    {
      title: 'In the sizes you buy',
      text: 'Recipes can switch to Nigerian units. When egusi soup needs 200 g of egusi, your list asks for one congo measure, and the ugwu comes by the bunch.',
      photo: { src: basket, width: 1100, height: 1027, alt: 'A woven basket of tomatoes, red peppers, scotch bonnets, onions and green leaves.' },
    },
    {
      title: 'A price on every item',
      text: 'Every item on your list has an estimated price in naira, so you know roughly what you’ll spend before you order.',
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
      a: 'A meal planner that helps you decide what to eat. It looks at your budget, what’s in your kitchen and what you like, suggests meals that fit, and turns them into a shopping list.',
    },
    { q: 'Is it free?', a: 'Yes, there’s a free version. Paid features are coming soon.' },
    { q: 'Where can I use it?', a: 'In your browser, at app.getsustena.com. We’re starting in Lagos, but the planner works wherever you are.' },
    {
      q: 'What if my budget is tight?',
      a: 'Tell the budget planner what you’ve got for the day and it plans breakfast, lunch and dinner inside it. If that’s too tight for three meals, it tells you the smallest amount that works.',
    },
    {
      q: 'Can it use what I already have at home?',
      a: 'Yes. Add what’s in your kitchen to your pantry, and Sustena shows the meals you can cook with it and what else you’d need.',
    },
    {
      q: 'Is it only Nigerian food?',
      a: 'No. It’s built around the meals people cook here, like jollof, egusi soup and akara and pap, but there are others too, such as grilled tilapia, oats porridge and veggie stir fry.',
    },
    { q: 'Is it a diet app?', a: 'No. Sustena helps with everyday food decisions, not strict diets, and it isn’t a replacement for a doctor’s advice.' },
  ],
};

export const footer = {
  statement: 'Making better food decisions easier for everyone.',
  navLabel: 'Footer',
  links: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Made for a Nigerian kitchen', href: '#kitchen' },
    { label: 'Questions', href: '#questions' },
  ],
  place: 'Starting in Lagos',
  copyright: '© 2026 Sustena',
};
