// Custom eased scroll for in-page nav links. Native `scroll-behavior: smooth` picks its own
// (short, fixed) duration regardless of distance — on a page with scroll-jacked sections like
// "How It Works" (360vh, pinned), blasting through it that fast makes its scroll-driven panel
// animation flash by instead of reading as motion. Scaling duration with distance and easing
// it ourselves keeps every jump feeling like the same unhurried scroll, however far it travels.

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

  // Hand control back to the user immediately if they grab the wheel/trackpad/touch mid-scroll.
  const onUserInput = () => {
    cancelled = true;
  };
  window.addEventListener('wheel', onUserInput, { passive: true, once: true });
  window.addEventListener('touchstart', onUserInput, { passive: true, once: true });

  function step(now: number) {
    if (cancelled) return;
    const t = Math.min(1, (now - startTime) / duration);
    // behavior: 'instant' is required here — 'auto' explicitly defers to the CSS
    // `scroll-behavior` of the scrolling box (per the CSSOM View spec), so with 'auto' each of
    // our own per-frame jumps would itself get smoothed by the browser and fight this rAF
    // loop's easing, producing a slow-creep-then-lurch curve instead of one clean ease.
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
