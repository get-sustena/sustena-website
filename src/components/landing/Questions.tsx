import { useLayoutEffect, useRef, useState } from 'react';
import { questions } from '../../content/landing';
import { gsap, MOTION } from '../../lib/gsap';

// Generate schema from visible content because search engines require them to match.
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

export function Questions() {
  const [open, setOpen] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const settled = useRef(false);

  // One answer open at a time: it slides open while the last one closes, and its plus turns into a cross.
  useLayoutEffect(() => {
    const duration = settled.current && matchMedia(MOTION).matches ? 0.32 : 0;
    gsap.utils.toArray<HTMLElement>('[data-answer]', listRef.current).forEach((answer, i) => {
      gsap.to(answer, { height: i === open ? 'auto' : 0, duration, ease: 'sustena-move', overwrite: 'auto' });
    });
    gsap.utils.toArray<HTMLElement>('[data-plus]', listRef.current).forEach((plus, i) => {
      gsap.to(plus, { rotate: i === open ? 45 : 0, duration, ease: 'sustena-move', overwrite: 'auto' });
    });
    settled.current = true;
  }, [open]);

  return (
    <section
      id="questions"
      aria-labelledby="questions-title"
      className="grid grid-cols-1 items-start gap-7 px-4 pt-6 pb-[110px] wide:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] wide:gap-16 wide:px-11 wide:pt-10 wide:pb-[180px]"
    >
      <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      {/* The heading holds on the left while the questions scroll past on the right. */}
      <div className="wide:sticky wide:top-[100px]">
        <h2 id="questions-title" className="font-display text-[clamp(2.6rem,1.4rem+3.4vw,4.8rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
          {questions.title}
        </h2>
      </div>
      <div ref={listRef} className="border-t-2 border-ink">
        {questions.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-hairline">
              <h3>
                <button
                  id={`question-${i}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`answer-${i}`}
                  onClick={() => setOpen((current) => (current === i ? null : i))}
                  className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left font-display text-[clamp(1.25rem,1rem+0.6vw,1.65rem)] font-bold tracking-[-0.02em] wide:py-6"
                >
                  {item.q}
                  {/* The outlined square takes the page's chunky-button look. */}
                  <span
                    data-plus
                    aria-hidden="true"
                    className={`grid size-[38px] flex-none place-items-center rounded-xl border-2 border-ink font-sans text-[22px] leading-none font-medium shadow-[4px_4px_0_var(--color-green)] transition-[background-color,color,box-shadow] duration-150 ease-out group-hover:shadow-[4px_4px_0_var(--color-ink)] wide:size-[42px] wide:text-2xl ${
                      isOpen ? 'bg-ink text-on-dark' : 'bg-white text-ink'
                    }`}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div id={`answer-${i}`} data-answer role="region" aria-labelledby={`question-${i}`} aria-hidden={!isOpen} className="h-0 overflow-hidden">
                <p className="max-w-[34em] pb-[26px] text-base leading-[1.55] text-soft wide:pb-7 wide:text-lg">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
