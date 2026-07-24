// Raw SVG source (any color variant works — they all share identical path geometry) so the
// mark's geometry has one source of truth: the actual asset file, not a hand-duplicated
// constant. Only the `d` attribute is pulled out; Hero drives color/animation itself.
import resolvedLineAsset from '../../assets/images/logo/resolved-line-ink.svg?raw';

function extractPathD(rawSvg: string): string {
  const match = rawSvg.match(/<path[^>]*\sd="([^"]+)"/);
  if (!match) throw new Error('resolved-line-ink.svg: could not find a path "d" attribute');
  return match[1];
}

// Sustena "The Resolved Line" mark — single logarithmic spiral (r / phi per turn),
// releasing at the golden split into one straight, rounded-terminal tail.
export const RESOLVED_LINE_PATH = extractPathD(resolvedLineAsset);

// The mark's tight bounding box within the asset's full 0-240 canvas — used both by Hero's
// draw-in animation viewBox and by LogoImage's crop math.
export const RESOLVED_LINE_TIGHT_VIEWBOX = '30.497 68.843 153.503 88.893';
