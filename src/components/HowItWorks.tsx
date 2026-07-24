import { useLayoutEffect, useRef, useState } from 'react';
import { css } from '../lib/css';
import { clamp01, smoothstep } from '../lib/animation';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useViewportWidth } from '../hooks/useViewportWidth';
import { CEIcon, type CEIconName } from './icons/CEIcon';

const HOW_META: { num: string; icon: CEIconName; title: string }[] = [
  { num: '01', icon: 'budget', title: 'Tell Sustena what matters.' },
  { num: '02', icon: 'plan', title: 'Get a meal plan built for you.' },
  { num: '03', icon: 'shop', title: 'Shop with confidence.' },
  { num: '04', icon: 'cook', title: 'Cook with Learn Mode.' },
];

const NODE_BASE =
  "width:clamp(30px,7vw,38px); height:clamp(30px,7vw,38px); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:clamp(12px,3vw,13.5px); flex-shrink:0; transition:all 0.4s cubic-bezier(.2,.8,.2,1);";

// Continuous, scroll-scrubbed panel choreography (no CSS transition — driven 1:1 by hFloat
// so it tracks scroll exactly instead of a fixed-duration transition racing against it).
// PANEL_FALLOFF sets how much two adjacent panels overlap during the handoff. 0.5 = zero
// overlap AND zero gap (instant cut); we sit just above that (0.56) for the briefest clean
// blend — wide overlaps leave both panels' text visibly double-exposed, which reads as dirty.
const PANEL_FALLOFF = 0.56;

function panelAnim(hFloat: number, i: number, iconBg: string, howPanelPad: string, justify: string) {
  const di = hFloat - i;
  const clD = Math.max(-1, Math.min(1, di / PANEL_FALLOFF));
  const opacity = Math.max(0, Math.cos((clD * Math.PI) / 2));
  const ty = clD * -18;
  const scale = 1 - 0.035 * Math.abs(clD);
  const z = 20 - Math.round(Math.abs(di) * 4);
  const pointerEvents = Math.abs(di) < 0.5 ? 'auto' : 'none';
  const iconScale = (0.72 + 0.28 * (1 - Math.abs(clD))).toFixed(3);
  const iconRotate = (clD * -9).toFixed(1);
  const cardCounterTy = (-(ty * 0.32)).toFixed(1);
  return {
    wrap: css(
      `position:absolute; inset:0; padding:${howPanelPad}; box-sizing:border-box; display:flex; flex-direction:column; justify-content:${justify};` +
        ` opacity:${opacity.toFixed(3)}; transform:translateY(${ty.toFixed(1)}px) scale(${scale.toFixed(3)});` +
        ` pointer-events:${pointerEvents}; z-index:${z}; will-change:transform,opacity;`
    ),
    icon: css(
      `display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:12px; background:${iconBg}; flex-shrink:0; transform:scale(${iconScale}) rotate(${iconRotate}deg);`
    ),
    card: css(
      `background:#FFFFFF; border:1.5px solid #E7E1CB; border-radius:20px; padding:18px 22px; box-shadow:0 20px 44px -18px rgba(23,41,30,0.18), 0 1px 0 rgba(255,255,255,0.8) inset; transform:translateY(${cardCounterTy}px);`
    ),
  };
}

// ---- Mobile/tablet horizontal progress nav: single-track "conveyor belt" ----
// Each step is ONE persistent element that slides/grows/shrinks along a shared track based
// purely on its own distance from the active point — nothing ever crossfades two titles in
// the same spot. Exiting cards slide fully clear off the left edge while the incoming card
// grows out of the small chip on the right — the two never spatially collide.
// These are the dimensions at scale 1 (full size). conveyorAnim() multiplies every pixel
// value by `scale`, which the component derives from the track's actual measured container
// width — the unscaled 344px total track is wider than most phone screens, so without this
// it overflows and gets clipped on the right instead of sitting centered.
const TRACK_CHIP_W = 48;
const TRACK_GAP = 10;
const TRACK_FULL_W = 286;
const TRACK_CHIP_X = TRACK_FULL_W + TRACK_GAP;
const TRACK_TOTAL_W = TRACK_CHIP_X + TRACK_CHIP_W;
// REST_FRAC is how much of each scroll-segment is spent fully settled before the handoff
// starts; the rest is the actual motion — raising it compresses the motion into a shorter
// scroll distance (snappier) without shortening how long things sit still and legible.
const REST_FRAC = 0.55;

function conveyorAnim(hFloat: number, i: number, scale: number) {
  const chipW = TRACK_CHIP_W * scale;
  const fullW = TRACK_FULL_W * scale;
  const chipX = fullW + TRACK_GAP * scale;

  const seg2 = Math.min(2, Math.max(0, Math.floor(hFloat)));
  const segT2 = Math.max(0, Math.min(1, hFloat - seg2));
  const handoffT = Math.max(0, Math.min(1, (segT2 - REST_FRAC) / (1 - REST_FRAC)));
  const easeOutQuad = 1 - (1 - handoffT) ** 2;
  const easeInOut = smoothstep(handoffT);
  // CHIP_PAD centers the circle exactly in the chip box. Whenever the title has zero width
  // (chip states) the circle must be the ONLY sized flex child, or flex-start packing will
  // pull it left of true-center no matter what padding says.
  const CHIP_PAD = (chipW - 26 * scale) / 2;
  const padOuterLeft = 16 * scale;
  const padOuterRight = 10 * scale;

  let x: number;
  let w: number;
  let opacity: number;
  let isActiveStyle: boolean;
  let titleOp: number;
  let padLeft: number;
  let padRight: number;

  if (i < seg2) {
    x = -(fullW + 60 * scale);
    w = fullW * 0.85;
    opacity = 0;
    isActiveStyle = true;
    titleOp = 0;
    padLeft = padOuterLeft;
    padRight = padOuterRight;
  } else if (i === seg2) {
    const t = easeOutQuad;
    x = -(fullW + 60 * scale) * t;
    w = fullW - fullW * 0.15 * t;
    opacity = 1 - t;
    isActiveStyle = true;
    titleOp = 1 - t;
    padLeft = padOuterLeft;
    padRight = padOuterRight;
  } else if (i === seg2 + 1) {
    const t = easeInOut;
    x = chipX * (1 - t);
    w = chipW + (fullW - chipW) * t;
    opacity = 1;
    isActiveStyle = t > 0.5;
    titleOp = Math.max(0, (t - 0.6) / 0.4);
    padLeft = CHIP_PAD + (padOuterLeft - CHIP_PAD) * t;
    padRight = CHIP_PAD + (padOuterRight - CHIP_PAD) * t;
  } else if (i === seg2 + 2) {
    x = chipX;
    w = chipW;
    opacity = handoffT;
    isActiveStyle = false;
    titleOp = 0;
    padLeft = CHIP_PAD;
    padRight = CHIP_PAD;
  } else {
    x = chipX;
    w = chipW;
    opacity = 0;
    isActiveStyle = false;
    titleOp = 0;
    padLeft = CHIP_PAD;
    padRight = CHIP_PAD;
  }

  // colorT: 0 = fully inactive (plain bold number, no inner shape) · 1 = fully active
  // (filled number badge). Only the card growing into active ever crosses between these,
  // fading continuously on the same clock as its own growth.
  const colorT = i < seg2 || i === seg2 ? 1 : i === seg2 + 1 ? easeInOut : 0;
  const numBg = `rgba(227,166,46,${colorT.toFixed(3)})`;
  const tR = Math.round(138 + (27 - 138) * colorT);
  const tG = Math.round(145 + (33 - 145) * colorT);
  const tB = Math.round(135 + (28 - 135) * colorT);
  const numColor = `rgb(${tR},${tG},${tB})`;
  const cardBg = isActiveStyle ? 'rgba(227,166,46,0.09)' : '#FFFFFF';
  const cardBorder = isActiveStyle ? 'rgba(227,166,46,0.4)' : '#DDE0D2';
  const titleOpClamped = Math.max(0, titleOp);

  const circleD = (26 * scale).toFixed(1);
  return {
    wrap: css(
      `position:absolute; top:0; left:0; height:${(44 * scale).toFixed(1)}px; width:${w.toFixed(1)}px; border-radius:${(14 * scale).toFixed(1)}px; background:${cardBg}; border:1.5px solid ${cardBorder}; box-sizing:border-box; overflow:hidden; display:flex; align-items:center; gap:${(9 * scale * titleOpClamped).toFixed(1)}px; padding:0 ${padRight.toFixed(1)}px 0 ${padLeft.toFixed(1)}px; opacity:${Math.max(0, opacity).toFixed(3)}; transform:translateX(${x.toFixed(1)}px); will-change:transform,width;`
    ),
    numStyle: css(
      `width:${circleD}px; height:${circleD}px; min-width:${circleD}px; border-radius:50%; background:${numBg}; border:1.5px solid ${numBg}; color:${numColor}; display:flex; align-items:center; justify-content:center; font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:${(14.5 * scale).toFixed(1)}px; flex-shrink:0;`
    ),
    titleStyle: css(
      `font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:${(14 * scale).toFixed(1)}px; color:#1B211C; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:${(220 * scale * titleOpClamped).toFixed(0)}px; opacity:${titleOpClamped.toFixed(3)};`
    ),
  };
}

export function HowItWorks() {
  const [wrapperRef, howProgress] = useScrollProgress<HTMLElement>();
  const vw = useViewportWidth();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;
  const isCompact = isMobile || isTablet;

  // The 4 step panels hold different amounts of content (panels 1-2's list-style cards run
  // taller than panel 4's single line + progress bar), but mobile gave the right column one
  // fixed height — so the shorter panels had correct padding while the taller ones got
  // clipped top and bottom by the container's overflow:hidden. Measuring each panel's real
  // content height and sizing the container to the tallest one fixes that for all 4 without
  // guessing a magic number that breaks again the next time any copy changes.
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [measuredPanelHeight, setMeasuredPanelHeight] = useState(0);

  // The mobile step-tracker's "conveyor belt" track is laid out in a fixed 344px pixel space
  // (see conveyorAnim) — wider than most phone screens, which clipped it on the right and
  // threw off centering. Measuring the actual available width and scaling the whole track
  // down to fit keeps every distance/position in that animation proportionally correct.
  const trackContainerRef = useRef<HTMLDivElement | null>(null);
  const [trackScale, setTrackScale] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const heights = panelRefs.current.map((el) => el?.scrollHeight ?? 0);
      const maxHeight = Math.max(0, ...heights);
      if (maxHeight > 0) setMeasuredPanelHeight(maxHeight);

      const trackEl = trackContainerRef.current;
      if (trackEl) {
        const available = trackEl.clientWidth;
        setTrackScale(available > 0 ? Math.min(1, available / TRACK_TOTAL_W) : 1);
      }
    };
    measure();
    // Self-hosted fonts swap in after first paint (font-display: swap); re-measure once they
    // land in case the fallback-font metrics wrapped text differently.
    document.fonts?.ready?.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [vw, isCompact]);

  const hp = clamp01(howProgress);
  const hFloat = hp * 3; // 0..3 across the 4 nodes
  const activeStep = Math.min(3, Math.max(0, Math.round(hFloat)));

  const howSteps = HOW_META.map((s, i) => {
    const reached = i < activeStep;
    const isActive = i === activeStep;
    let node: string;
    if (reached) {
      node = NODE_BASE + 'background:#34B673; border:2px solid #34B673; color:#FFFFFF; box-shadow:0 6px 14px -5px rgba(52,182,115,0.55);';
    } else if (isActive) {
      node = NODE_BASE + 'background:#E3A62E; border:2px solid #E3A62E; color:#1B211C; box-shadow:0 8px 18px -5px rgba(227,166,46,0.6); transform:scale(1.08);';
    } else {
      node = NODE_BASE + 'background:#FFFFFF; border:1.5px solid #DDE0D2; color:#B0B5A9;';
    }
    const labelStyle =
      "font-family:'Space Grotesk',sans-serif; font-size:clamp(13.5px,3.4vw,16px); line-height:1.3; transition:color 0.4s ease, font-weight 0.4s ease;" +
      (isActive ? 'color:#1B211C; font-weight:700;' : reached ? 'color:#2B3128; font-weight:600;' : 'color:#B7BCAC; font-weight:600;');
    const connFill = clamp01(hFloat - i);
    return {
      ...s,
      showCheck: reached,
      notLast: i < 3,
      nodeStyle: css(node),
      labelStyle: css(labelStyle),
      textWrapStyle: css(`padding-bottom:${i < 3 ? 22 : 0}px; padding-top:8px;`),
      connectorFillStyle: css(`position:absolute; top:0; left:0; width:100%; background:#34B673; border-radius:2px; height:${(connFill * 100).toFixed(1)}%; transition:height 0.25s ease;`),
    };
  });

  const howPanelPad = isCompact ? 'clamp(16px,4vw,24px) clamp(16px,4.5vw,28px)' : '40px 64px';
  // Compact panels top-align instead of centering: the container is sized to the tallest of
  // the 4 panels (see howRightMinHeightPx below), so a shorter panel centered in that box got
  // padded evenly top AND bottom, reading as oversized whitespace. Anchoring to the top keeps
  // every panel's top padding identical and consistent; any leftover space from a shorter
  // panel only shows below its card, which is far less noticeable than a big gap up top.
  const howJustify = isCompact ? 'flex-start' : 'center';
  const panels = [
    panelAnim(hFloat, 0, 'rgba(227,166,46,0.14)', howPanelPad, howJustify),
    panelAnim(hFloat, 1, 'rgba(52,182,115,0.14)', howPanelPad, howJustify),
    panelAnim(hFloat, 2, 'rgba(227,166,46,0.14)', howPanelPad, howJustify),
    panelAnim(hFloat, 3, 'rgba(52,182,115,0.14)', howPanelPad, howJustify),
  ];

  const conveyorCards = HOW_META.map((s, i) => ({ ...s, ...conveyorAnim(hFloat, i, trackScale) }));
  const mobileTrackWrapStyle = { position: 'relative' as const, width: TRACK_TOTAL_W * trackScale, maxWidth: '100%', height: 44 * trackScale };
  const mobileTrackFillStyle = css(`height:100%; background:#E3A62E; border-radius:3px; width:${((hFloat / 3) * 100).toFixed(1)}%;`);

  // 340/420 are sane fallbacks for the first frame before measurement lands; real content
  // almost always exceeds them, at which point the measured height takes over.
  const howRightMinHeightPx = isCompact ? Math.max(measuredPanelHeight, 340) : Math.max(measuredPanelHeight, 420);
  const howCardStyle = css(
    `width:100%; max-width:1080px; flex-shrink:0; background:#FEFCF6; border:1px solid #DCD3B4; border-radius:${isMobile ? '20px' : '30px'}; box-shadow:0 46px 100px -32px rgba(23,41,30,0.48), 0 10px 28px -12px rgba(23,41,30,0.12), 0 0 0 1px rgba(255,255,255,0.6) inset; display:grid; grid-template-columns:${isCompact ? '1fr' : '300px 1fr'}; ${isCompact ? `grid-template-rows:auto ${howRightMinHeightPx}px;` : ''} overflow:hidden;`
  );
  const howLeftColStyle = css(
    // min-width:0 overrides the browser default of min-width:auto on grid/flex items, which
    // otherwise refuses to shrink this column below its content's natural width — on mobile
    // that content includes the fixed-pixel conveyor track, so without this the column (and
    // the whole card) got forced wider than the viewport regardless of the track's own scale.
    `padding:${isCompact ? 'clamp(14px,3.4vw,20px) clamp(16px,4.2vw,24px) clamp(12px,3vw,16px)' : '48px 36px'}; background:#FEFCF6; display:flex; flex-direction:column; align-items:center; justify-content:center; box-sizing:border-box; min-width:0; ${isCompact ? 'border-bottom:1px solid #EDE7D4;' : ''}`
  );
  const howStepperInnerStyle = css(`width:100%; max-width:${isCompact ? '360px' : '200px'};`);
  const howRightColStyle = css(`position:relative; min-height:${howRightMinHeightPx}px; height:${isCompact ? howRightMinHeightPx + 'px' : 'auto'}; background:#FEFCF6; overflow:hidden;`);

  return (
    <section
      id="how-it-works"
      data-screen-label="How It Works"
      ref={wrapperRef}
      style={{
        position: 'relative',
        height: '360vh',
        backgroundColor: '#ECE5D2',
        backgroundImage:
          'linear-gradient(rgba(23,41,30,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(23,41,30,0.028) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    >
      <div
        className="viewport-fit-height"
        style={{
          position: 'sticky',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(20px,4vw,44px) clamp(18px,4.5vw,48px) clamp(20px,4vw,40px)',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'clamp(12px,2.4vw,20px)', flexShrink: 0 }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 12,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#279a5f',
              fontWeight: 500,
              marginBottom: 'clamp(8px,2vw,16px)',
            }}
          >
            How It Works
          </div>
          <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 'clamp(24px,3.8vw,46px)', color: '#1B211C', lineHeight: 1.14, margin: 0 }}>
            From question to finished meal.
          </h2>
        </div>

        <div style={howCardStyle}>
          {/* LEFT: scroll-driven stepper (desktop) / horizontal progress nav (mobile+tablet) */}
          <div style={howLeftColStyle}>
            <div style={{ display: isCompact ? 'none' : 'block', width: '100%' }}>
              <div style={howStepperInnerStyle}>
                {howSteps.map((st, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={st.nodeStyle}>
                        {st.showCheck ? <CEIcon icon="check" size={16} color="#FFFFFF" stroke={2.6} /> : <span>{st.num}</span>}
                      </div>
                      {st.notLast && (
                        <div style={{ width: 1.5, flex: 1, minHeight: 26, margin: '6px 0', background: '#E7E3D4', borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
                          <div style={st.connectorFillStyle} />
                        </div>
                      )}
                    </div>
                    <div style={st.textWrapStyle}>
                      <div style={st.labelStyle}>{st.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={trackContainerRef}
              style={{ width: isCompact ? '100%' : undefined, minWidth: 0, overflow: 'hidden', display: isCompact ? 'block' : 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 9 }}>
                <div style={mobileTrackWrapStyle}>
                  {conveyorCards.map((cc, i) => (
                    <div key={i} style={cc.wrap}>
                      <span style={cc.numStyle}>{cc.num}</span>
                      <span style={cc.titleStyle}>{cc.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ width: '100%', height: 3, borderRadius: 3, background: '#E7E1CB', overflow: 'hidden' }}>
                <div style={mobileTrackFillStyle} />
              </div>
            </div>
          </div>

          {/* RIGHT: crossfading step panels with product mocks */}
          <div style={howRightColStyle}>
            {/* Panel 01 */}
            <div ref={(el) => { panelRefs.current[0] = el; }} style={panels[0].wrap}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={panels[0].icon}>
                  <CEIcon icon="budget" size={20} color="#E3A62E" />
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.9 }}>
                  Step 01
                </span>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 25, color: '#1B211C', lineHeight: 1.16, marginBottom: 10 }}>
                Tell Sustena what matters.
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, lineHeight: 1.58, color: '#5C6459', marginBottom: 16, maxWidth: 400 }}>
                Set your budget. Tell us what's already in your kitchen. Add your health and fitness goals if you have them.
              </div>
              <div style={panels[0].card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.85 }}>
                    Your Setup
                  </span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: 16, height: 5, borderRadius: 3, background: '#34B673' }} />
                    ))}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderBottom: '1px solid #F0EBDA' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#5C6459' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 8, background: 'rgba(227,166,46,0.16)', flexShrink: 0 }}>
                      <CEIcon icon="budget" size={14} color="#E3A62E" />
                    </span>
                    Weekly budget
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, fontWeight: 700, color: '#1B211C' }}>₦15,000</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderBottom: '1px solid #F0EBDA' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#5C6459' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 8, background: 'rgba(52,182,115,0.16)', flexShrink: 0 }}>
                      <CEIcon icon="plan" size={14} color="#279a5f" />
                    </span>
                    In my kitchen
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 600, color: '#1B211C', textAlign: 'right' }}>Rice · Tomatoes · Onions</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '2px -10px 0', background: 'rgba(52,182,115,0.07)', borderRadius: 10, padding: '11px 10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, color: '#5C6459' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 8, background: 'rgba(52,182,115,0.16)', flexShrink: 0 }}>
                      <CEIcon icon="ncd" size={14} color="#279a5f" />
                    </span>
                    Goal
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, fontWeight: 700, color: '#279a5f' }}>Eat Healthier</span>
                </div>
              </div>
            </div>

            {/* Panel 02 */}
            <div ref={(el) => { panelRefs.current[1] = el; }} style={panels[1].wrap}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={panels[1].icon}>
                  <CEIcon icon="plan" size={20} color="#279a5f" />
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.9 }}>
                  Step 02
                </span>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 25, color: '#1B211C', lineHeight: 1.16, marginBottom: 10 }}>
                Get a meal plan built for you.
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, lineHeight: 1.58, color: '#5C6459', marginBottom: 16, maxWidth: 400 }}>
                Sustena builds a daily or weekly timetable that fits your budget and preferences. No guesswork. No endless scrolling.
              </div>
              <div style={panels[1].card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.85 }}>
                    Tuesday · Meal Plan
                  </span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: 16, height: 5, borderRadius: 3, background: '#34B673' }} />
                    ))}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid #F0EBDA' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E3A62E', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: '#8A9187', width: 66, flexShrink: 0 }}>Breakfast</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, fontWeight: 600, color: '#1B211C' }}>Akara & Pap</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', margin: '0 -12px', background: 'rgba(227,166,46,0.07)', borderRadius: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#279a5f', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: '#8A9187', width: 66, flexShrink: 0 }}>Lunch</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, fontWeight: 600, color: '#1B211C' }}>Jollof Rice & Grilled Chicken</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0 0' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8A9187', flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12, fontWeight: 600, color: '#8A9187', width: 66, flexShrink: 0 }}>Dinner</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, fontWeight: 600, color: '#1B211C' }}>Yam & Egg Sauce</span>
                </div>
              </div>
            </div>

            {/* Panel 03 */}
            <div ref={(el) => { panelRefs.current[2] = el; }} style={panels[2].wrap}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={panels[2].icon}>
                  <CEIcon icon="shop" size={20} color="#E3A62E" />
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.9 }}>
                  Step 03
                </span>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 25, color: '#1B211C', lineHeight: 1.16, marginBottom: 10 }}>
                Shop with confidence.
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, lineHeight: 1.58, color: '#5C6459', marginBottom: 16, maxWidth: 400 }}>
                Missing ingredients are automatically organized into a shopping list, so you know exactly what to buy before leaving home.
              </div>
              <div style={panels[2].card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.85 }}>
                    Shopping List
                  </span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    {[0, 1].map((i) => (
                      <span key={i} style={{ width: 16, height: 5, borderRadius: 3, background: '#34B673' }} />
                    ))}
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: 16, height: 5, borderRadius: 3, background: '#E7E1CB' }} />
                    ))}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(52,182,115,0.12)', border: '1px solid rgba(52,182,115,0.3)', color: '#1f7048', borderRadius: 999, padding: '8px 14px', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
                    <CEIcon icon="check" size={13} color="#34B673" stroke={2.8} />
                    Tomatoes
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(52,182,115,0.12)', border: '1px solid rgba(52,182,115,0.3)', color: '#1f7048', borderRadius: 999, padding: '8px 14px', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
                    <CEIcon icon="check" size={13} color="#34B673" stroke={2.8} />
                    Chicken
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEFCF6', border: '1px solid #DBDFD3', color: '#5C6459', borderRadius: 999, padding: '8px 14px', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
                    Pepper
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEFCF6', border: '1px solid #DBDFD3', color: '#5C6459', borderRadius: 999, padding: '8px 14px', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
                    Seasoning
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEFCF6', border: '1px solid #DBDFD3', color: '#5C6459', borderRadius: 999, padding: '8px 14px', fontFamily: "'Space Grotesk',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
                    Cooking Oil
                  </span>
                </div>
                <div style={{ marginTop: 14, fontFamily: "'Space Grotesk',sans-serif", fontSize: 12.5, color: '#8A9187' }}>Already in your kitchen: Rice · Onions</div>
              </div>
            </div>

            {/* Panel 04 */}
            <div ref={(el) => { panelRefs.current[3] = el; }} style={panels[3].wrap}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={panels[3].icon}>
                  <CEIcon icon="cook" size={20} color="#279a5f" />
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.9 }}>
                  Step 04
                </span>
              </div>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 25, color: '#1B211C', lineHeight: 1.16, marginBottom: 10 }}>
                Cook with Learn Mode.
              </div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14.5, lineHeight: 1.58, color: '#5C6459', marginBottom: 16, maxWidth: 400 }}>
                Recipes become interactive cooking sessions. Move through each step at your own pace with guided instructions.
              </div>
              <div style={panels[3].card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A9187', fontWeight: 500, opacity: 0.85 }}>
                    Jollof Rice
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#E3A62E', fontWeight: 700 }}>Step 3 of 5</span>
                </div>
                <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 18, color: '#1B211C', lineHeight: 1.3, marginBottom: 18 }}>
                  Add the parboiled rice and stir gently into the sauce.
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ height: 5, flex: 1, borderRadius: 3, background: '#34B673' }} />
                  <div style={{ height: 5, flex: 1, borderRadius: 3, background: '#34B673' }} />
                  <div style={{ height: 5, flex: 1, borderRadius: 3, background: '#E3A62E' }} />
                  <div style={{ height: 5, flex: 1, borderRadius: 3, background: '#E7E1CB' }} />
                  <div style={{ height: 5, flex: 1, borderRadius: 3, background: '#E7E1CB' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
