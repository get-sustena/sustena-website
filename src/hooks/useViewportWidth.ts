import { useEffect, useState } from 'react';

export function useViewportWidth(): number {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1400));

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setWidth(window.innerWidth));
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return width;
}
