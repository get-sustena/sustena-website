import type { ReactNode } from 'react';

type Size = 'sm' | 'md' | 'lg';

// The outlined control with a hard offset shadow: hovering darkens the shadow, pressing pushes the button onto it.
const SIZES: Record<Size, string> = {
  sm: 'rounded-[13px] px-3 py-2 text-[14px] shadow-[4px_4px_0_var(--color-green)] hover:shadow-[4px_4px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_var(--color-green)] wide:px-4 wide:py-2.5 wide:text-[15px]',
  md: 'rounded-2xl px-[22px] py-[15px] text-[17px] shadow-[5px_5px_0_var(--color-green)] hover:shadow-[5px_5px_0_var(--color-ink)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0_0_0_var(--color-green)]',
  lg: 'rounded-2xl px-[26px] py-[17px] text-[17px] shadow-[5px_5px_0_var(--color-green)] hover:shadow-[5px_5px_0_var(--color-ink)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-[0_0_0_var(--color-green)] wide:text-[18px]',
};

interface ChunkyLinkProps {
  href: string;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ChunkyLink({ href, size = 'md', className = '', children }: ChunkyLinkProps) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2.5 border-2 border-ink bg-white font-semibold whitespace-nowrap text-ink transition-[translate,box-shadow,background-color] duration-150 ease-out ${SIZES[size]} ${className}`}
    >
      {children}
    </a>
  );
}
