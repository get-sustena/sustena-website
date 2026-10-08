import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { howItWorks, openApp, type SlabTone } from '../../content/landing';
import { APP_URL } from '../../lib/constants';
import { gsap, MOTION, WIDE } from '../../lib/gsap';
import { ChunkyLink } from './ChunkyLink';

const TONES: Record<SlabTone, { slab: string; tone: string; phone: string }> = {
  light: { slab: 'bg-white', tone: 'var(--color-green)', phone: 'border-ink' },
  dark: { slab: 'bg-ink text-on-dark', tone: 'var(--color-green)', phone: 'border-on-dark' },
  'light-ink-shadow': { slab: 'bg-white', tone: 'var(--color-ink)', phone: 'border-ink' },
};

export function HowItWorks() {
  const deckRef = useRef<HTMLDivElement>(null);

  // Each slab eases back a little as the next one slides over it.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(`${WIDE} and ${MOTION}`, () => {
      const slabs = gsap.utils.toArray<HTMLElement>('[data-slab]', deckRef.current);
      slabs.slice(0, -1).forEach((slab, i) => {
        const stuckAt = () => parseFloat(getComputedStyle(slab).top);
        gsap.fromTo(
          slab,
          { scale: 1 },
          {
            scale: 0.95,
            ease: 'none',
            scrollTrigger: {
              trigger: slabs[i + 1],
              start: () => `top ${stuckAt() + innerHeight * 0.8}px`,
              end: () => `top ${stuckAt()}px`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="px-4 pt-[200px] pb-[100px] wide:px-11 wide:pt-[240px] wide:pb-[170px]">
      <h2 id="how-it-works-title" className="font-display text-[clamp(2.6rem,1.4rem+3.4vw,4.8rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
        {howItWorks.title}
      </h2>
      <p className="mt-[18px] max-w-[30em] text-[clamp(1.125rem,1rem+0.4vw,1.35rem)] leading-normal text-soft">{howItWorks.line}</p>

      {/* Each slab sticks a little lower than the one before, so the stack keeps an edge of every earlier step in view. */}
      <div ref={deckRef} className="mt-10 grid gap-[26px] wide:mt-16 wide:block">
        {howItWorks.slabs.map((slab, i) => {
          const tone = TONES[slab.tone];
          return (
            <article
              key={slab.title}
              data-slab
              style={{ '--i': i, '--tone': tone.tone } as CSSProperties}
              className={`relative grid origin-top grid-cols-1 overflow-clip rounded-3xl border-2 border-ink shadow-[5px_5px_0_var(--tone)] wide:sticky wide:top-[calc(88px+var(--i)*18px)] wide:mb-[22vh] wide:min-h-[min(74vh,620px)] wide:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] wide:rounded-[32px] wide:shadow-[8px_8px_0_var(--tone)] wide:last:mb-0 ${tone.slab}`}
            >
              <div className="flex flex-col justify-center px-[22px] pt-7 pb-1 wide:p-14">
                <h3 className="max-w-[8.5em] font-display text-[clamp(2.2rem,1.2rem+2.6vw,4rem)] leading-none font-extrabold tracking-[-0.035em] text-balance">{slab.title}</h3>
                <p className="mt-5 max-w-[22em] text-base leading-normal opacity-85 wide:text-[19px]">{slab.text}</p>
                {slab.cta && (
                  <ChunkyLink href={APP_URL} className="mt-[34px] self-start">
                    {openApp}
                  </ChunkyLink>
                )}
              </div>
              {slab.photo && (
                <div className="mt-6 aspect-[4/3] border-t-2 border-ink wide:mt-0 wide:aspect-auto wide:border-t-0 wide:border-l-2">
                  <img src={slab.photo.src} alt={slab.photo.alt} width={slab.photo.width} height={slab.photo.height} loading="lazy" className="size-full object-cover" />
                </div>
              )}
              {slab.screen && (
                // The drawn phone stands on the slab's bottom edge and is cut by it.
                <div className="flex h-[360px] items-end justify-center pt-6 wide:h-auto wide:pt-12">
                  <div className={`h-full w-[240px] overflow-clip rounded-t-[36px] border-2 border-b-0 bg-white px-[9px] pt-[9px] wide:h-[92%] wide:w-[min(330px,78%)] wide:rounded-t-[46px] ${tone.phone}`}>
                    <img src={slab.screen.src} alt={slab.screen.alt} width={slab.screen.width} height={slab.screen.height} loading="lazy" className="size-full rounded-t-[28px] object-cover object-top wide:rounded-t-[38px]" />
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
