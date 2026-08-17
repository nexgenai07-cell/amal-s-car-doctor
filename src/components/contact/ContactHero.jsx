/**
 * ================================================================
 * ContactHero.jsx
 * ================================================================
 * The very first section shown on the Contact page.
 *
 * This follows the exact same "page hero" pattern already used at
 * the top of the About Us page (see AboutHero.jsx) and the Gallery
 * page (see GalleryHero.jsx), so all three pages open with a
 * visually consistent intro:
 *
 *   small uppercase red label -> large bold heading -> short
 *   description paragraph, all centered, with a field of slowly
 *   drifting particles behind the text for depth.
 *
 * Content shown here (as requested):
 *   Label:       "Get In Touch"
 *   Heading:     "Book Your Appointment"
 *   Description: "Tell us what's wrong — we'll take it from there.
 *                 Experience precision diagnostic and repair
 *                 services tailored to high-performance vehicles."
 *
 * "BREATHING" HEADING:
 * Just like on the About/Gallery heroes, the heading's letter
 * spacing animates gently in and out on an infinite loop. Only the
 * spacing between letters changes (not the font size), so the
 * heading's height never changes and nothing below it shifts
 * position while it animates.
 * ================================================================
 */
import { motion } from "motion/react";
import Container from "../layout/Container";
import SectionLabel from "../shared/SectionLabel";
import RisingParticles from "../shared/RisingParticles";

export default function ContactHero() {
  return (
    // "relative isolate overflow-hidden" keeps the decorative
    // particle layer clipped to this section only, and stops it
    // from creating extra horizontal/vertical scroll on the page.
    // Top/bottom padding matches the same rhythm used by
    // AboutHero and GalleryHero so page transitions feel uniform.
    <section className="relative isolate overflow-hidden pt-10 pb-14 lg:pt-10">
      {/* Decorative drifting particle background. Rendered before
          the text content in the DOM and pushed behind it with
          "-z-10", so it never blocks clicks or text selection. */}
      <RisingParticles className="-z-10" />

      <Container>
        {/* Entire hero text block fades and slides up once on
            page load. max-w-2xl + mx-auto keeps the paragraph at
            a comfortable reading width even on very wide screens,
            while still being fully fluid on smaller screens. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Small uppercase red eyebrow label above the heading */}
          <SectionLabel>Get In Touch</SectionLabel>

          {/* Main page heading. Font size steps up across
              breakpoints (mobile -> tablet -> desktop) so it stays
              readable and well-proportioned at every screen size. */}
          <motion.h1
            animate={{ letterSpacing: ["0em", "0.045em", "0em"] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="font-heading font-bold text-4xl sm:text-5xl mb-4"
          >
            Book Your Appointment
          </motion.h1>

          {/* Supporting description text. Slightly smaller on
              mobile, scaling up on larger screens, matching the
              same responsive pattern used on About/Gallery. */}
          <p className="text-neutral text-base sm:text-lg leading-relaxed">
            Tell us what's wrong — we'll take it from there. Experience
            precision diagnostic and repair services tailored to
            high-performance vehicles.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
