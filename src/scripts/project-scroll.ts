import type Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// POCZĄTEK: uruchomienie poziomej galerii na wspólnym scrollu strony.
export function initProjectScroll(lenis: Lenis): () => void {
  const section = document.querySelector<HTMLElement>('#Projects');
  const viewport = section?.querySelector<HTMLElement>('[data-project-viewport]');
  const track = section?.querySelector<HTMLElement>('[data-project-track]');

  if (!section || !viewport || !track) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  section.dataset.scrollEnhanced = 'true';
  viewport.scrollLeft = 0;

  // POCZĄTEK: pomiar drogi — tylko część rzędu wychodząca poza okno galerii.
  const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  // KONIEC: pomiar drogi

  let animation: gsap.core.Tween;

  // POCZĄTEK: pin + przesunięcie — Lenis wygładza scroll, GSAP przekłada go na X.
  const context = gsap.context(() => {
    animation = gsap.to(track, {
      x: () => -getDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${Math.max(1, getDistance())}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
        // Pin wydłuża stronę; aktualizujemy również jej zakres w Lenisie.
        onRefresh: () => lenis.resize(),
      },
    });
  }, section);
  // KONIEC: pin + przesunięcie

  // POCZĄTEK: klawiatura — strzałki przesuwają o jedną kartę, Home/End do krańców.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;

    const trigger = animation.scrollTrigger;
    if (!trigger) return;

    const box = track.querySelector<HTMLElement>('[data-project-box]');
    const step = (box?.getBoundingClientRect().width ?? 160)
      + (Number.parseFloat(getComputedStyle(track).columnGap) || 0);
    let target: number;

    switch (event.key) {
      case 'ArrowRight': target = lenis.targetScroll + step; break;
      case 'ArrowLeft': target = lenis.targetScroll - step; break;
      case 'Home': target = trigger.start; break;
      case 'End': target = trigger.end; break;
      default: return;
    }

    event.preventDefault();
    lenis.scrollTo(gsap.utils.clamp(trigger.start, trigger.end, target));
  };

  viewport.addEventListener('keydown', onKeyDown);
  // KONIEC: klawiatura

  // POCZĄTEK: sprzątanie — HMR nie zostawia drugiego pina ani listenerów.
  return () => {
    viewport.removeEventListener('keydown', onKeyDown);
    context.revert();
    delete section.dataset.scrollEnhanced;
  };
  // KONIEC: sprzątanie
}
// KONIEC: uruchomienie poziomej galerii
