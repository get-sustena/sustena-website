import { useLayoutEffect, useRef, useState } from 'react';
import { css } from '../lib/css';
import { clamp01, envelope, floatStyle, rowStyle, textStyle, type FloatVariant } from '../lib/animation';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { RESOLVED_LINE_PATH, RESOLVED_LINE_TIGHT_VIEWBOX } from './icons/ResolvedLineMark';
import { CEIcon, type CEIconName } from './icons/CEIcon';
import { WAITLIST_FORM_URL } from '../lib/constants';

const CARD_DEFS: { text: string; top: number; left: number; rot: number; kind: FloatVariant }[] = [
  { text: 'how much do I even have left sef', top: 20, left: 21, rot: -6, kind: 'chat' },
  { text: 'trying to eat healthy though...', top: 66, left: 17, rot: 4, kind: 'chat' },
  { text: 'do we still have onions?', top: 24, left: 70, rot: 5, kind: 'chat' },
  { text: '*opens YouTube again*', top: 70, left: 65, rot: -4, kind: 'pill' },
  { text: 'need to stop by the market', top: 42, left: 9, rot: -3, kind: 'chat' },
  { text: 'abeg what are we cooking today', top: 47, left: 81, rot: 3, kind: 'chat' },
];

const CHAOS_DEFS: { text: string; top: number; left: number; rot: number; kind: FloatVariant }[] = [
  { text: '"easy nigerian dinner"', top: 9, left: 37, rot: -2, kind: 'pill' },
  { text: '"what can I cook with rice?"', top: 87, left: 36, rot: 2, kind: 'pill' },
  { text: '"budget meals"', top: 31, left: 4, rot: -4, kind: 'pill' },
  { text: '"chicken recipes"', top: 6, left: 73, rot: 3, kind: 'pill' },
  { text: '"healthy meals tonight"', top: 91, left: 63, rot: -3, kind: 'pill' },
  { text: '▶ 10-Min Dinners', top: 57, left: 4, rot: -5, kind: 'thumb' },
  { text: '▶ Jollof in 30 mins', top: 60, left: 86, rot: 4, kind: 'thumb' },
  { text: 'what should we eat tonight? 😩', top: 80, left: 13, rot: 3, kind: 'chat' },
  { text: 'idk... you pick 🤷', top: 11, left: 10, rot: -3, kind: 'chat' },
];

const INPUT_DEFS: { label: string; value: string; icon: CEIconName }[] = [
  { label: 'Weekly Budget', value: '₦15,000', icon: 'budget' },
  { label: "What's in my kitchen", value: 'Rice · Tomatoes · Onions · Pepper', icon: 'plan' },
  { label: 'Goal', value: 'Eat Healthier', icon: 'ncd' },
];

const MEAL_DEFS = [
  { meal: 'Breakfast', dish: 'Akara & Pap' },
  { meal: 'Lunch', dish: 'Jollof Rice & Grilled Chicken' },
  { meal: 'Dinner', dish: 'Yam & Egg Sauce' },
];

const SHOPPING_DEFS: { name: string; qty: string }[] = [
  { name: 'Rice', qty: '×2' },
  { name: 'Tomatoes', qty: '' },
  { name: 'Chicken', qty: '' },
  { name: 'Onions', qty: '' },
  { name: 'Pepper', qty: '' },
];

const LEARN_STEPS = ['Slice onions and tomatoes.', 'Heat oil in a pan.', 'Add rice and stir.', 'Simmer and serve.'];

export function Hero() {
  const [wrapperRef, progress] = useScrollProgress<HTMLDivElement>();
  const viewportW = useViewportWidth();
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement | null>(null);

  useLayoutEffect(() => {
    const el = pathRef.current;
    if (el && typeof el.getTotalLength === 'function') {
      try {
        setPathLength(el.getTotalLength());
      } catch {
        // ignore — falls back to the approximate length below
      }
    }
  }, []);

  const p = progress;
  const isMobile = viewportW < 640;
  const isTablet = viewportW >= 640 && viewportW < 1024;
  const isCompact = isMobile || isTablet;

  // --- opening scene: draw the mark, hold, fade out (occupies first 15% of scroll) ---
  const introEnd = 0.15;
  const drawEndP = 0.095;
  const holdEndP = 0.12;
  const drawT = clamp01(p / drawEndP);
  const pathLen = pathLength || 3400;
  const logoFadeT = clamp01((p - holdEndP) / (introEnd - holdEndP));
  const logoOpacity = (1 - logoFadeT).toFixed(3);
  const logoScale = (1 + 0.05 * logoFadeT).toFixed(3);
  const logoWrapStyle = css(
    `position:absolute; inset:0; z-index:4; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:${logoOpacity}; transform:scale(${logoScale});`
  );
  const glowPx = (26 * drawT).toFixed(0);
  const glowAlpha = (0.55 * drawT).toFixed(2);

  // black-to-brand crossfade: pure black while undrawn, full color once the line completes
  const blackOverlayStyle = css(`position:absolute; inset:0; z-index:1; background:#000000; opacity:${(1 - drawT).toFixed(3)}; pointer-events:none;`);

  // p2: remaps the rest of the hero timeline back to a clean 0..1 range after the intro
  const p2 = clamp01((p - introEnd) / (1 - introEnd));
  const env = (a: number, b: number, c?: number, d?: number) => envelope(p2, a, b, c, d);

  // --- background crossfade ---
  const bgLightT = clamp01((p2 - 0.49) / (0.575 - 0.49));
  const bgDarkT = 1 - bgLightT;
  const bgDarkStyle = css(`position:absolute; inset:0; z-index:0; background:radial-gradient(ellipse at 50% 32%, #1c3324 0%, #17291E 65%); opacity:${bgDarkT};`);
  const bgLightStyle = css(`position:absolute; inset:0; z-index:0; background:linear-gradient(180deg, #FAF7EE 0%, #F2EEE3 100%); opacity:${bgLightT};`);

  // --- chrome (progress rail + scroll hint) ---
  const chromeOpacityNum = (1 - clamp01((p2 - 0.85) / 0.05)).toFixed(2);
  const progressFillStyle = css(`width:100%; background:#E3A62E; border-radius:2px; height:${(p * 100).toFixed(1)}%;`);
  const scrollHintOpacity = (1 - clamp01(p / 0.03)).toFixed(2);
  const scrollHintStyle = css(
    `position:absolute; bottom:40px; left:50%; transform:translateX(-50%); z-index:6; text-align:center; color:#FAF7EE; opacity:${scrollHintOpacity}; pointer-events:none; font-family:'JetBrains Mono',monospace;`
  );

  // --- scene 1 ---
  const line1Style = css(textStyle(env(0, 0.018, 0.036, 0.05), { size: 'clamp(20px,2.6vw,32px)', color: '#FAF7EE', weight: 500 }));
  const questionStyle = css(
    textStyle(env(0.055, 0.09, 0.335, 0.365), { size: 'clamp(36px,6vw,92px)', bricolage: true, weight: 800, color: '#FAF7EE', blurAmt: 9 })
  );

  // --- scene 2: decision cards / scene 3: chaos ---
  const cardsBase = 0.095;
  const cardsStagger = 0.016;
  const cardsDur = 0.02;
  const groupOutA = 0.335;
  const groupOutB = 0.365;
  const cards = CARD_DEFS.map((c, i) => {
    const a = cardsBase + i * cardsStagger;
    const e = env(a, a + cardsDur, groupOutA, groupOutB);
    return { text: c.text, style: css(floatStyle(e, { top: c.top, left: c.left, rot: c.rot, variant: c.kind, viewportW })) };
  });

  const chaosBase = 0.2;
  const chaosStagger = 0.013;
  const chaosDur = 0.02;
  const chaos = CHAOS_DEFS.map((c, i) => {
    const a = chaosBase + i * chaosStagger;
    const e = env(a, a + chaosDur, groupOutA, groupOutB);
    return { text: c.text, style: css(floatStyle(e, { top: c.top, left: c.left, rot: c.rot, variant: c.kind, viewportW })) };
  });

  // --- scene 4: problem statements ---
  const problem1Style = css(textStyle(env(0.37, 0.395, 0.415, 0.435), { size: 'clamp(26px,4.2vw,48px)', bricolage: true, weight: 700, color: '#FAF7EE' }));
  const problem2Style = css(textStyle(env(0.44, 0.465, 0.5, 0.525), { size: 'clamp(28px,4.6vw,52px)', bricolage: true, weight: 800, color: '#E3A62E' }));

  // --- phone group ---
  const phoneE = env(0.53, 0.585);
  const shiftT = clamp01((p2 - 0.875) / (0.93 - 0.875));
  const phoneScale = 1 - 0.14 * shiftT;
  const phoneShiftX = (isCompact ? 0 : -190) * shiftT;
  const phoneFadeMul = isCompact ? 1 - shiftT : 1;
  const phoneOuterStyle = css(
    `position:absolute; top:calc(50% + 34px); left:50%; z-index:2; opacity:${(phoneE * phoneFadeMul).toFixed(3)};` +
      `transform:translate(-50%,-50%) translateY(${((1 - phoneE) * 26).toFixed(1)}px) translateX(${phoneShiftX.toFixed(1)}px) scale(${((0.95 + 0.05 * phoneE) * phoneScale).toFixed(3)});`
  );

  // --- phone internal screens ---
  const mkScreenStyle = (e: number) =>
    css(`position:absolute; inset:0; padding:20px 20px 8px; opacity:${clamp01(e)}; transform:translateY(${((1 - clamp01(e)) * 10).toFixed(1)}px);`);
  const screenInputsStyle = mkScreenStyle(env(0.545, 0.575, 0.615, 0.635));
  const screenPlanStyle = mkScreenStyle(env(0.615, 0.645, 0.695, 0.715));
  const screenShoppingStyle = mkScreenStyle(env(0.695, 0.725, 0.775, 0.795));
  const screenLearnStyle = mkScreenStyle(env(0.775, 0.81, 0.92, 0.95));

  const inputRows = INPUT_DEFS.map((r, i) => ({
    ...r,
    style: css(rowStyle(env(0.55 + i * 0.012, 0.55 + i * 0.012 + 0.03, 0.615, 0.635))),
  }));
  const mealRows = MEAL_DEFS.map((r, i) => ({
    ...r,
    style: css(rowStyle(env(0.62 + i * 0.014, 0.62 + i * 0.014 + 0.03, 0.695, 0.715), 'display:block;')),
  }));
  const shoppingRows = SHOPPING_DEFS.map((r, i) => ({
    ...r,
    style: css(rowStyle(env(0.7 + i * 0.011, 0.7 + i * 0.011 + 0.026, 0.775, 0.795), 'justify-content:space-between;')),
  }));

  const learnStepT = clamp01((p2 - 0.775) / (0.9 - 0.775));
  const stepIndex = Math.min(3, Math.floor(learnStepT * 4));
  const learnStepNum = stepIndex + 1;
  const learnStepLabel = `Step ${stepIndex + 1} of 4`;
  const learnStepText = LEARN_STEPS[stepIndex];
  const learnDots = [0, 1, 2, 3].map((i) => ({
    style: { width: 8, height: 8, borderRadius: '50%', background: i <= stepIndex ? '#E3A62E' : '#DBDFD3' },
  }));

  // --- final ---
  const finalE = env(0.875, 0.905);
  const finalOffsetX = isCompact ? 0 : 230;
  const finalGroupStyle = css(
    `position:absolute; top:calc(50% + 34px); left:50%; z-index:2; text-align:${isCompact ? 'center' : 'left'}; max-width:min(380px,86vw); padding:0 ${isCompact ? '20px' : '0'}; opacity:${finalE};` +
      `transform:translate(calc(-50% + ${finalOffsetX}px), -50%) translateY(${((1 - finalE) * 20).toFixed(1)}px);`
  );

  return (
    <div ref={wrapperRef} data-screen-label="Hero (scroll-jacked)" style={{ position: 'relative', height: '1000vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', background: '#17291E' }}>
        <div style={bgDarkStyle} />
        <div style={bgLightStyle} />
        <div style={blackOverlayStyle} />

        <div style={logoWrapStyle}>
          <svg
            viewBox={RESOLVED_LINE_TIGHT_VIEWBOX}
            style={{ height: 'clamp(220px,34vw,400px)', width: 'calc(clamp(220px,34vw,400px) * 1.726824)', overflow: 'visible', display: 'block' }}
          >
            <path
              ref={pathRef}
              d={RESOLVED_LINE_PATH}
              style={{
                fill: 'none',
                stroke: '#FAF7EE',
                strokeWidth: 12,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeDasharray: pathLen,
                strokeDashoffset: (pathLen * (1 - drawT)).toFixed(1),
                filter: `drop-shadow(0 0 ${glowPx}px rgba(227,166,46,${glowAlpha}))`,
              }}
            />
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            right: 26,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 3,
            height: 160,
            background: 'rgba(255,255,255,0.14)',
            borderRadius: 2,
            zIndex: 6,
            opacity: Number(chromeOpacityNum),
          }}
        >
          <div style={progressFillStyle} />
        </div>

        <div style={scrollHintStyle}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
            Scroll
          </div>
          <div style={{ fontSize: 14 }}>↓</div>
        </div>

        <div style={line1Style}>
          <div style={{ width: '100%' }}>Every evening starts with the same question.</div>
        </div>

        <div style={questionStyle}>
          <div style={{ width: '100%' }}>
            What should I <span style={{ color: '#E3A62E' }}>cook</span> today?
          </div>
        </div>

        {cards.map((c, i) => (
          <div key={i} style={c.style}>
            {c.text}
          </div>
        ))}

        {chaos.map((c, i) => (
          <div key={i} style={c.style}>
            {c.text}
          </div>
        ))}

        <div style={problem1Style}>
          <div style={{ width: '100%' }}>The problem isn't finding recipes.</div>
        </div>
        <div style={problem2Style}>
          <div style={{ width: '100%' }}>The problem is deciding what to cook.</div>
        </div>

        <div style={phoneOuterStyle}>
          <div
            style={{
              width: 'clamp(230px,58vw,312px)',
              aspectRatio: '312/652',
              borderRadius: 44,
              background: '#17291E',
              padding: 13,
              boxShadow: '0 40px 100px rgba(15,20,16,0.4), 0 0 0 2px rgba(255,255,255,0.06) inset',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: 32,
                background: '#FAF7EE',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  height: 36,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 22px',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1B211C', fontFamily: "'Space Grotesk',sans-serif" }}>9:41</span>
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 9,
                    transform: 'translateX(-50%)',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#1B211C',
                    opacity: 0.85,
                  }}
                />
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <div style={{ width: 14, height: 10, borderRadius: 2, background: '#1B211C', opacity: 0.7 }} />
                  <div style={{ width: 20, height: 10, borderRadius: 2, border: '1.4px solid #1B211C', opacity: 0.7 }} />
                </div>
              </div>

              <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                <div style={screenInputsStyle}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 11,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#279a5f',
                      marginBottom: 8,
                    }}
                  >
                    Tell Sustena
                  </div>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 24, color: '#1B211C', marginBottom: 18 }}>
                    What matters to you?
                  </div>
                  {inputRows.map((r, i) => (
                    <div key={i} style={r.style}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          background: '#EEF2E7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <CEIcon icon={r.icon} size={18} color="#17291E" />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: '#8a9187', letterSpacing: '0.03em', marginBottom: 3, fontFamily: "'Space Grotesk',sans-serif" }}>
                          {r.label}
                        </div>
                        <div style={{ fontSize: 15, color: '#1B211C', fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" }}>{r.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={screenPlanStyle}>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 24, color: '#1B211C', marginBottom: 2 }}>
                    Your Meal Plan
                  </div>
                  <div style={{ fontSize: 12.5, color: '#8a9187', marginBottom: 16, fontFamily: "'JetBrains Mono',monospace" }}>
                    TODAY · WITHIN BUDGET
                  </div>
                  {mealRows.map((r, i) => (
                    <div key={i} style={r.style}>
                      <div
                        style={{
                          fontSize: 10.5,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: '#8a5f13',
                          fontWeight: 700,
                          marginBottom: 4,
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                      >
                        {r.meal}
                      </div>
                      <div style={{ fontSize: 15, color: '#1B211C', fontWeight: 600, fontFamily: "'Space Grotesk',sans-serif" }}>{r.dish}</div>
                    </div>
                  ))}
                </div>

                <div style={screenShoppingStyle}>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 24, color: '#1B211C', marginBottom: 16 }}>
                    Shopping List
                  </div>
                  {shoppingRows.map((r, i) => (
                    <div key={i} style={r.style}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 7,
                            background: '#17291E',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <CEIcon icon="check" size={13} color="#FAF7EE" stroke={2.6} />
                        </div>
                        <div style={{ fontSize: 15, color: '#1B211C', fontWeight: 500, fontFamily: "'Space Grotesk',sans-serif" }}>{r.name}</div>
                      </div>
                      {r.qty && (
                        <div
                          style={{
                            background: '#F6EBD3',
                            color: '#8a5f13',
                            fontSize: 12,
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: 8,
                            fontFamily: "'JetBrains Mono',monospace",
                          }}
                        >
                          {r.qty}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={screenLearnStyle}>
                  <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 24, color: '#1B211C', marginBottom: 18 }}>
                    Learn Mode
                  </div>
                  <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '22px 20px', boxShadow: '0 10px 30px rgba(23,41,30,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: '#E3A62E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: "'Bricolage Grotesque',sans-serif",
                          fontWeight: 700,
                          fontSize: 15,
                          color: '#1B211C',
                          flexShrink: 0,
                        }}
                      >
                        {learnStepNum}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: '#8a9187',
                          fontFamily: "'JetBrains Mono',monospace",
                        }}
                      >
                        {learnStepLabel}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Bricolage Grotesque',sans-serif",
                        fontWeight: 600,
                        fontSize: 20,
                        color: '#1B211C',
                        marginBottom: 22,
                        lineHeight: 1.3,
                      }}
                    >
                      {learnStepText}
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                      {learnDots.map((d, i) => (
                        <div key={i} style={d.style} />
                      ))}
                    </div>
                    <div
                      style={{
                        background: '#E3A62E',
                        color: '#1B211C',
                        textAlign: 'center',
                        padding: 12,
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: "'Space Grotesk',sans-serif",
                      }}
                    >
                      Next Step
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 100, height: 4, borderRadius: 2, background: '#1B211C', opacity: 0.22 }} />
              </div>
            </div>
          </div>
        </div>

        <div style={finalGroupStyle}>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(16px,1.6vw,19px)', color: '#8a9187', marginBottom: 8 }}>
            From "What should I cook?"
          </div>
          <div
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(30px,3.6vw,46px)',
              color: '#1B211C',
              lineHeight: 1.1,
              marginBottom: 28,
            }}
          >
            Dinner is already <span style={{ color: '#279a5f' }}>planned</span>.
          </div>
          <a
            href={WAITLIST_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#E3A62E',
              color: '#1B211C',
              padding: '14px 28px',
              borderRadius: 12,
              fontSize: 15.5,
              fontWeight: 600,
              marginBottom: 14,
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            Join the Waitlist
          </a>
          <div style={{ fontSize: 13.5, color: '#8a9187', fontFamily: "'Space Grotesk',sans-serif" }}>
            Launching soon. Be among the first to experience Sustena.
          </div>
        </div>
      </div>
    </div>
  );
}
