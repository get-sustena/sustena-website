import { WAITLIST_FORM_URL } from '../lib/constants';

export function FinalCTA() {
  return (
    <section
      data-screen-label="Final CTA"
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% -20%, #24422f 0%, #17291E 55%)',
        padding: 'clamp(90px,15vw,160px) clamp(22px,6vw,48px)',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(32px,4.8vw,60px)', color: '#FAF7EE', lineHeight: 1.16, margin: 0, marginBottom: 8 }}>
        Stop asking what to cook.
      </h2>
      <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(32px,4.8vw,60px)', color: '#FAF7EE', lineHeight: 1.16, marginBottom: 36 }}>
        Start looking forward to mealtime.
      </div>
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, color: 'rgba(250,247,238,0.6)', marginBottom: 36 }}>Join the Sustena waitlist today.</div>
      <a
        href={WAITLIST_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: '#E3A62E',
          color: '#1B211C',
          padding: '16px 36px',
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 16,
          fontFamily: "'Space Grotesk',sans-serif",
        }}
      >
        Join the Waitlist
      </a>
      <div style={{ fontSize: 13.5, color: 'rgba(250,247,238,0.45)', fontFamily: "'Space Grotesk',sans-serif" }}>Launching soon. Be among the first to experience Sustena.</div>
    </section>
  );
}
