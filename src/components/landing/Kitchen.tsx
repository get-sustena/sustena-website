import { useLayoutEffect, useRef } from 'react';
import { kitchen } from '../../content/landing';
import { gsap, MOTION, ScrollTrigger, WIDE } from '../../lib/gsap';

// Where each tile sits in the loose mosaic, and the shape of its picture, on phones and then on wide screens.
const LAYOUT = [
  { tile: 'wide:col-span-7', pic: 'aspect-[4/5] wide:aspect-[5/4]' },
  { tile: 'wide:col-span-4 wide:col-start-9 wide:mt-[220px]', pic: 'aspect-square wide:aspect-[4/5]', phone: 'wide:w-[min(300px,70%)]' },
  { tile: 'wide:col-span-5 wide:col-start-1 wide:-mt-[60px]', pic: 'aspect-[4/5] wide:aspect-square' },
  { tile: 'wide:col-span-6 wide:col-start-7 wide:mt-20', pic: 'aspect-square wide:aspect-[6/5]', phone: 'wide:w-[min(280px,46%)]' },
  { tile: 'wide:col-span-11 wide:col-start-2', pic: 'aspect-[4/3] wide:aspect-[21/9]' },
];

export function Kitchen() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    // The heading's lines rise once, out of their own slots, when the heading is well into view.
    mm.add(MOTION, () => {
      const title = titleRef.current!;
      const lines = gsap.utils.toArray<HTMLElement>('[data-line]', title);
      gsap.set(lines, { yPercent: 105 });
      ScrollTrigger.create({
        trigger: title,
        start: () => `top bottom-=${title.offsetHeight * 0.4}`,
        once: true,
        onEnter: () => gsap.to(lines, { yPercent: 0, duration: 0.9, ease: 'sustena-out', stagger: 0.11 }),
      });
    });

    // Each picture drifts a little inside its frame as the page moves past it; phones sink into their frames.
    mm.add(`${WIDE} and ${MOTION}`, () => {
      gsap.utils.toArray<HTMLElement>('[data-pic]', sectionRef.current).forEach((pic) => {
        const photo = pic.querySelector<HTMLElement>('[data-photo]');
        const phone = pic.querySelector<HTMLElement>('[data-phone]');
        const scrollTrigger = { trigger: pic, start: 'top bottom', end: 'bottom top', scrub: true };
        if (photo) gsap.fromTo(photo, { yPercent: 0 }, { yPercent: -13, ease: 'none', scrollTrigger });
        if (phone) gsap.fromTo(phone, { yPercent: 0 }, { yPercent: 13, ease: 'none', scrollTrigger });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="kitchen" aria-labelledby="kitchen-title" className="px-4 pt-[100px] pb-[110px] wide:px-11 wide:pt-[150px] wide:pb-[180px]">
      <h2
        ref={titleRef}
        id="kitchen-title"
        className="font-display text-[13.2vw] leading-[0.86] font-extrabold tracking-[-0.05em] wide:text-[clamp(2.9rem,0.3rem+13.4vw,14.5rem)] wide:tracking-[-0.055em]"
      >
        {/* The space after each line keeps the words apart for search engines and screen readers. */}
        {kitchen.lines.map((line) => (
          <span key={line} className="block overflow-clip pb-[0.06em]">
            <span data-line className="block">
              {line}
            </span>{' '}
          </span>
        ))}
      </h2>
      <p className="mt-7 max-w-[21em] font-display text-[1.35rem] leading-[1.14] font-semibold tracking-[-0.02em] text-pretty wide:mt-12 wide:ml-[50%] wide:text-[clamp(1.4rem,0.9rem+1.3vw,2.3rem)]">
        {kitchen.statement}
      </p>

      <div className="mt-[72px] grid grid-cols-1 gap-14 wide:mt-[140px] wide:grid-cols-12 wide:items-start wide:gap-x-6 wide:gap-y-24">
        {kitchen.tiles.map((tile, i) => {
          const layout = LAYOUT[i];
          return (
            <figure key={tile.title ?? tile.photo?.alt} className={layout.tile}>
              {tile.photo && (
                <div data-pic className={`relative overflow-clip rounded-[14px] ${layout.pic}`}>
                  <img data-photo src={tile.photo.src} alt={tile.photo.alt} width={tile.photo.width} height={tile.photo.height} loading="lazy" className="size-full object-cover wide:motion-safe:h-[116%]" />
                </div>
              )}
              {tile.screen && (
                // App screens sit in an outlined frame, the drawn phone standing on its bottom edge.
                <div data-pic className={`relative flex items-end justify-center overflow-clip rounded-[14px] border-2 border-ink pt-10 ${layout.pic}`}>
                  <div data-phone className={`h-full w-[58%] overflow-clip rounded-t-[42px] border-2 border-b-0 border-ink bg-white px-[9px] pt-[9px] ${layout.phone ?? ''}`}>
                    <img src={tile.screen.src} alt={tile.screen.alt} width={tile.screen.width} height={tile.screen.height} loading="lazy" className="size-full rounded-t-[34px] object-cover object-top" />
                  </div>
                </div>
              )}
              {tile.title && (
                <figcaption className="mt-5 max-w-[30em] text-[15px] leading-[1.55] text-soft wide:text-base">
                  <b className="mb-1.5 block font-display text-[20px] font-bold tracking-[-0.015em] text-ink wide:text-[22px]">{tile.title}</b>
                  {tile.text}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}
