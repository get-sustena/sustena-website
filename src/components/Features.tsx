import { useState } from 'react';
import type { CSSProperties } from 'react';
import { css } from '../lib/css';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { CEIcon, type CEIconName } from './icons/CEIcon';

type FamilyName = 'plan' | 'cook';

const FAMILIES: Record<FamilyName, { tints: [string, string]; borders: [string, string]; texts: [string, string]; accent: string; iconBg: string; iconColor: string }> = {
  plan: { tints: ['#E7F3EC', '#F1F8F4'], borders: ['#BEE0CD', '#CFE8DA'], texts: ['#1f7048', '#3a6b52'], accent: '#34B673', iconBg: '#34B673', iconColor: '#FFFFFF' },
  cook: { tints: ['#F6EBD3', '#FBF3E1'], borders: ['#E7D2A2', '#EFDFB8'], texts: ['#8a5f13', '#93762f'], accent: '#E3A62E', iconBg: '#E3A62E', iconColor: '#1B211C' },
};

const STACK_ROT = [-6, -1, 4];

const FEATURE_STACKS: { label: string; fam: FamilyName; cards: { icon: CEIconName; title: string; desc: string }[] }[] = [
  {
    label: 'Plan',
    fam: 'plan',
    cards: [
      { icon: 'budget', title: 'Budget-first Planning', desc: 'Set a budget. We build the timetable around it.' },
      { icon: 'plan', title: "What's in My Kitchen?", desc: 'Tell us what you have. Get recipes that use it.' },
      { icon: 'cook', title: 'Nigerian Recipes', desc: 'Real meals, real ingredients you can find.' },
    ],
  },
  {
    label: 'Cook & Shop',
    fam: 'cook',
    cards: [
      { icon: 'shop', title: 'Automatic Shopping Lists', desc: 'Missing items become one tidy list.' },
      { icon: 'timer', title: 'Learn Mode', desc: 'Step-by-step guidance, not long recipe pages.' },
      { icon: 'ncd', title: 'Health & Fitness Planning', desc: 'Meals that match your goals, automatically.' },
    ],
  },
];

function stackCardCompact(i: number, fam: (typeof FAMILIES)[FamilyName]): CSSProperties {
  const isFront = i === 2;
  const bg = isFront ? '#FFFFFF' : fam.tints[i];
  const border = isFront ? fam.accent : fam.borders[i];
  return css(
    `position:relative; width:100%; border-radius:16px; padding:16px 18px; margin-bottom:12px; display:flex; flex-direction:column; gap:10px; box-sizing:border-box; border:2px solid ${border}; background:${bg}; ${isFront ? 'box-shadow:0 10px 24px rgba(23,41,30,0.1);' : 'box-shadow:0 4px 12px rgba(23,41,30,0.05);'}`
  );
}

function stackCardBase(i: number, fam: (typeof FAMILIES)[FamilyName]): CSSProperties {
  const offsets: [number, number][] = [
    [0, 0],
    [40, 26],
    [80, 52],
  ];
  const [tx, ty] = offsets[i];
  const isFront = i === 2;
  const bg = isFront ? '#FFFFFF' : fam.tints[i];
  const border = isFront ? fam.accent : fam.borders[i];
  return css(
    `position:absolute; left:0; top:0; width:256px; height:150px; border-radius:16px; padding:16px 18px; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; overflow:hidden; cursor:default;` +
      `transform:translate(${tx}px,${ty}px) rotate(${STACK_ROT[i]}deg) scale(1); transition:transform 0.35s cubic-bezier(.2,.8,.2,1), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;` +
      `border:2px solid ${border}; background:${bg}; z-index:${i + 1}; ${isFront ? 'box-shadow:0 16px 32px rgba(23,41,30,0.14);' : 'box-shadow:0 4px 12px rgba(23,41,30,0.05);'}`
  );
}

function stackCardHover(i: number, fam: (typeof FAMILIES)[FamilyName]): CSSProperties {
  const offsets: [number, number][] = [
    [-14, -58],
    [40, 26],
    [94, 60],
  ];
  const [tx, ty] = offsets[i];
  return css(
    `position:absolute; left:0; top:0; width:256px; height:150px; border-radius:16px; padding:16px 18px; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; overflow:hidden; cursor:default;` +
      `transform:translate(${tx}px,${ty}px) rotate(0deg) scale(1.06); transition:transform 0.35s cubic-bezier(.2,.8,.2,1), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;` +
      `border:2px solid ${fam.accent}; background:#FFFFFF; z-index:20; box-shadow:0 24px 48px rgba(23,41,30,0.22);`
  );
}

export function Features() {
  const vw = useViewportWidth();
  const isCompact = vw < 1024;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section
      id="features"
      data-screen-label="Features"
      style={{ position: 'relative', background: '#FAF7EE', padding: 'clamp(80px,14vw,140px) clamp(22px,6vw,48px)', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          top: -140,
          left: -120,
          width: 440,
          height: 440,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(227,166,46,0.13) 0%, rgba(227,166,46,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -160,
          right: -100,
          width: 460,
          height: 460,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,182,115,0.13) 0%, rgba(52,182,115,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(36px,7vw,70px)' }}>
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
            Features
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(30px,4.2vw,50px)', color: '#1B211C', lineHeight: 1.14, margin: 0 }}>
            Everything you need to plan meals better.
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 'clamp(18px,3vw,32px)', justifyContent: 'center', flexWrap: 'wrap', padding: '20px 0 10px' }}>
          {FEATURE_STACKS.map((grp, gi) => {
            const fam = FAMILIES[grp.fam];
            const stackWrapStyle: CSSProperties = isCompact
              ? { position: 'relative', width: '100%', maxWidth: 400 }
              : { position: 'relative', width: 336, height: 212 };
            return (
              <div
                key={grp.label}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #DBDFD3',
                  borderRadius: 24,
                  padding: 'clamp(24px,5vw,36px) clamp(22px,5.5vw,38px) clamp(30px,6.5vw,46px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: 400,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11.5,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#34B673',
                    fontWeight: 500,
                    marginBottom: 30,
                    textAlign: 'center',
                  }}
                >
                  {grp.label}
                </div>
                <div style={stackWrapStyle}>
                  {grp.cards.map((fc, i) => {
                    const key = `${gi}-${i}`;
                    const isHovered = hoveredCard === key;
                    const style = isCompact ? stackCardCompact(i, fam) : isHovered ? stackCardHover(i, fam) : stackCardBase(i, fam);
                    const textColor = i === 2 ? '#1B211C' : fam.texts[i];
                    return (
                      <div
                        key={key}
                        style={style}
                        onMouseEnter={isCompact ? undefined : () => setHoveredCard(key)}
                        onMouseLeave={isCompact ? undefined : () => setHoveredCard((prev) => (prev === key ? null : prev))}
                      >
                        <div style={{ minWidth: 0 }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 30,
                              height: 30,
                              borderRadius: 999,
                              background: fam.iconBg,
                              marginBottom: 9,
                              flexShrink: 0,
                            }}
                          >
                            <CEIcon icon={fc.icon} size={15} color={fam.iconColor} />
                          </span>
                          <div
                            style={{
                              fontFamily: "'Bricolage Grotesque',sans-serif",
                              fontWeight: 700,
                              fontSize: 15.5,
                              color: '#1B211C',
                              lineHeight: 1.25,
                              overflowWrap: 'break-word',
                              wordBreak: 'break-word',
                            }}
                          >
                            {fc.title}
                          </div>
                        </div>
                        <div
                          style={{
                            fontFamily: "'Space Grotesk',sans-serif",
                            fontSize: 12.5,
                            lineHeight: 1.4,
                            color: textColor,
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                          }}
                        >
                          {fc.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
