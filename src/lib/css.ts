import type { CSSProperties } from 'react';

/** Parses a "prop:value; prop2:value2;" CSS declaration string into a React style object. */
export function css(text: string): CSSProperties {
  const style: Record<string, string> = {};
  for (const decl of text.split(';')) {
    const idx = decl.indexOf(':');
    if (idx === -1) continue;
    const rawProp = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!rawProp || !value) continue;
    const prop = rawProp.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    style[prop] = value;
  }
  return style as CSSProperties;
}
