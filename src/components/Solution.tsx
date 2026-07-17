import { css } from '../lib/css';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { CEIcon } from './icons/CEIcon';

const SOLUTION_ITEMS = [
  'Plan your meals.',
  'Know exactly what to buy.',
  'Discover meals you can already cook.',
  'Follow recipes one step at a time.',
];

export function Solution() {
  const vw = useViewportWidth();
  const isCompact = vw < 1024;

  const solutionGridStyle = css(
    `position:relative; max-width:1120px; margin:0 auto; display:grid; grid-template-columns:${isCompact ? '1fr' : '1.1fr 0.9fr'}; gap:${isCompact ? 'clamp(40px,8vw,60px)' : '80px'}; align-items:start;`
  );

  return (
    <section data-screen-label="Solution" style={{ position: 'relative', background: '#FAF7EE', padding: 'clamp(80px,14vw,140px) clamp(22px,6vw,48px)', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: -160,
          right: -140,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,182,115,0.14) 0%, rgba(52,182,115,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -180,
          left: -120,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(227,166,46,0.12) 0%, rgba(227,166,46,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={solutionGridStyle}>
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#279a5f',
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            The Solution
          </div>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(32px,4.2vw,52px)',
              color: '#1B211C',
              lineHeight: 1.12,
              marginBottom: 24,
            }}
          >
            Sustena turns decisions into dinner.
          </div>
          <div style={{ fontSize: 16.5, lineHeight: 1.75, color: '#5C6459', maxWidth: 460, marginBottom: 20, fontFamily: "'Space Grotesk',sans-serif" }}>
            Instead of jumping between different apps and making everything yourself, Sustena brings the entire cooking journey together.
          </div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 600, fontSize: 'clamp(19px,2.1vw,24px)', color: '#17291E' }}>
            Everything happens in one place.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SOLUTION_ITEMS.map((text, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: '#FFFFFF',
                border: '1px solid #DBDFD3',
                borderRadius: 16,
                padding: '20px 24px',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#34B673',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CEIcon icon="check" size={15} color="#FFFFFF" stroke={2.6} />
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16.5, fontWeight: 600, color: '#1B211C' }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
