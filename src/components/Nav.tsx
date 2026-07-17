import { css } from '../lib/css';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { ResolvedLineMark } from './icons/ResolvedLineMark';
import { WAITLIST_FORM_URL } from '../lib/constants';
import { smoothScrollTo } from '../lib/scroll';

// Matches the html { scroll-padding-top } fallback in global.css — kept in sync so both the
// JS-driven scroll here and a plain (no-JS) anchor jump land in the same place under the nav.
const NAV_OFFSET = 84;

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const targetY = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  smoothScrollTo(targetY);
}

export function Nav() {
  const vw = useViewportWidth();
  const isMobile = vw < 640;

  const navLinksStyle = css(
    `display:${isMobile ? 'none' : 'flex'}; align-items:center; gap:clamp(16px,2.4vw,30px); font-size:14.5px; color:#1B211C; font-weight:500; font-family:'Space Grotesk',sans-serif;`
  );

  return (
    <nav
      style={css(
        `position:fixed; top:0; left:0; right:0; z-index:50; display:flex; align-items:center; justify-content:space-between; padding:clamp(12px,2.6vw,18px) clamp(18px,4.5vw,48px); background:rgba(255,255,255,0.9); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border-bottom:1px solid #DBDFD3; box-shadow:0 12px 32px -20px rgba(23,41,30,0.35);`
      )}
    >
      <div style={css('display:flex; align-items:flex-end; gap:9px;')}>
        <ResolvedLineMark fill="#17291E" tight h={22} />
        <span
          style={css(
            `font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:clamp(19px,4.4vw,23px); line-height:0.8; letter-spacing:-0.01em; color:#17291E;`
          )}
        >
          Sus<span style={{ color: '#279a5f' }}>Tena</span>
        </span>
      </div>
      <div style={css('display:flex; align-items:center; gap:clamp(14px,3vw,36px);')}>
        <div style={navLinksStyle}>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} style={{ color: 'inherit' }}>
            Features
          </a>
          <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} style={{ color: 'inherit' }}>
            How it Works
          </a>
          <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} style={{ color: 'inherit' }}>
            FAQ
          </a>
        </div>
        <a
          href={WAITLIST_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={css(
            `background:#E3A62E; color:#1B211C; padding:clamp(8px,2vw,10px) clamp(14px,3.4vw,20px); border-radius:12px; font-size:clamp(12.5px,3vw,14px); font-weight:600; font-family:'Space Grotesk',sans-serif; white-space:nowrap;`
          )}
        >
          Join Waitlist
        </a>
      </div>
    </nav>
  );
}
