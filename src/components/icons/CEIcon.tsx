import type { CSSProperties, SVGAttributes } from 'react';

// Sustena custom line-icon set.
// 1.5px stroke, round caps/joins, 24x24 viewBox — geometry tuned to echo Poppins' rounded terminals.

export type CEIconName =
  | 'discover'
  | 'plan'
  | 'cook'
  | 'shop'
  | 'profile'
  | 'budget'
  | 'ncd'
  | 'bookmark'
  | 'offline'
  | 'halal'
  | 'vegetarian'
  | 'timer'
  | 'servings'
  | 'market'
  | 'notification'
  | 'settings'
  | 'swap'
  | 'check'
  | 'plus'
  | 'minus'
  | 'chevronDown'
  | 'chevronRight'
  | 'close'
  | 'spoon'
  | 'chart'
  | 'wallet'
  | 'pin';

export interface CEIconProps {
  icon?: CEIconName;
  size?: number;
  color?: string;
  stroke?: number;
  style?: CSSProperties;
  'aria-label'?: string;
}

type Extra = SVGAttributes<SVGElement>;
type Shape =
  | { t: 'path'; d: string; extra?: Extra }
  | { t: 'circle'; cx: number; cy: number; r: number; extra?: Extra }
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx: number; extra?: Extra }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; extra?: Extra }
  | { t: 'ellipse'; cx: number; cy: number; rx: number; ry: number; extra?: Extra };

const P = (d: string, extra?: Extra): Shape => ({ t: 'path', d, extra });
const C = (cx: number, cy: number, r: number, extra?: Extra): Shape => ({ t: 'circle', cx, cy, r, extra });
const R = (x: number, y: number, w: number, h: number, rx: number, extra?: Extra): Shape => ({ t: 'rect', x, y, w, h, rx, extra });
const L = (x1: number, y1: number, x2: number, y2: number, extra?: Extra): Shape => ({ t: 'line', x1, y1, x2, y2, extra });
const E = (cx: number, cy: number, rx: number, ry: number, extra?: Extra): Shape => ({ t: 'ellipse', cx, cy, rx, ry, extra });

const ICONS: Record<CEIconName, Shape[]> = {
  discover: [C(11, 11, 6.5), L(15.7, 15.7, 20, 20)],
  plan: [R(4, 5, 16, 15, 2.5), L(4, 9.5, 20, 9.5), L(8.5, 3, 8.5, 6.5), L(15.5, 3, 15.5, 6.5)],
  cook: [P('M4.5 10.5 H19.5 V13.5 A4.5 4.5 0 0 1 15 18 H9 A4.5 4.5 0 0 1 4.5 13.5 Z'), L(3, 10.5, 21, 10.5), P('M9 6.5 C9.8 5.4 8.2 4.6 9 3.5'), P('M13.5 6.5 C14.3 5.4 12.7 4.6 13.5 3.5')],
  shop: [P('M5 8.5 H19 L17.6 18.2 A1.4 1.4 0 0 1 16.2 19.4 H7.8 A1.4 1.4 0 0 1 6.4 18.2 Z'), P('M8.5 8.5 L10.5 4.5'), P('M15.5 8.5 L13.5 4.5'), L(10, 12, 10, 16), L(14, 12, 14, 16)],
  profile: [C(12, 8, 3.5), P('M5.5 19.5 A6.5 6.5 0 0 1 18.5 19.5')],
  budget: [R(3.5, 6.5, 17, 11.5, 2.5), P('M3.5 10.5 H20.5'), L(16, 14.5, 18, 14.5)],
  ncd: [P('M12 20 C5 15 3 11.2 3 8.3 A4.4 4.4 0 0 1 12 6.6 A4.4 4.4 0 0 1 21 8.3 C21 11.2 19 15 12 20 Z'), P('M6.5 11 H9 L10 9 L12 13 L13 11 H17.5')],
  bookmark: [P('M7 4.5 H17 V19.5 L12 15.5 L7 19.5 Z')],
  offline: [P('M4.5 9 A10 10 0 0 1 19.5 9'), P('M7.8 12.3 A6 6 0 0 1 16.2 12.3'), P('M10.8 15.4 A2 2 0 0 1 13.2 15.4'), L(4, 4, 20, 20)],
  halal: [P('M16.5 4.2 A8 8 0 1 0 16.5 19.8 A6.4 6.4 0 1 1 16.5 4.2 Z')],
  vegetarian: [P('M6 18.5 C6 9.5 12 5 19 5 C19 13.5 14 18.5 6 18.5 Z'), P('M6.5 18 C9.5 15 12.5 12.5 16 10.5')],
  timer: [C(12, 13.5, 6.8), L(12, 13.5, 12, 9.5), L(9.5, 3, 14.5, 3), L(12, 3, 12, 6.7)],
  servings: [C(12, 12, 7), C(12, 12, 3.3)],
  market: [P('M12 21 C7 15.5 5 12.3 5 9.3 A7 7 0 0 1 19 9.3 C19 12.3 17 15.5 12 21 Z'), C(12, 9.3, 2.5)],
  notification: [P('M6 16.5 H18 L16.5 13.5 V10.5 A4.5 4.5 0 0 0 7.5 10.5 V13.5 Z'), P('M10 19.5 A2 2 0 0 0 14 19.5'), L(12, 4.2, 12, 3)],
  settings: [L(4, 8.5, 20, 8.5), L(4, 15.5, 20, 15.5), C(9, 8.5, 2.1, { fill: '#ffffff' }), C(15, 15.5, 2.1, { fill: '#ffffff' })],
  swap: [P('M4 8.5 H17 L14 5.5'), P('M20 15.5 H7 L10 18.5')],
  check: [P('M5 12.5 L9.5 17 L19 7')],
  plus: [L(12, 5, 12, 19), L(5, 12, 19, 12)],
  minus: [L(5, 12, 19, 12)],
  chevronDown: [P('M6 9.5 L12 15.5 L18 9.5')],
  chevronRight: [P('M9.5 6 L15.5 12 L9.5 18')],
  close: [L(6, 6, 18, 18), L(18, 6, 6, 18)],
  spoon: [E(12, 7.5, 3, 4.6), L(12, 12, 12, 20)],
  chart: [L(4, 20, 20, 20), L(7.5, 20, 7.5, 13), L(12, 20, 12, 8), L(16.5, 20, 16.5, 15)],
  wallet: [R(3.5, 6.5, 17, 11.5, 2.5), P('M3.5 10.5 H20.5'), L(16, 14.5, 18, 14.5)],
  pin: [P('M12 21 C7 15.5 5 12.3 5 9.3 A7 7 0 0 1 19 9.3 C19 12.3 17 15.5 12 21 Z'), C(12, 9.3, 2.5)],
};

export function CEIcon({ icon = 'discover', size = 24, color = '#1B211C', stroke = 1.5, style, ...rest }: CEIconProps) {
  const base = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const shapes = ICONS[icon] ?? ICONS.discover;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'block', ...style }}
      role="img"
      aria-label={rest['aria-label'] ?? icon}
    >
      {shapes.map((s, i) => {
        if (s.t === 'path') return <path key={i} d={s.d} {...base} {...s.extra} />;
        if (s.t === 'circle') return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} {...base} {...s.extra} />;
        if (s.t === 'rect') return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} {...base} {...s.extra} />;
        if (s.t === 'line') return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} {...base} {...s.extra} />;
        return <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} {...base} {...s.extra} />;
      })}
    </svg>
  );
}
