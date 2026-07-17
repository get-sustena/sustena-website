import { css } from '../lib/css';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { CEIcon } from './icons/CEIcon';
import { WAITLIST_FORM_URL } from '../lib/constants';

const BENEFITS = [
  'Early access before public launch',
  'Product updates as we build',
  'Opportunities to influence new features',
  'Free access during beta',
];

export function WhyJoin() {
  const vw = useViewportWidth();
  const isMobile = vw < 640;
  const isCompact = vw < 1024;

  const whyJoinCardStyle = css(
    `position:relative; max-width:880px; margin:0 auto; background:#FEFCF6; border:1px solid #DCD3B4; border-radius:${isMobile ? '24px' : '30px'}; box-shadow:0 46px 100px -32px rgba(0,0,0,0.5), 0 10px 28px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.6) inset; padding:${isCompact ? 'clamp(28px,6vw,36px) clamp(22px,6vw,28px)' : '48px 56px'}; box-sizing:border-box;`
  );
  const whyJoinBenefitsGridStyle = css(
    `display:grid; grid-template-columns:${isMobile ? '1fr' : 'repeat(2,1fr)'}; gap:${isCompact ? '18px' : '24px'}; margin-bottom:${isCompact ? '26px' : '36px'};`
  );
  const whyJoinDividerStyle = css(`height:1px; background:#EDE7D4; margin-bottom:${isCompact ? '22px' : '30px'};`);

  return (
    <section
      data-screen-label="Why Join"
      style={{ position: 'relative', background: 'radial-gradient(ellipse at 50% 110%, #24422f 0%, #17291E 55%)', padding: 'clamp(80px,14vw,140px) clamp(22px,6vw,48px)' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#34B673',
            fontWeight: 500,
            marginBottom: 20,
          }}
        >
          Join The Waitlist
        </div>
        <div
          style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(30px,4.2vw,50px)',
            color: '#FAF7EE',
            lineHeight: 1.14,
            marginBottom: 20,
          }}
        >
          Why join the waitlist?
        </div>
        <div
          style={{
            fontSize: 'clamp(14.5px,3vw,16.5px)',
            lineHeight: 1.75,
            color: 'rgba(250,247,238,0.62)',
            maxWidth: 560,
            margin: '0 auto clamp(32px,6vw,48px)',
            fontFamily: "'Space Grotesk',sans-serif",
          }}
        >
          Sustena is currently in development. By joining the waitlist, you'll receive:
        </div>
      </div>

      <div style={whyJoinCardStyle}>
        <div style={whyJoinBenefitsGridStyle}>
          {BENEFITS.map((text) => (
            <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#34B673',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 2,
                }}
              >
                <CEIcon icon="check" size={13} color="#FFFFFF" stroke={2.8} />
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15.5, color: '#2B3128', fontWeight: 500, lineHeight: 1.5 }}>{text}</div>
            </div>
          ))}
        </div>

        <div style={whyJoinDividerStyle} />

        <div style={{ textAlign: 'center' }}>
          <a
            href={WAITLIST_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="waitlist-btn"
            style={{
              display: 'inline-block',
              color: '#1B211C',
              padding: '15px 34px',
              borderRadius: 12,
              fontSize: 15.5,
              fontWeight: 700,
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            Join Waitlist
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '28px auto 0', textAlign: 'center', fontSize: 13.5, color: 'rgba(250,247,238,0.5)', fontFamily: "'Space Grotesk',sans-serif" }}>
        Some advanced features will become part of our premium plans after beta, but everyone who joins the waitlist will be among the first to experience
        what we're building.
      </div>
    </section>
  );
}
