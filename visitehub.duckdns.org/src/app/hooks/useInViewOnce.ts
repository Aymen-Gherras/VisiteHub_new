'use client';

import { useEffect, useRef, useState } from 'react';

type UseInViewOnceOptions = {
  /** Intersection threshold used to trigger visibility. */
  threshold?: number | number[];
  /** Root margin for earlier/later reveal (e.g. "0px 0px -10% 0px"). */
  rootMargin?: string;
};

/**
 * Scroll-triggered reveal helper.
 * - Uses IntersectionObserver to flip `isInView` to true once.
 * - Respects `prefers-reduced-motion` by revealing immediately.
 */
export function useInViewOnce<T extends Element>(options: UseInViewOnceOptions = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = options;

  const ref = useRef<T | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (isInView) return;

    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isInView, threshold, rootMargin]);

  return { ref, isInView };
}
