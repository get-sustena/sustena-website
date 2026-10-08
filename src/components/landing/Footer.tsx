import lockup from '../../assets/images/logo/sustena-lockup-ink.svg';
import { footer, openApp } from '../../content/landing';
import { APP_URL } from '../../lib/constants';
import { ChunkyLink } from './ChunkyLink';

export function Footer() {
  return (
    <footer className="px-4 pb-7 wide:px-11 wide:pb-9">
      {/* A chunky outlined card for the last word, then a plain line of links. */}
      <div className="grid grid-cols-1 gap-7 rounded-3xl border-2 border-ink px-6 py-9 shadow-[5px_5px_0_var(--color-green)] wide:grid-cols-[minmax(0,1fr)_auto] wide:items-end wide:gap-12 wide:rounded-[32px] wide:px-14 wide:py-16 wide:shadow-[8px_8px_0_var(--color-green)]">
        <p className="max-w-[11em] font-display text-[clamp(2.4rem,1.2rem+3.2vw,4.6rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance">{footer.statement}</p>
        <ChunkyLink href={APP_URL} size="lg" className="justify-self-start">
          {openApp}
        </ChunkyLink>
      </div>
      <div className="mt-11 flex flex-col items-start gap-4 text-[15px] text-soft wide:flex-row wide:flex-wrap wide:items-center wide:gap-x-10 wide:gap-y-5">
        <img src={lockup} alt="Sustena" className="h-[22px] w-auto wide:mr-auto" />
        <nav aria-label={footer.navLabel} className="flex flex-wrap gap-x-7 gap-y-2">
          {footer.links.map((link) => (
            <a key={link.href} href={link.href} className="text-ink underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-current">
              {link.label}
            </a>
          ))}
        </nav>
        <p>{footer.place}</p>
        <p>{footer.copyright}</p>
      </div>
    </footer>
  );
}
