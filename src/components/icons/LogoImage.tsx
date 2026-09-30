import type { CSSProperties } from 'react';
import { RESOLVED_LINE_TIGHT_VIEWBOX } from './ResolvedLineMark';

// Crop the padded source canvas to the mark's tight bounds at small sizes.
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
