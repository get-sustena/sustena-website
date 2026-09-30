// Scale duration by distance so navigation does not skip through scroll-driven sections.

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function smoothScrollTo(targetY: number): void {
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 1) return;

  const duration = Math.min(1900, Math.max(700, Math.sqrt(Math.abs(distance)) * 26));
  const startTime = performance.now();
  let cancelled = false;

  // User input must cancel programmatic scrolling immediately.
  const onUserInput = () => {
    cancelled = true;
  };
  window.addEventListener('wheel', onUserInput, { passive: true, once: true });
  window.addEventListener('touchstart', onUserInput, { passive: true, once: true });

  function step(now: number) {
    if (cancelled) return;
    const t = Math.min(1, (now - startTime) / duration);
    // `auto` inherits CSS smoothing and would fight the requestAnimationFrame easing.
    window.scrollTo({ top: startY + distance * easeInOutCubic(t), behavior: 'instant' });
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      window.removeEventListener('wheel', onUserInput);
      window.removeEventListener('touchstart', onUserInput);
    }
  }
  requestAnimationFrame(step);
}
