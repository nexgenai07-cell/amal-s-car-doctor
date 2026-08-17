/**
 * ================================================================
 * TransformationSection.jsx
 * ================================================================
 * "Transformations" -- a compact, self-playing before/after slider
 * on the Gallery page, built on the shared BeforeAfterSlider.
 *
 * WHAT MAKES THIS INSTANCE DIFFERENT FROM THE SERVICE DETAIL PAGE'S
 * SLIDER (both reuse the exact same BeforeAfterSlider component):
 * - `autoPlay` is turned on here, so the divider gently sweeps back
 *   and forth on its own to catch a visitor's eye -- it still stops
 *   the instant a visitor drags it themselves, and the full 0-100
 *   manual drag range is never restricted. See
 *   src/hooks/useBeforeAfterSlider.js for exactly how that works.
 * - `containerClassName` swaps the usual tall 16:9 box for a set of
 *   fixed, shorter heights per breakpoint, which is what actually
 *   keeps this section compact -- an aspect-ratio box would keep
 *   growing taller on wider screens, which is what made this
 *   section feel oversized before.
 * ================================================================ */
import { motion } from "motion/react";
import Container from "../layout/Container";
import BeforeAfterSlider from "../shared/BeforeAfterSlider";
import {
  transformationImages,
  transformationCaption,
} from "../../data/galleryCaseFiles";

export default function TransformationSection() {
  return (
    // Vertical padding trimmed down from the original py-16 lg:py-20
    // as part of making the whole section noticeably more compact.
    <section className="py-12 lg:py-16 bg-secondary/30">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 lg:mb-9"
        >
          <h2 className="font-heading font-bold text-2xl sm:text-3xl">
            Transformations
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          // max-w-xl (down from the original max-w-3xl) is the other
          // half of making this section compact -- a narrower slider
          // paired with the fixed shorter heights below.
          className="relative max-w-xl mx-auto"
        >
          {/* Soft ambient glow sitting behind the slider, so it
              doesn't sit on a completely flat background -- purely
              decorative, sits behind everything else via -z-10. */}
          <div
            aria-hidden="true"
            className="transformation-glow pointer-events-none absolute -inset-6 -z-10"
          />

          <BeforeAfterSlider
            beforeImage={transformationImages.before}
            afterImage={transformationImages.after}
            caption={transformationCaption}
            autoPlay
            containerClassName="h-[220px] sm:h-[300px] md:h-[340px] lg:h-[380px]"
          />
        </motion.div>
      </Container>
    </section>
  );
}
