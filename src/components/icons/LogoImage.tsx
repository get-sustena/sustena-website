import type { CSSProperties } from 'react';
import { RESOLVED_LINE_TIGHT_VIEWBOX } from './ResolvedLineMark';

// The provided logo assets are drawn on a full 240x240 canvas with the mark inset within it
// (RESOLVED_LINE_TIGHT_VIEWBOX gives that inset region). Rendering the asset directly at small
// sizes (e.g. next to the nav wordmark) would make the mark itself tiny inside a lot of empty
// padding, so this crops to just the mark's bounding box via plain image scale + offset — no
// SVG manipulation, just the real asset file positioned with CSS.
const CANVAS = 240;
const [TIGHT_X, TIGHT_Y, TIGHT_W, TIGHT_H] = RESOLVED_LINE_TIGHT_VIEWBOX.split(' ').map(Number);

export interface LogoImageProps {
  src: string;
  h: number;
  alt?: string;
  style?: CSSProperties;
}

export function LogoImage({ src, h, alt = '', style }: LogoImageProps) {
  const scale = h / TIGHT_H;
  const w = TIGHT_W * scale;
  return (
    <span style={{ display: 'inline-block', position: 'relative', width: w, height: h, overflow: 'hidden', flexShrink: 0, ...style }}>
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          width: CANVAS * scale,
          height: CANVAS * scale,
          left: -TIGHT_X * scale,
          top: -TIGHT_Y * scale,
          maxWidth: 'none',
        }}
      />
    </span>
  );
}
