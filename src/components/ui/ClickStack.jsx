/**
 * ================================================================
 * ClickStack.jsx
 * ================================================================
 * A click-to-cycle animated card stack -- a deck of cards fanned out
 * diagonally behind each other. Clicking (or dragging) the FRONT
 * card sends it to the back of the deck and brings the next card
 * forward, looping endlessly. Modeled after the "Click Stack"
 * interaction pattern (pro.reactbits.dev/docs/components/click-stack):
 * click-to-cycle, plus drag-to-dismiss on the front card.
 *
 * Used on the Home page's WhyChooseUs section to present the 4
 * trust features (Genuine Parts, Certified Technicians, Transparent
 * Pricing, Warranty) as an interactive deck instead of a static grid.
 *
 * WHY PERCENTAGES, NOT PIXELS:
 * Every offset (spreadX/Y, depth scale/opacity) is expressed as a
 * percentage of the stack container's own size, and positioning
 * uses top/left percentages rather than fixed px. That means the
 * whole stack is genuinely fluid -- give the wrapping container a
 * different width/height at each breakpoint (done in WhyChooseUs.jsx
 * via Tailwind responsive classes) and the stack automatically
 * re-proportions itself, no JS resize listeners needed.
 *
 * @param {ReactNode[]} items - one renderable card per item (JSX)
 * @param {number} [visibleCount] - how many of the items to render at once
 * @param {number} [spreadXPercent] - horizontal offset per depth level (% of width)
 * @param {number} [spreadYPercent] - vertical offset per depth level (% of height, negative = upward)
 * @param {number} [depthScale] - scale reduction per depth level
 * @param {number} [depthOpacity] - opacity reduction per depth level
 * @param {number} [duration] - reposition transition duration (seconds)
 * @param {(activeIndex: number) => void} [onActiveChange] - fires with the
 *   index (into `items`) of whichever card is currently at the front
 * @param {string} [className] - class for the outer stack container
 * @param {string} [cardClassName] - class applied to every card wrapper
 */
import { useState } from "react";
import { motion } from "motion/react";

export default function ClickStack({
  items,
  visibleCount = 4,
  spreadXPercent = 6,
  spreadYPercent = -6,
  depthScale = 0.055,
  depthOpacity = 0.12,
  duration = 0.55,
  onActiveChange,
  className = "",
  cardClassName = "",
}) {
  // `order` holds the original indices of `items`, reordered so
  // order[0] is always the current front card. Cycling = moving
  // order[0] to the end of the array.
  const [order, setOrder] = useState(() => items.map((_, i) => i));

  const cycleForward = () => {
    setOrder((prev) => {
      const next = [...prev.slice(1), prev[0]];
      onActiveChange?.(next[0]);
      return next;
    });
  };

  return (
    <div className={`relative ${className}`}>
      {order.map((itemIndex, depth) => {
        if (depth >= visibleCount) return null;
        const isFront = depth === 0;

        return (
          <motion.div
            key={itemIndex}
            drag={isFront ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > 60) cycleForward();
            }}
            onClick={isFront ? cycleForward : undefined}
            animate={{
              top: `${depth * spreadYPercent}%`,
              left: `${depth * spreadXPercent}%`,
              scale: 1 - depth * depthScale,
              opacity: 1 - depth * depthOpacity,
            }}
            style={{ zIndex: visibleCount - depth }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            whileHover={
              isFront ? { scale: 1 - depth * depthScale + 0.02 } : undefined
            }
            className={`
              absolute left-0 top-0 h-full w-full
              ${isFront ? "cursor-pointer active:cursor-grabbing" : "pointer-events-none"}
              ${cardClassName}
            `}
          >
            {items[itemIndex]}
          </motion.div>
        );
      })}
    </div>
  );
}
