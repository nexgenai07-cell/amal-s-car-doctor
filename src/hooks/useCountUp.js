/**
 * ================================================================
 * useCountUp.js
 * ================================================================
 * A custom hook that animates a number counting up from 0 to a
 * target value, ONLY once the element scrolls into view. Used in
 * the Home page's StatsSection (e.g. "12,000+ Cars Serviced").
 *
 * Uses the browser's IntersectionObserver API to detect when the
 * element enters the viewport, then requestAnimationFrame to
 * smoothly animate the number over the given duration.
 * ================================================================
 */
import { useEffect, useRef, useState } from "react";

/**
 * @param {number} target - the final number to count up to
 * @param {number} [duration] - animation duration in milliseconds
 * @returns {{ count: number, ref: React.RefObject }} - the current
 *   animated count, and a ref to attach to the element you want to
 *   watch for visibility
 */
export function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false); // ensures the animation only plays once

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutQuad easing function for a natural deceleration
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.floor(eased * target));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target); // snap exactly to target at the end
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}
