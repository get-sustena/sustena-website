import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { hero, openApp } from '../../content/landing';
import { APP_URL } from '../../lib/constants';
import { gsap, MOTION, ScrollTrigger } from '../../lib/gsap';
import { ChunkyLink } from './ChunkyLink';

// The screens step through on their own, and wait a while after someone picks one.
const STEP_MS = 3200;
const HOLD_MS = 9000;

export function Hero() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const screensRef = useRef<HTMLDivElement>(null);
  const resumeAt = useRef(0);
  const settled = useRef(false);

  // The picked screen rises into place as the others fade and drop away.
  useLayoutEffect(() => {
    const shots = gsap.utils.toArray<HTMLImageElement>('[data-screen]', screensRef.current);
    const instant = !settled.current || !matchMedia(MOTION).matches;
    shots.forEach((shot, i) => {
      const on = i === active;
      gsap.to(shot, { autoAlpha: on ? 1 : 0, duration: instant ? 0 : 0.45, ease: 'sustena-out', overwrite: 'auto' });
      gsap.to(shot, { yPercent: on ? 0 : 6, duration: instant ? 0 : 0.6, ease: 'sustena-out', overwrite: 'auto' });
    });
    settled.current = true;
  }, [active]);

  useEffect(() => {
    if (!matchMedia(MOTION).matches) return;
    let onScreen = true;
    const watch = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => {
        onScreen = self.isActive;
      },
    });
    const timer = window.setInterval(() => {
      if (!onScreen || document.hidden || performance.now() < resumeAt.current) return;
      setActive((i) => (i + 1) % hero.screens.length);
    }, STEP_MS);
    return () => {
      window.clearInterval(timer);
      watch.kill();
    };
  }, []);

  // An event's timeStamp is on the same clock as performance.now().
  function pick(i: number, at: number) {
    setActive(i);
    resumeAt.current = at + HOLD_MS;
  }

  return (
    <section
      ref={sectionRef}
      className="relative grid grid-cols-1 items-start px-4 pt-[92px] wide:min-h-[max(100svh,720px)] wide:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] wide:items-center wide:px-11 wide:pt-24"
    >
      <div className="pb-10 wide:pb-16">
        <p className="text-[15px] wide:text-[18px]">{hero.note}</p>
        <h1 className="mt-4 max-w-[9.5em] font-display text-[clamp(3rem,1.4rem+4.4vw,5.6rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance wide:mt-[22px]">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-[30em] text-[clamp(1.125rem,1rem+0.4vw,1.4rem)] leading-normal text-pretty text-soft wide:mt-6">{hero.lead}</p>
        <ChunkyLink href={APP_URL} size="lg" className="mt-7 wide:mt-10">
          {openApp}
        </ChunkyLink>
      </div>

      {/* The phone is drawn, not photographed: an outline with the app inside it, standing on the section's foot. */}
      <div className="relative mt-2 flex w-full flex-col items-center wide:mt-0 wide:ml-20 wide:block wide:w-[clamp(300px,27vw,380px)] wide:self-end wide:justify-self-center">
        <ul
          aria-label={hero.tabsLabel}
          className="mb-[22px] flex flex-wrap justify-center gap-2.5 wide:absolute wide:top-16 wide:right-[calc(100%-26px)] wide:z-3 wide:mb-0 wide:grid wide:gap-3.5"
        >
          {hero.screens.map((screen, i) => (
            <li key={screen.tab}>
              <button
                type="button"
                aria-pressed={i === active}
                onClick={(e) => pick(i, e.timeStamp)}
                onPointerEnter={(e) => {
                  if (matchMedia('(hover: hover)').matches) pick(i, e.timeStamp);
                }}
                className={`inline-flex cursor-pointer items-center justify-start rounded-[13px] border-2 border-ink px-3 py-2 text-[14px] font-semibold whitespace-nowrap shadow-[4px_4px_0_var(--color-green)] transition-[translate,box-shadow,background-color,color] duration-150 ease-out hover:shadow-[4px_4px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_var(--color-green)] wide:px-4 wide:py-2.5 wide:text-[16px] ${
                  i === active ? 'bg-ink text-on-dark' : 'bg-white text-ink'
                }`}
              >
                {screen.tab}
              </button>
            </li>
          ))}
        </ul>
        <div
          className={`relative -mb-[140px] aspect-[390/844] w-[min(300px,78vw)] overflow-clip rounded-[56px] border-2 border-ink bg-white transition-[box-shadow] duration-400 ease-move wide:mb-0 wide:w-full wide:translate-y-[22%] ${
            active % 2 ? 'shadow-[8px_8px_0_var(--color-ink)]' : 'shadow-[8px_8px_0_var(--color-green)]'
          }`}
        >
          <div className="absolute inset-x-0 top-[22px] z-2 mx-auto h-[26px] w-[30%] rounded-full bg-ink" />
          <div ref={screensRef} className="absolute inset-2.5 overflow-clip rounded-[46px] bg-white">
            {hero.screens.map((screen) => (
              <img key={screen.tab} data-screen src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} className="absolute inset-0 size-full object-cover object-top" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
