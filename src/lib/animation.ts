
export function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

export function envelope(p: number, aIn: number, bIn: number, aOut?: number, bOut?: number): number {
  if (aOut === undefined || bOut === undefined) {
    if (p <= aIn) return 0;
    if (p >= bIn) return 1;
    return (p - aIn) / (bIn - aIn);
  }
  if (p <= aIn || p >= bOut) return 0;
  if (p < bIn) return (p - aIn) / (bIn - aIn);
  if (p < aOut) return 1;
  return 1 - (p - aOut) / (bOut - aOut);
}

export interface TextStyleOpts {
  size?: string | number;
  weight?: number;
  color?: string;
  blurAmt?: number;
  bricolage?: boolean;
}

export function textStyle(e: number, opts: TextStyleOpts = {}): string {
  const { size = 32, weight = 500, color = '#FAF7EE', blurAmt = 0, bricolage = false } = opts;
  const ee = clamp01(e);
  return (
    `position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; padding:0 clamp(20px,7vw,40px); pointer-events:none; z-index:2;` +
    `font-family:${bricolage ? "'Bricolage Grotesque',sans-serif" : "'Space Grotesk',sans-serif"}; font-weight:${weight};` +
    `font-size:${size}; color:${color}; line-height:1.15; opacity:${ee};` +
    `transform:translateY(${((1 - ee) * 16).toFixed(1)}px) scale(${(0.96 + 0.04 * ee).toFixed(3)});` +
    `filter:blur(${(blurAmt * (1 - ee)).toFixed(1)}px);`
  );
}

export type FloatVariant = 'card' | 'thumb' | 'chat' | 'pill';

export interface FloatStyleOpts {
  top: number;
  left: number;
  rot?: number;
  variant?: FloatVariant;
  viewportW?: number;
}

export function floatStyle(e: number, opts: FloatStyleOpts): string {
  const { top, left, rot = 0, variant = 'card', viewportW = 1400 } = opts;
  const ee = clamp01(e);
  const compact = viewportW < 900;
  const jitterX = compact ? rot * 1.3 : 0;
  const jitterY = compact ? rot * 0.9 : 0;
  const leftAdj = compact ? Math.max(13, Math.min(87, 50 + (left - 50) * 0.66 + jitterX)) : left;
  const topAdj = compact ? Math.max(6, Math.min(93, top + jitterY)) : top;
  const rotAdj = compact ? rot * 0.65 : rot;
  let visual: string;
  if (variant === 'thumb') {
    visual = `background:#1f2e24; border:1px solid rgba(255,255,255,0.14); color:#E3A62E; padding:clamp(7px,1.6vw,10px) clamp(11px,2.6vw,16px); border-radius:10px; font-size:clamp(10.5px,2.4vw,13px); font-weight:600; letter-spacing:0.2px; box-shadow:0 10px 26px rgba(0,0,0,0.3); font-family:'Space Grotesk',sans-serif;`;
  } else if (variant === 'chat') {
    visual = `background:#FAF7EE; color:#1B211C; padding:clamp(7px,1.6vw,11px) clamp(11px,2.5vw,17px); border-radius:18px 18px 18px 4px; font-size:clamp(10.5px,2.3vw,14px); box-shadow:0 10px 26px rgba(0,0,0,0.32); font-family:'Space Grotesk',sans-serif;`;
  } else if (variant === 'pill') {
    visual = `background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.13); color:#FAF7EE; padding:clamp(7px,1.6vw,11px) clamp(11px,2.7vw,18px); border-radius:999px; font-size:clamp(10.5px,2.3vw,14px); box-shadow:0 8px 22px rgba(0,0,0,0.24); font-family:'Space Grotesk',sans-serif;`;
  } else {
    visual = `background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.16); color:#FAF7EE; padding:clamp(8px,1.8vw,12px) clamp(12px,2.7vw,19px); border-radius:16px; font-size:clamp(11px,2.5vw,15px); font-weight:600; box-shadow:0 10px 26px rgba(0,0,0,0.26); font-family:'Space Grotesk',sans-serif;`;
  }
  const wrapRule = compact ? `white-space:normal; max-width:${variant === 'thumb' ? '116px' : '138px'}; text-align:center;` : `white-space:nowrap;`;
  return (
    `position:absolute; top:${topAdj}%; left:${leftAdj}%; z-index:2; ${wrapRule} ${visual}` +
    `opacity:${ee}; pointer-events:none;` +
    `transform:translate(-50%,-50%) rotate(${rotAdj}deg) scale(${(0.9 + 0.1 * ee).toFixed(3)}) translateY(${((1 - ee) * 12).toFixed(1)}px);`
  );
}

export function rowStyle(e: number, extra = ''): string {
  const ee = clamp01(e);
  return (
    `background:#fff; border-radius:14px; padding:12px 15px; margin-bottom:9px; box-shadow:0 6px 18px rgba(23,41,30,0.05); display:flex; align-items:center; gap:12px;` +
    `opacity:${ee}; transform:translateY(${((1 - ee) * 14).toFixed(1)}px) scale(${(0.97 + 0.03 * ee).toFixed(3)}); ${extra}`
  );
}

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
