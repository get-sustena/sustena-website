import { useState } from 'react';
import { CEIcon } from './icons/CEIcon';

const FAQS = [
  { q: 'Is Sustena free?', a: 'Yes. Sustena will be free throughout beta. Some advanced features will become premium after beta.' },
  { q: 'Is Sustena only for Nigerian meals?', a: 'Sustena is built specifically for Nigerian kitchens and the foods you eat every day.' },
  {
    q: 'Can I plan meals with ingredients I already have?',
    a: "Yes. That's one of our favorite features. Tell Sustena what's already in your kitchen and we'll recommend meals you can cook right away.",
  },
  { q: 'When will Sustena launch?', a: "Join the waitlist and we'll let you know as soon as early access begins." },
];

// Generate schema from visible content because search engines require them to match.
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" data-screen-label="FAQ" style={{ position: 'relative', background: '#F2EEE3', padding: 'clamp(80px,14vw,140px) clamp(22px,6vw,48px) clamp(90px,15vw,160px)' }}>
      <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
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
            FAQ
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(32px,4.2vw,50px)', color: '#1B211C', lineHeight: 1.14, margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        {FAQS.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={f.q} style={{ borderBottom: '1px solid #DBDFD3', padding: '26px 4px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 20 }}
                onClick={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
              >
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600, color: '#1B211C', margin: 0 }}>{f.q}</h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transform: `rotate(${isOpen ? 180 : 0}deg)`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <CEIcon icon="chevronDown" size={18} color="#17291E" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.35s ease' }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ paddingTop: 14, fontSize: 15.5, lineHeight: 1.7, color: '#5C6459', fontFamily: "'Space Grotesk',sans-serif", maxWidth: 640 }}>
                    {f.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
