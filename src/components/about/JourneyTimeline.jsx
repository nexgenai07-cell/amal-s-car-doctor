/**
 * ================================================================
 * JourneyTimeline.jsx
 * ================================================================
 * "Our Journey" — 4 milestones connected by a line with dots,
 * alternating above/below the line from tablet size up (matching
 * the zigzag layout in the design). Only on narrow phone screens
 * does it simplify to a single vertical list, since a horizontal
 * zigzag doesn't fit that narrow.
 *
 * DISTINCT SECTION BACKGROUND:
 * Unlike the plain page background used elsewhere, this section
 * sits inside its own visually-separate panel: a slightly lighter
 * "secondary" tone, a faint technical dot-grid texture (matching
 * the brand's diagnostic/workshop aesthetic -- see
 * `.journey-grid-pattern` in src/index.css), and two soft red glow
 * orbs in opposite corners for depth. The panel fades into the
 * normal page background at its very top and bottom edges so it
 * reads as a deliberate "different section" without a harsh,
 * hard-edged box.
 *
 * "LINE DRAWS IN, THEN LOCKS IN" ANIMATION:
 * On scroll-into-view, the connector line (horizontal on desktop,
 * vertical on mobile) progressively DRAWS IN from its starting end
 * -- growing via a `scaleX` / `scaleY` transform -- while a bright
 * glowing pulse rides along the leading edge of that growth, like
 * the same "traveling light" language used on the Home page's
 * Services Orbit Diagram. The instant the pulse reaches a
 * milestone's position along the line, that milestone's dot
 * PERMANENTLY switches to a solid glowing state and its card
 * fades/scales into view -- so the whole timeline visually
 * "powers on" from left to right (desktop) or top to bottom
 * (mobile) instead of every milestone appearing at once.
 * ================================================================
 */
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Container from "../layout/Container";
import { timelineMilestones } from "../../data/timeline";

// How long the connector line takes to fully draw in, in seconds.
const LINE_FILL_DURATION = 1.6;

/**
 * The distinct panel background for this section: a soft secondary
 * tone, a faint dot-grid texture, two glow orbs, and edge fades so
 * it blends smoothly into the plain page background above/below.
 */
function JourneyBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base panel tone -- slightly lighter than the page background
          so the section reads as its own distinct block. */}
      <div className="absolute inset-0 bg-secondary/50" />

      {/* Faint technical dot-grid texture, giving a "blueprint /
          diagnostic schematic" feel that matches the brand. */}
      <div className="journey-grid-pattern absolute inset-0 opacity-[0.15]" />

      {/* Two soft ambient glow orbs in opposite corners, for depth. */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      {/* Fades the panel into the plain page background at the very
          top and bottom edges, so the transition feels intentional
          rather than a hard-edged box. */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background" />
    </div>
  );
}

export default function JourneyTimeline() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Tracks which milestones have been permanently "lit" once the
  // traveling light/pulse has reached their position on the line.
  const [litUp, setLitUp] = useState(() => timelineMilestones.map(() => false));

  useEffect(() => {
    if (!isInView) return;
    const timers = timelineMilestones.map((_, i) => {
      // Each milestone sits at the horizontal/vertical center of its
      // own "slot" along the line (slot i of N total slots), so the
      // pulse reaches it at that fraction of the total fill duration.
      const centerFraction = (i + 0.5) / timelineMilestones.length;
      const arrivalMs = centerFraction * LINE_FILL_DURATION * 1000;
      return setTimeout(() => {
        setLitUp((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, arrivalMs);
    });
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden py-10 lg:py-14"
    >
      <JourneyBackground />
      <Container>
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-16">
          Our Journey
        </h2>

        {/* ---------------- TABLET & UP: horizontal zigzag timeline ----------------
            Activates from the "md" breakpoint (768px) rather than "lg"
            (1024px) so a tablet like iPad Mini gets the same
            horizontal layout as a large desktop, instead of falling
            back to the mobile stacked list below. */}
        <div className="hidden md:block relative">
          {/* Faint static track behind the line, so the un-drawn
              portion of the path is still subtly visible before the
              light reaches it. */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-tertiary/20 -translate-y-1/2" />

          {/* The animated "line draws in" bar: scaleX grows from 0
              to 1 (left-anchored via origin-left) on scroll-into-view,
              so the bright line visibly travels from the left edge
              to the right edge. */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: LINE_FILL_DURATION, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 right-0 h-0.5 origin-left -translate-y-1/2 bg-primary shadow-[0_0_10px_-1px_var(--color-primary)]"
          />

          {/* Bright glowing pulse riding the leading edge of the line
              as it draws in -- the "light" that arrives at each
              milestone and triggers it to permanently light up. */}
          <motion.span
            initial={{ left: "0%", opacity: 0 }}
            animate={
              isInView
                ? { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }
                : { opacity: 0 }
            }
            transition={{
              duration: LINE_FILL_DURATION,
              ease: "easeInOut",
              times: [0, 0.05, 0.95, 1],
            }}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-light shadow-[0_0_12px_2px_var(--color-primary)]"
          />

          <div className="grid grid-cols-4 relative">
            {timelineMilestones.map((item, i) => (
              <div
                key={item.year}
                className="flex flex-col items-center relative"
              >
                {item.position === "top" && (
                  <TimelineCard item={item} lit={litUp[i]} />
                )}

                {/* Dot sitting exactly on the horizontal line. Starts
                    as a plain outlined dot and permanently switches
                    to a solid glowing dot once the traveling pulse
                    reaches it. */}
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: litUp[i] ? 1.1 : 0.85 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`my-4 z-10 h-3 w-3 shrink-0 rounded-full border-2 transition-[background-color,box-shadow] duration-500 ${
                    litUp[i]
                      ? "border-primary bg-primary shadow-[0_0_14px_-1px_var(--color-primary)]"
                      : "border-tertiary/50 bg-secondary"
                  }`}
                />

                {item.position === "bottom" && (
                  <TimelineCard item={item} lit={litUp[i]} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- PHONE ONLY: simple vertical list ----------------
            Wrapped in "max-w-70 mx-auto" so the whole dot+line+card
            block is centered as a unit on the screen (equal breathing
            room on both sides), instead of stretching full-width and
            reading as pinned to the left edge. */}
        <div className="flex md:hidden flex-col gap-6 relative max-w-70 mx-auto">
          {/* Faint static vertical track, mirroring the desktop track. */}
          <div className="absolute top-0 bottom-0 left-1.25 w-px bg-tertiary/20" />

          {/* The animated vertical "line draws in" bar: scaleY grows
              from 0 to 1 (top-anchored via origin-top) on
              scroll-into-view. */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: LINE_FILL_DURATION, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 left-1.25 w-0.5 origin-top bg-primary shadow-[0_0_10px_-1px_var(--color-primary)]"
          />

          {timelineMilestones.map((item, i) => (
            <div key={item.year} className="flex gap-4 relative">
              <span
                className={`mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 transition-[background-color,box-shadow] duration-500 ${
                  litUp[i]
                    ? "border-primary bg-primary shadow-[0_0_14px_-1px_var(--color-primary)]"
                    : "border-tertiary/50 bg-secondary"
                }`}
              />
              <TimelineCard item={item} align="left" lit={litUp[i]} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// Small reusable card showing a single milestone's year, title, and
// description — used above or below the line on desktop, or inline
// on mobile. Fades and scales into view once its `lit` prop turns
// true (i.e. once the traveling pulse has reached that milestone).
function TimelineCard({ item, align = "center", lit = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={
        lit
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 10, scale: 0.95 }
      }
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-secondary border border-tertiary/20 rounded-lg p-4 w-full max-w-50 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <span className="font-heading font-bold text-primary text-sm">
        {item.year}
      </span>
      <h4 className="font-heading font-semibold text-sm mt-1">{item.title}</h4>
      <p className="text-neutral text-xs mt-1 leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}
