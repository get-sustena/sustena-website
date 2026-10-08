import lockup from '../../assets/images/logo/sustena-lockup-ink.svg';
import { openApp } from '../../content/landing';
import { APP_URL } from '../../lib/constants';
import { ChunkyLink } from './ChunkyLink';

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-5 flex items-center justify-between p-4 wide:px-11 wide:py-[22px]">
      <a href="/" aria-label="Sustena home">
        <img src={lockup} alt="Sustena" className="h-[19px] w-auto wide:h-[22px]" />
      </a>
      <ChunkyLink href={APP_URL} size="sm">
        {openApp}
      </ChunkyLink>
    </header>
  );
}
