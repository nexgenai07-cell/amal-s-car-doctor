/**
 * ================================================================
 * TestimonialsSection.jsx
 * ================================================================
 * "What Our Clients Say" -- a fully responsive, infinitely
 * scrolling testimonials showcase, styled after the Magic UI
 * Marquee component (https://magicui.design/docs/components/marquee).
 *
 * LAYOUT (two rows moving in OPPOSITE directions):
 * - Row 1 (top)    -> scrolls LEFT  and disappears off the left
 *                     edge of the screen. This is the Marquee
 *                     component's normal/default direction, so we
 *                     do NOT pass the `reverse` prop here.
 * - Row 2 (bottom) -> scrolls RIGHT and disappears off the right
 *                     edge of the screen. We pass `reverse` to flip
 *                     the animation direction for this row only.
 * Two rows moving opposite ways reads as more dynamic/premium than
 * a single row, and it's the exact pattern used in the Magic UI
 * marquee demo referenced above.
 *
 * WHY A MARQUEE INSTEAD OF THE OLD STATIC GRID:
 * The previous version rendered a fixed 4-column grid, which meant
 * only 4 testimonials were ever visible and the section had no
 * motion of its own. This version can scale to any number of
 * testimonials (see src/data/testimonials.js) without the layout
 * ever needing to change, and it keeps the page feeling alive.
 *
 * BOTH rows pause on hover, so a visitor can stop the scroll to
 * actually read a card without it sliding out from under their
 * cursor -- this is a UX requirement, not just a nice-to-have.
 *
 
 * ================================================================
 */
import { motion } from "motion/react";
import Container from "../layout/Container";
import SectionLabel from "../shared/SectionLabel";
import SectionHeading from "../shared/SectionHeading";
import TestimonialCard from "../shared/TestimonialCard";
import Marquee from "../ui/Marquee";
import { testimonials } from "../../data/testimonials";

export default function TestimonialsSection() {
  // Split the testimonials list into two roughly equal halves so
  // each marquee row shows a different set of cards -- this doubles
  // the amount of unique content visible at any one time compared
  // to running the same full list on both rows.
  const midpoint = Math.ceil(testimonials.length / 2);
  const firstRow = testimonials.slice(0, midpoint);
  const secondRow = testimonials.slice(midpoint);

  return (
    <section className="overflow-hidden pb-5 lg:pb-3  pt-10">
      <Container>
        {/* ---- Section intro: fades/slides in once when it scrolls
                into view, matching the entrance animation style used
                by every other section on the Home page. ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel>Client Reviews</SectionLabel>
          <SectionHeading text="What Our" highlight="Clients Say" />
        </motion.div>
      </Container>

      {/* ---- The marquee rows deliberately live OUTSIDE <Container>
              so the cards can scroll all the way to the true edges of
              the viewport (full-bleed), which is what gives a marquee
              its immersive, "endless" feel. The fade mask below then
              softens those edges so cards don't get hard-cropped. ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mask-fade-x mt-8 flex flex-col gap-0"
      >
        {/* Row 1 (top) -- scrolls LEFT, slightly faster.
            No `reverse` prop => uses Marquee's default direction. */}
        <Marquee pauseOnHover className="[--duration:32s]">
          {firstRow.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </Marquee>

        {/* Row 2 (bottom) -- scrolls RIGHT (opposite of Row 1),
            slightly slower for a layered, non-mechanical feel (the
            two rows never stay in sync). `reverse` is what flips the
            direction to the right. */}
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {secondRow.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
