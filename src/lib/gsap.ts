import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

// The only place GSAP plugins are registered.
gsap.registerPlugin(ScrollTrigger, CustomEase);

// The same curves as the CSS tokens in landing.css: things arriving, and things moving between two states.
CustomEase.create('sustena-out', '0.2,0,0,1');
CustomEase.create('sustena-move', '0.65,0,0.35,1');

export const WIDE = '(min-width: 861px)';
export const MOTION = '(prefers-reduced-motion: no-preference)';

export { gsap, ScrollTrigger };
