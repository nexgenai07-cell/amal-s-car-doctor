/**
 * ================================================================
 * Marquee.jsx
 * ================================================================
 * A generic, reusable "infinite scroll" row component, modeled on
 * the popular Magic UI Marquee component
 * (https://magicui.design/docs/components/marquee).
 *
 * HOW THE INFINITE LOOP ACTUALLY WORKS:
 * We do NOT use JavaScript (setInterval/requestAnimationFrame) to
 * move the content, because that causes jank and eats CPU/battery.
 * Instead we render the SAME set of children multiple times side
 * by side (controlled by the `repeat` prop), then animate the
 * whole group left with a pure CSS keyframe animation. Because the
 * group is duplicated, the moment the first copy has scrolled
 * completely out of view, the second copy is sitting in the exact
 * same starting position -- so the loop point is invisible to the
 * eye and the scroll never "jumps".
 *
 * The actual @keyframes / animation rules live in `src/index.css`
 * (classes `.marquee-track` and `.marquee-track-vertical`), NOT in
 * this file -- this component only ever applies Tailwind utility
 * classNames plus those two global animation classes, matching this
 * project's rule that all real styling lives in the CSS file, never
 * inline inside a component.
 *
 * PROPS:
 * @param {string}   [className]    - extra classes for the outer track
 * @param {boolean}  [reverse]      - flips the scroll direction
 * @param {boolean}  [pauseOnHover] - freezes the animation on mouse hover
 * @param {boolean}  [vertical]     - scrolls top-to-bottom instead of left-to-right
 * @param {number}   [repeat]       - how many times the children are duplicated
 *                                    (higher = smoother loop on very wide screens,
 *                                    but more DOM nodes -- 4 is a safe default)
 * @param {React.ReactNode} children - the items to display inside the marquee
 * ================================================================
 */
import { cn } from "../../utils/cn";

export default function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        // "group" lets the duplicated tracks below react to hovering
        // anywhere on this outer wrapper (used for the pause-on-hover effect).
        // [--duration:40s] and [--gap:1rem] are CSS custom properties that
        // the animation keyframes and gap spacing (defined in index.css)
        // read from -- callers can override the scroll speed per-instance
        // via the className prop, e.g. className="[--duration:20s]".
        // NOTE: we deliberately do NOT use "overflow-x-hidden" here.
        // Per the CSS overflow spec, setting only one axis to something
        // other than "visible" silently forces the OTHER axis to
        // "auto" -- which still clips/scrolls, it just hides the
        // scrollbar illusion. So a hovered card would still get cut
        // off vertically even with overflow-x-hidden. Real fix: keep
        // overflow-hidden on BOTH axes (still required to hide the
        // duplicated marquee tracks horizontally), but pad the row so
        // there's literal clipping headroom for the hover pop-out.
        //
        // Padding is TOP-HEAVY on purpose (pt-4, only pb-1) because
        // the hover effect (see TestimonialCard.jsx: y:-6 + scale:1.05)
        // moves a card mostly UPWARD -- the card's bottom edge barely
        // moves at all, only its drop-shadow spills a little further
        // down, so it needs far less bottom headroom than top. Going
        // symmetric (py-4) wasted space and, combined with the gap
        // between the two rows in TestimonialsSection, created a big
        // empty-looking band between them -- this asymmetric padding
        // fixes that while still fully covering the hover pop-out.
        "group flex w-full overflow-hidden pt-3 pb-1 gap-(--gap) [--duration:40s] [--gap:0.75rem]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
    >
      {/* Render `repeat` identical copies of the children, laid out in a row.
          Only the FIRST copy needs to be visible to screen readers -- the
          rest are purely decorative duplicates for the seamless loop. */}
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          key={index}
          aria-hidden={index !== 0}
          className={cn(
            "flex shrink-0 justify-around gap-(--gap)",
            vertical
              ? "marquee-track-vertical flex-col"
              : "marquee-track flex-row",
            // Pausing on hover is done purely with CSS (animation-play-state),
            // no React state or event handlers required -- this keeps the
            // interaction perfectly smooth with zero re-renders.
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
