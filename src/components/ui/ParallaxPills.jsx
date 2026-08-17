/**
 * ================================================================
 * ParallaxPills.jsx
 * ================================================================
 * Renders exactly 4 tilted, cursor-reactive pills in a DIAMOND
 * formation, matching the layout the client sketched out:
 *
 *          [ pill 1 ]
 *   [ pill 2 ]     [ pill 3 ]
 *          [ pill 4 ]
 *
 * i.e. one pill centered on top, two pills spread to the left/right
 * edges in the middle row, and one pill centered on the bottom.
 * Because this shape only makes sense for exactly 4 items, this
 * component (unlike a generic grid) expects `pills` to always be a
 * 4-item array in this exact order: [top, left, right, bottom].
 *
 * Each pill:
 *   1. Bursts in from the section's center on page load, traveling
 *      along the SAME direction it rests in — the top pill drops in
 *      from above, the left pill slides in from the left, the right
 *      pill slides in from the right, the bottom pill rises in from
 *      below — so the whole diamond looks like it's exploding
 *      outward from a single center point.
 *   2. Rests at a fixed, alternating tilt (several degrees left/
 *      right), so the group reads as an organic, scattered
 *      arrangement rather than perfectly straight strips — matching
 *      the reactbits.dev "Parallax Pills" reference look. Pills
 *      also alternate between a solid red "prominent" chip and a
 *      dark outlined chip, mirroring the reference's alternating
 *      light/dark chip pattern.
 *   3. Afterwards, gently drifts toward the cursor while the
 *      pointer moves inside the section, for a subtle sense of
 *      depth. The SAME spring that powers the entrance burst is
 *      reused for this drift, and the pill's fixed tilt is combined
 *      into that same transform, so tilt + burst + drift all move
 *      together as one motion instead of fighting each other.
 *
 * Modeled after the interaction pattern of reactbits.dev Pro's
 * "Parallax Pills" component (pro.reactbits.dev/docs/components/
 * parallax-pills) — "bouncy labeled pills that drift along with
 * your cursor". That component sits behind their paid registry, so
 * this is an original recreation of the same visual idea, built
 * from scratch with Motion (motion/react) and styled for this
 * brand's palette, rather than copied from their source.
 *
 * Used on the Contact page (see ReachUsGrid.jsx) to present the
 * workshop's Location, Call, WhatsApp, and Email.
 * ================================================================
 */
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import IconBox from "./IconBox";
import { cn } from "../../utils/cn";

// How far off its resting position (in px) a pill starts before
// bursting inward. Larger = a more dramatic "explosion" on load.
const ENTRY_BURST_DISTANCE = 90;

// Per-position config, in the fixed order [top, left, right,
// bottom]. `axis`/`sign` decide which direction this pill bursts
// in FROM (matching its final resting side, so the motion always
// travels toward the diamond's actual shape). `rotation` is its
// fixed resting tilt in degrees — alternating left/right so no two
// neighboring pills lean the same way.
//
// The top/bottom pills (location + email) stretch much wider than
// left/right on large screens, so the SAME rotation value reads as
// a much bigger tilt once the pill is that wide. `rotation` below
// is a function of `isLargeScreen` for those two so the tilt stays
// visually consistent instead of exploding on desktop.
const PILL_POSITIONS = (isLargeScreen) => [
  { key: "top", axis: "y", sign: -1, rotation: isLargeScreen ? -2 : -6 }, // drops in from above
  { key: "left", axis: "x", sign: -1, rotation: 5 }, // slides in from the left
  { key: "right", axis: "x", sign: 1, rotation: -5 }, // slides in from the right
  { key: "bottom", axis: "y", sign: 1, rotation: isLargeScreen ? 2 : 6 }, // rises in from below
];

// Tracks the `lg` (1024px) breakpoint so rotation can respond to it —
// Tailwind's responsive classes can't reach this value since it's
// applied through Motion's `style` prop, not a CSS class.
function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event) => setIsLarge(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isLarge;
}

/**
 * A single compact, tilted, cursor-reactive pill.
 *
 * @param {object} pill - { icon, label, value, href }
 * @param {number} index - 0=top, 1=left, 2=right, 3=bottom; decides
 *   burst direction, resting tilt, and chip style
 * @param {React.RefObject} containerRef - the section this pill's
 *   cursor-parallax is measured relative to
 * @param {number} parallaxStrength - max drift distance in px
 * @param {number} entryStagger - delay added per index, in seconds
 * @param {boolean} isInView - whether the section has scrolled into
 *   view yet; the burst-in entrance only fires once this is true,
 *   instead of firing unconditionally on mount/refresh
 */
function Pill({
  pill,
  index,
  containerRef,
  parallaxStrength,
  entryStagger,
  isLargeScreen,
  isInView,
}) {
  const Icon = pill.icon;
  const { axis, sign, rotation } = PILL_POSITIONS(isLargeScreen)[index];

  const startX = axis === "x" ? sign * ENTRY_BURST_DISTANCE : 0;
  const startY = axis === "y" ? sign * ENTRY_BURST_DISTANCE : 0;

  // Raw (unsmoothed) x/y targets. They START at the pill's
  // off-position burst position (see startX/startY above), so the
  // very first spring animation IS the "burst in from center"
  // entrance. The exact same values are reused afterward for the
  // cursor-parallax drift, so entrance and drift share one
  // continuous spring instead of two separate animations fighting
  // over the same transform.
  const rawX = useMotionValue(startX);
  const rawY = useMotionValue(startY);
  const driftX = useSpring(rawX, { stiffness: 90, damping: 14 });
  const driftY = useSpring(rawY, { stiffness: 90, damping: 14 });

  // Deterministic per-pill depth variation for the parallax drift,
  // so pills further "back" move less than the rest once the burst
  // has settled.
  const depthMultiplier = 0.6 + (index % 3) * 0.2;

  // Alternates every other pill into the "prominent" solid-red chip
  // style; the rest stay as the standard dark outlined chip —
  // mirrors the reference image's alternating light/dark pattern.
  const isProminent = index % 2 === 0;

  // Fires the "burst inward" motion once the section scrolls into
  // view (not on mount/refresh), staggered per pill, by moving the
  // raw target back to (0, 0). The spring above smoothly animates
  // from the off-position start toward it.
  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(
      () => {
        rawX.set(0);
        rawY.set(0);
      },
      index * entryStagger * 1000,
    );
    return () => clearTimeout(timer);
  }, [isInView, index, entryStagger, rawX, rawY]);

  // Cursor-parallax: once the burst has settled, the pill keeps
  // drifting a little toward wherever the mouse is inside the
  // section, then relaxes back to center when the cursor leaves.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handlePointerMove(event) {
      const bounds = container.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const normalizedX = (event.clientX - centerX) / (bounds.width / 2);
      const normalizedY = (event.clientY - centerY) / (bounds.height / 2);
      rawX.set(normalizedX * parallaxStrength * depthMultiplier);
      rawY.set(normalizedY * parallaxStrength * depthMultiplier);
    }

    function handlePointerLeave() {
      rawX.set(0);
      rawY.set(0);
    }

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);
    return () => {
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [containerRef, parallaxStrength, depthMultiplier, rawX, rawY]);

  return (
    <motion.a
      href={pill.href}
      target={pill.href.startsWith("http") ? "_blank" : undefined}
      rel={pill.href.startsWith("http") ? "noopener noreferrer" : undefined}
      // Fade + scale up from small, timed alongside the x/y burst
      // above, so the pill both "pops" and flies in at once. Stays
      // at the "not yet entered" state until the section is
      // actually scrolled into view.
      initial={{ opacity: 0, scale: 0.4 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: index * entryStagger,
      }}
      whileHover={{ scale: 1.04, rotate: 0 }}
      whileTap={{ scale: 0.97 }}
      // `style` carries every value that must move together as one
      // combined transform: the fixed resting tilt (a plain number,
      // not animated on its own) plus the two spring-driven drift
      // values (driftX/driftY), which are computed continuously in
      // JS for both the entrance burst and the later cursor drift.
      // None of these three can be expressed as static Tailwind
      // classes without Motion silently overwriting them. Every
      // other visual style below is a normal Tailwind class.
      style={{ x: driftX, y: driftY, rotate: rotation }}
      className={cn(
        // Fully rounded pill/capsule shape, matching the reference.
        // Compact height/padding so the strip stays short overall.
        "flex items-center gap-2 rounded-full shrink-0",
        "px-2.5 py-1.5 sm:px-3 sm:py-2",
        "transition-colors duration-200",
        isProminent
          ? "bg-primary border border-primary/60 hover:brightness-110"
          : "bg-secondary border border-tertiary/20 hover:border-primary/40",
      )}
    >
      <IconBox
        icon={Icon}
        variant="filled"
        size="sm"
        // Shrunk further than IconBox's own "sm" default (w-10 h-10)
        // to fit the compact pill height.
        className={cn(
          "shrink-0 w-7 h-7 text-xs",
          isProminent && "bg-white text-primary",
        )}
      />
      <div className="min-w-0">
        <p
          className={cn(
            "font-label text-[8px] uppercase tracking-[0.12em] leading-none mb-0.5",
            isProminent ? "text-white/80" : "text-primary",
          )}
        >
          {pill.label}
        </p>
        <p className="text-white text-[11px] sm:text-xs font-medium leading-tight wrap-break-word">
          {pill.value}
        </p>
      </div>
    </motion.a>
  );
}

/**
 * @param {[object, object, object, object]} pills - exactly 4 items,
 *   in order: [top, left, right, bottom]. Each item is
 *   { icon, label, value, href }.
 * @param {number} [parallaxStrength] - max cursor-drift distance in px
 * @param {number} [entryStagger] - seconds of delay added between each pill's entry
 * @param {string} [className] - extra classes merged onto the outer wrapper
 */
export default function ParallaxPills({
  pills,
  parallaxStrength = 16,
  entryStagger = 0.12,
  className = "",
}) {
  // The section itself is what we measure the cursor position
  // against, so drift direction stays consistent no matter which
  // pill the pointer happens to be closest to.
  const containerRef = useRef(null);
  const isLargeScreen = useIsLargeScreen();
  // `once: true` — the burst-in plays the first time the section is
  // scrolled into view, then stays settled (it doesn't replay every
  // time the user scrolls past it again). `amount: 0.3` triggers it
  // once ~30% of the section is visible, rather than waiting for
  // the very first sliver to appear.
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [top, left, right, bottom] = pills;

  return (
    <div
      ref={containerRef}
      // Extra breathing room on small screens (gap-y-5 / gap-4) so the
      // tilted pills don't visually overlap their neighbors; large
      // screens keep the tighter, more compact spacing.
      className={cn(
        "flex flex-col items-center gap-y-5 sm:gap-y-4 lg:gap-y-4",
        className,
      )}
    >
      {/* Row 1: single pill, centered on top */}
      <div className="flex justify-center">
        <Pill
          pill={top}
          index={0}
          containerRef={containerRef}
          parallaxStrength={parallaxStrength}
          entryStagger={entryStagger}
          isLargeScreen={isLargeScreen}
          isInView={isInView}
        />
      </div>

      {/* Row 2: two pills pushed out to the left/right edges */}
      <div className="flex w-full items-center justify-between gap-4 sm:gap-3">
        <Pill
          pill={left}
          index={1}
          containerRef={containerRef}
          parallaxStrength={parallaxStrength}
          entryStagger={entryStagger}
          isLargeScreen={isLargeScreen}
          isInView={isInView}
        />
        <Pill
          pill={right}
          index={2}
          containerRef={containerRef}
          parallaxStrength={parallaxStrength}
          entryStagger={entryStagger}
          isLargeScreen={isLargeScreen}
          isInView={isInView}
        />
      </div>

      {/* Row 3: single pill, centered on the bottom */}
      <div className="flex justify-center">
        <Pill
          pill={bottom}
          index={3}
          containerRef={containerRef}
          parallaxStrength={parallaxStrength}
          entryStagger={entryStagger}
          isLargeScreen={isLargeScreen}
          isInView={isInView}
        />
      </div>
    </div>
  );
}
