import type { CSSProperties } from 'react';
import { css } from '../lib/css';
import { useViewportWidth } from '../hooks/useViewportWidth';

type Align = 'flex-start' | 'flex-end';

const QUESTIONS: { text: string; kind: 'chat' | 'pill'; rot: number; align: Align; indent: number }[] = [
  { text: 'What can I afford?', kind: 'chat', rot: -3, align: 'flex-start', indent: 0 },
  { text: 'Do I already have the ingredients?', kind: 'pill', rot: 2, align: 'flex-end', indent: 28 },
  { text: 'Should I buy more groceries?', kind: 'chat', rot: 2.5, align: 'flex-start', indent: 44 },
  { text: 'Will this fit my health and fitness goals?', kind: 'pill', rot: -2, align: 'flex-end', indent: 8 },
];

export function Problem() {
  const vw = useViewportWidth();
  const isCompact = vw < 1024;

  const problemGridStyle = css(
    `position:relative; max-width:1180px; margin:0 auto; display:grid; grid-template-columns:${isCompact ? '1fr' : '1.05fr 0.95fr'}; gap:${isCompact ? 'clamp(40px,8vw,60px)' : '80px'}; align-items:center;`
  );

  return (
    <section
      data-screen-label="Problem"
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse at 50% -10%, #24422f 0%, #17291E 55%)',
        padding: 'clamp(80px,14vw,150px) clamp(22px,6vw,48px) clamp(70px,13vw,140px)',
        overflow: 'hidden',
      }}
    >
      <div style={problemGridStyle}>
        <div>
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
            The Problem
          </div>
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(34px,4vw,54px)',
              color: '#FAF7EE',
              lineHeight: 1.1,
              margin: 0,
              marginBottom: 14,
            }}
          >
            Cooking isn't the hard part.
          </h2>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(18px,1.8vw,21px)', color: 'rgba(250,247,238,0.65)', marginBottom: 32 }}>
            Making all the decisions before you start is.
          </div>
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: 'rgba(250,247,238,0.55)',
              maxWidth: 440,
              marginBottom: 48,
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            By the time you've answered them all, you've opened YouTube, searched Google, asked your partner, texted a friend, and probably changed your
            mind twice.
          </div>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
            <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: 'clamp(19px,1.8vw,23px)', color: 'rgba(250,247,238,0.38)', fontWeight: 600 }}>
              The problem isn't finding recipes.
            </div>
            <div
              style={{
                position: 'absolute',
                left: '-3%',
                right: '-3%',
                top: '52%',
                height: 2,
                background: 'rgba(227,166,46,0.75)',
                transform: 'rotate(-2deg)',
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(28px,3vw,40px)', color: '#E3A62E', lineHeight: 1.15 }}>
            It's deciding what to cook.
          </div>
        </div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22, padding: '20px 0' }}>
          {QUESTIONS.map((q, i) => {
            const isChat = q.kind === 'chat';
            const wrapStyle: CSSProperties = {
              display: 'flex',
              justifyContent: q.align,
              marginLeft: q.align === 'flex-end' ? 0 : q.indent,
              marginRight: q.align === 'flex-end' ? q.indent : 0,
            };
            const bubbleClass = isChat ? `bubble bubble-chat ${q.align === 'flex-start' ? 'bubble-start' : 'bubble-end'}` : 'bubble bubble-pill';
            const bubbleStyle = { '--rot': `${q.rot}deg` } as CSSProperties;
            return (
              <div key={i} style={wrapStyle}>
                <div className={bubbleClass} style={bubbleStyle}>
                  {q.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
