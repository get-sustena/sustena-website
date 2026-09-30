import resolvedLineAsset from '../../assets/images/logo/resolved-line-ink.svg?raw';

function extractPathD(rawSvg: string): string {
  const match = rawSvg.match(/<path[^>]*\sd="([^"]+)"/);
  if (!match) throw new Error('resolved-line-ink.svg: could not find a path "d" attribute');
  return match[1];
}

export const RESOLVED_LINE_PATH = extractPathD(resolvedLineAsset);

export const RESOLVED_LINE_TIGHT_VIEWBOX = '30.497 68.843 153.503 88.893';
